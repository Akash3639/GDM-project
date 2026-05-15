import os

from pathlib import Path
from dotenv import load_dotenv

from fastapi import APIRouter
from pydantic import BaseModel

from groq import Groq

# =====================================================
# LOAD ENV
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")

# =====================================================
# ROUTER
# =====================================================

router = APIRouter()

# =====================================================
# GROQ CONFIG
# =====================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print("GROQ API:", GROQ_API_KEY)

client = Groq(api_key=GROQ_API_KEY)

print("Groq AI chatbot loaded successfully!")

# =====================================================
# REQUEST MODEL
# =====================================================

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    history: list = []

# =====================================================
# SYSTEM PROMPT
# =====================================================

SYSTEM_PROMPT = """
You are an advanced AI Pregnancy Care Assistant.

You help users with:
- Pregnancy care
- Gestational diabetes
- Nutrition
- Exercise
- Emotional wellbeing
- Pregnancy symptoms
- Safe health guidance

Rules:
- Be supportive and professional.
- Give medically safe information.
- Recommend doctors for emergencies.
- Keep responses clear and practical.
- Reply in the same language as the user.
- Support English, Kannada, and Hindi.
"""

# =====================================================
# BUILD PROMPT
# =====================================================

def build_prompt(message, history):

    conversation = SYSTEM_PROMPT + "\n\n"

    if history:

        for item in history[-3:]:

            role = item.get("role", "")
            text = item.get("text", "")

            if role == "user":
                conversation += f"User: {text}\n"

            elif role == "assistant":
                conversation += f"Assistant: {text}\n"

    conversation += f"User: {message}\nAssistant:"

    return conversation

# =====================================================
# GENERATE RESPONSE
# =====================================================

def generate_reply(message: str, history=None):

    try:

        prompt = build_prompt(message, history)

        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=300
        )

        reply = completion.choices[0].message.content

        return (
            reply
            + "\n\n⚠️ This AI assistant provides general informational guidance only."
        )

    except Exception as e:

        print("Groq Error:", str(e))

        return f"Groq API Error: {str(e)}"

# =====================================================
# ROUTE
# =====================================================

@router.post("/chatbot/public")
async def chatbot_public(req: ChatRequest):

    reply = generate_reply(
        req.message,
        req.history
    )

    return {
        "response": reply
    }