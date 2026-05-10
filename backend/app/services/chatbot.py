import os
import requests

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    history: list = []


SYSTEM_PROMPT = (
    "You are a compassionate and knowledgeable pregnancy care AI assistant with expertise in "
    "maternal health, gestational diabetes, nutrition, exercise, and emotional wellbeing during pregnancy. "
    "Provide accurate, evidence-based information while always emphasizing that you are not a substitute "
    "for medical care. Always recommend consulting healthcare providers for specific medical concerns, "
    "especially for urgent symptoms. Be warm, supportive, and thorough in your responses. "
    "Consider the user's pregnancy stage when giving advice and provide practical, actionable suggestions."
)


LOCAL_FAQ = {
    "diet": "A balanced pregnancy diet includes: 6-8 servings of whole grains, 5-6 servings of fruits/vegetables, 3-4 servings of protein, 2-3 servings of dairy, healthy fats, and 8-10 glasses of water. Key nutrients: folic acid, iron, calcium, vitamin D. Avoid raw fish, unpasteurized dairy, deli meats, and excessive caffeine.",
    "exercise": "Safe pregnancy exercises: walking (30 mins daily), swimming, prenatal yoga, stationary cycling, and pelvic floor exercises. Avoid contact sports, activities with falling risk, and exercises lying on your back after 20 weeks. Listen to your body and stay hydrated.",
    "gdm": "Gestational Diabetes Mellitus (GDM) affects 2-10% of pregnancies. Risk factors: age >25, BMI >30, family history, previous GDM. Prevention: balanced diet low in refined carbs, regular exercise, weight management. Screening typically at 24-28 weeks through glucose tolerance test.",
    "warning": "IMMEDIATE medical attention needed for: vaginal bleeding, severe abdominal pain, fluid leakage, decreased fetal movement (<10 movements in 2 hours), severe headache, vision changes, fever >101°F, severe nausea/vomiting, chest pain, or difficulty breathing.",
    "trimester1": "First trimester (weeks 1-12): Focus on folic acid (400-600mcg), manage morning sickness, establish prenatal care, avoid alcohol/tobacco, moderate exercise. Common symptoms: fatigue, nausea, breast tenderness, frequent urination.",
    "trimester2": "Second trimester (weeks 13-27): Often called the 'honeymoon phase'. Baby's movements begin, energy returns. Focus on calcium, iron, protein. Start Kegel exercises, monitor weight gain, consider childbirth classes.",
    "trimester3": "Third trimester (weeks 28-40+): Prepare for delivery. Practice breathing techniques, pack hospital bag, install car seat. Monitor for preeclampsia symptoms, track fetal movements, discuss birth plan with provider.",
    "sleep": "Pregnancy sleep tips: sleep on left side, use pillows for support, establish routine, limit fluids before bedtime, avoid caffeine after noon, consider pregnancy-safe sleep aids like magnesium after consulting provider.",
    "supplements": "Essential pregnancy supplements: Prenatal vitamin with folic acid, vitamin D, iron, calcium, DHA. Always consult provider before starting supplements. Avoid high-dose vitamin A which can cause birth defects.",
    "mental": "Mental health during pregnancy: mood swings are normal due to hormones. Practice self-care, seek support, consider therapy if experiencing depression/anxiety. Postpartum depression risk - watch for symptoms after delivery.",
    "complications": "Common pregnancy complications: gestational diabetes, preeclampsia, anemia, infections. Regular prenatal care helps detect and manage these early. Always report concerning symptoms to your healthcare provider.",
}


INTENT_MAP = {
    "diet": ["diet", "food", "meal", "eat", "nutrition", "snack", "cravings", "hunger", "weight"],
    "exercise": ["exercise", "yoga", "walk", "activity", "workout", "fitness", "movement", "stretch"],
    "gdm": ["diabetes", "gdm", "sugar", "glucose", "insulin", "blood sugar", "gestational"],
    "warning": ["bleeding", "pain", "fever", "headache", "emergency", "warning", "danger", "concern", "worry"],
    "sleep": ["sleep", "insomnia", "rest", "tired", "fatigue", "exhausted", "nap"],
    "supplements": ["folic", "vitamin", "iron", "calcium", "supplement", "prenatal", "dha"],
    "trimester1": ["first trimester", "trimester 1", "weeks 1-12", "early pregnancy"],
    "trimester2": ["second trimester", "trimester 2", "weeks 13-27", "middle pregnancy"],
    "trimester3": ["third trimester", "trimester 3", "weeks 28-40", "late pregnancy"],
    "mental": ["mental health", "depression", "anxiety", "mood", "emotional", "stress", "overwhelmed"],
    "complications": ["complication", "problem", "issue", "risk", "concern", "symptom"],
}


def _detect_intent(text: str) -> str:
    for intent, keywords in INTENT_MAP.items():
        if any(keyword in text for keyword in keywords):
            return intent
    return "general"


def _general_reply() -> str:
    return (
        "I'm your pregnancy care assistant! I can help with: 🤰\n"
        "• Nutrition and meal planning\n"
        "• Safe exercises and fitness\n"
        "• Gestational diabetes concerns\n"
        "• Warning signs and when to seek help\n"
        "• Sleep improvement tips\n"
        "• Supplement guidance\n"
        "• Trimester-specific advice\n"
        "• Mental health and emotional support\n"
        "• General pregnancy complications\n\n"
        "What's your current pregnancy week and what would you like to know?"
    )


def _local_reply(message: str, language: str) -> str:
    text = message.lower()
    intent = _detect_intent(text)
    
    # Get the core response based on intent
    core = LOCAL_FAQ.get(intent, _general_reply())
    
    # Add disclaimer and follow-up questions
    disclaimer = "\n\n⚠️ Always consult your healthcare provider for personalized medical advice."
    follow_up = "\n\nWould you like more specific information about this topic?"
    
    full_response = f"{core}{disclaimer}{follow_up}"

    # Language translations
    if language == "hi":
        return f"🩺 सुझाव: {full_response} गंभीर लक्षण होने पर तुरंत डॉक्टर से संपर्क करें।"
    if language == "kn":
        return f"🩺 ಸಲಹೆ: {full_response} ಗಂಭೀರ ಲಕ್ಷಣಗಳಿದ್ದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
    return f"🩺 {full_response}"


def _build_history_messages(history: list[dict[str, str]] | None) -> list[dict[str, str]]:
    if not history:
        return []
    messages = []
    for item in history[-10:]:
        role = item.get("role", "").strip().lower()
        text = item.get("text", "").strip()
        if role not in {"user", "assistant"} or not text:
            continue
        messages.append({"role": role, "content": text})
    return messages


def generate_reply(message: str, language: str = "en", history=None):
    if not message or not message.strip():
        return _local_reply("general guidance", language)

    api_key = os.getenv("OPENAI_API_KEY")

    # If no API key → fallback
    if not api_key:
        return _local_reply(message, language)

    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    history_messages = _build_history_messages(history)

    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            *history_messages,
            {"role": "user", "content": f"Language: {language}\nQuestion: {message}"}
        ],
        "temperature": 0.3,
        "stream": False   # ✅ IMPORTANT FIX
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    try:
        res = requests.post(
            f"{base_url}/chat/completions",
            json=payload,
            headers=headers,
            timeout=25
        )
        res.raise_for_status()
        data = res.json()

        return data["choices"][0]["message"]["content"]

    except Exception:
        return _local_reply(message, language)
@router.post("/chatbot/public")
async def chatbot_public(req: ChatRequest):
    reply = generate_reply(req.message, req.language, req.history)
    return {"response": reply}