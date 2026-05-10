from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os

from model.model import get_model, GDMModel
from model.features import FEATURE_INFO, FEATURE_COLUMNS, RISK_THRESHOLDS

app = FastAPI(
    title="GDM Prediction API",
    description="Gestational Diabetes Mellitus (GDM) Risk Prediction Model",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

class GDMInput(BaseModel):
    age: Optional[float] = Field(default=28, ge=18, le=50, description="Maternal age (years)")
    bmi: Optional[float] = Field(default=25, ge=15, le=50, description="Pre-pregnancy BMI (kg/m²)")
    family_history_diabetes: Optional[int] = Field(default=0, ge=0, le=1, description="Family history of diabetes")
    previous_gdm: Optional[int] = Field(default=0, ge=0, le=1, description="Previous GDM diagnosis")
    previous_macrosomia: Optional[int] = Field(default=0, ge=0, le=1, description="Previous macrosomia")
    pcos: Optional[int] = Field(default=0, ge=0, le=1, description="PCOS diagnosis")
    ethnicity: Optional[str] = Field(default="caucasian", description="Ethnicity")
    fasting_glucose: Optional[float] = Field(default=90, ge=50, le=150, description="Fasting glucose (mg/dL)")
    hba1c: Optional[float] = Field(default=5.3, ge=4.0, le=8.0, description="HbA1c (%)")
    systolic_bp: Optional[float] = Field(default=115, ge=80, le=180, description="Systolic BP (mmHg)")
    diastolic_bp: Optional[float] = Field(default=75, ge=50, le=120, description="Diastolic BP (mmHg)")
    triglycerides: Optional[float] = Field(default=150, ge=50, le=400, description="Triglycerides (mg/dL)")
    parity: Optional[int] = Field(default=0, ge=0, le=10, description="Number of previous pregnancies")
    gestational_age_weeks: Optional[float] = Field(default=12, ge=4, le=24, description="Gestational age (weeks)")
    weight_gain_pregnancy: Optional[float] = Field(default=10, ge=-5, le=30, description="Weight gain (kg)")
    insulin_resistance: Optional[float] = Field(default=2.5, ge=0.5, le=8.0, description="HOMA-IR")

class GDMResult(BaseModel):
    probability: float
    percentage: str
    risk_category: str
    risk_color: str
    risk_icon: str
    risk_message: str
    risk_level: str
    top_risk_factors: List[Dict[str, Any]]
    recommendations: List[Dict[str, str]]

@app.get("/", response_class=HTMLResponse)
async def root():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    return {"message": "GDM Prediction API", "docs": "/docs"}

@app.get("/api/info")
async def get_info():
    return {
        "name": "GDM Prediction Model",
        "version": "1.0.0",
        "description": "Gestational Diabetes Mellitus Risk Prediction",
        "features": FEATURE_INFO,
        "feature_columns": FEATURE_COLUMNS,
        "risk_thresholds": RISK_THRESHOLDS
    }

@app.post("/api/predict", response_model=GDMResult)
async def predict_gdm(input_data: GDMInput):
    try:
        model = get_model()
        if model is None:
            raise HTTPException(status_code=503, detail="Model not trained. Run train_model.py first.")
        
        data = input_data.model_dump()
        result = model.predict(data)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-simple")
async def predict_simple(data: Dict[str, Any]):
    try:
        model = get_model()
        if model is None:
            raise HTTPException(status_code=503, detail="Model not trained. Run train_model.py first.")
        
        result = model.predict(data)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
