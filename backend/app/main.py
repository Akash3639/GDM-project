from datetime import date, datetime
from io import BytesIO
from pathlib import Path
from app.services.chatbot import router as chatbot_router
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from .auth import create_access_token, get_current_user, hash_password, verify_password
from .database import Base, engine, get_db
from .ml_model import predict_gdm
from .models import HealthLog, MoodLog, Reminder, User
from .schemas import (
    ChatRequest,
    ForgotPasswordRequest,
    GDMPredictionInput,
    HealthLogCreate,
    MoodLogCreate,
    RecommendationResponse,
    ReminderCreate,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserProfile,
)
from .services.chatbot import generate_reply
from .services.recommendation import build_recommendations

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

Base.metadata.create_all(bind=engine)
app = FastAPI(title="AI Pregnancy Care & GDM Prediction API")
app.include_router(chatbot_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserProfile)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    user = User(
        name=payload.name,
        age=payload.age,
        email=payload.email,
        password_hash=hash_password(payload.password),
        pregnancy_start_date=payload.pregnancy_start_date,
        preferred_language=payload.preferred_language,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=TokenResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token}


@app.post("/auth/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@app.get("/users/me", response_model=UserProfile)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@app.get("/dashboard")
def dashboard(current_user: User = Depends(get_current_user)):
    weeks = max(1, ((date.today() - current_user.pregnancy_start_date).days // 7) + 1)
    tips = [
        "Stay hydrated with 8-10 glasses of water.",
        "Eat frequent balanced meals rich in iron and protein.",
        "Take a gentle walk after meals if your doctor approves.",
    ]
    return {"pregnancy_week": weeks, "daily_tips": tips}


@app.post("/chatbot")
def chatbot(payload: ChatRequest, current_user: User = Depends(get_current_user)):
   reply = generate_reply(payload.message, payload.language or "en", payload.history)
   return {"response": reply}


@app.post("/chatbot/public")
def chatbot_public(payload: ChatRequest):
    reply = generate_reply(payload.message, payload.language or "en", payload.history)
    return {"response": reply}

@app.post("/predict-gdm")
def predict_gdm_endpoint(payload: GDMPredictionInput, current_user: User = Depends(get_current_user)):
    pred, prob = predict_gdm(
        [
            payload.age,
            payload.bmi,
            payload.glucose_level,
            payload.blood_pressure,
            payload.insulin,
            payload.family_history,
        ]
    )
    level = "High Risk" if pred == 1 else "Low Risk"
    explanation = (
        f"Prediction confidence for GDM risk: {prob * 100:.1f}%. "
        "This is a screening aid, not a medical diagnosis."
    )
    return {"risk": level, "probability": prob, "explanation": explanation}


@app.post("/health/log")
def add_health_log(payload: HealthLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    log = HealthLog(user_id=current_user.id, **payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@app.get("/health/logs")
def get_health_logs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(HealthLog).filter(HealthLog.user_id == current_user.id).order_by(HealthLog.created_at).all()


@app.post("/recommendations", response_model=RecommendationResponse)
def recommendations(payload: HealthLogCreate, current_user: User = Depends(get_current_user)):
    warnings, diet, exercise = build_recommendations(payload.weight, payload.sugar_level, payload.blood_pressure)
    return {"warnings": warnings, "diet_plan": diet, "exercises": exercise}


@app.post("/mood")
def add_mood(payload: MoodLogCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    mood = MoodLog(user_id=current_user.id, mood=payload.mood, note=payload.note)
    db.add(mood)
    db.commit()
    db.refresh(mood)
    return mood


@app.post("/reminders")
def add_reminder(payload: ReminderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reminder = Reminder(user_id=current_user.id, title=payload.title, reminder_time=payload.reminder_time, type=payload.type)
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


@app.get("/reminders")
def get_reminders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Reminder).filter(Reminder.user_id == current_user.id).all()


@app.get("/hospitals")
def hospital_finder(lat: float, lng: float, query: str = "hospital"):
    google_key = "SET_GOOGLE_MAPS_API_KEY"
    map_url = (
        "https://www.google.com/maps/search/?api=1"
        f"&query={query}&query_place_id=&center={lat},{lng}&key={google_key}"
    )
    return {"navigation_url": map_url}


@app.get("/emergency")
def emergency_help(current_user: User = Depends(get_current_user)):
    return {
        "message": "Emergency mode enabled",
        "contact": current_user.emergency_contact or "Not set",
        "advice": "Call your doctor or local emergency services immediately for severe symptoms.",
    }


@app.get("/report/pdf")
def generate_report_pdf(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(HealthLog).filter(HealthLog.user_id == current_user.id).order_by(HealthLog.created_at.desc()).limit(5).all()
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    pdf.drawString(50, 800, "AI Pregnancy Care & GDM Report")
    pdf.drawString(50, 780, f"Name: {current_user.name} | Email: {current_user.email}")
    pdf.drawString(50, 760, f"Generated: {datetime.utcnow().isoformat()} UTC")
    y = 730
    for log in logs:
        pdf.drawString(50, y, f"{log.created_at.date()} | Wt: {log.weight} | BP: {log.blood_pressure} | Sugar: {log.sugar_level}")
        y -= 20
    pdf.save()
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=health_report.pdf"})
