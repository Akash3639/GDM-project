from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    age: int
    email: EmailStr
    password: str
    pregnancy_start_date: date
    preferred_language: str = "en"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    id: int
    name: str
    age: int
    email: EmailStr
    pregnancy_start_date: date
    preferred_language: str
    emergency_contact: str

    class Config:
        from_attributes = True


class HealthLogCreate(BaseModel):
    weight: float
    blood_pressure: str
    sugar_level: float
    symptoms: str = ""


class HealthLogResponse(HealthLogCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MoodLogCreate(BaseModel):
    mood: str
    note: str = ""


class ReminderCreate(BaseModel):
    title: str
    reminder_time: datetime
    type: str


class GDMPredictionInput(BaseModel):
    age: float
    bmi: float
    glucose_level: float
    blood_pressure: float
    insulin: float
    family_history: int


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    history: list[dict[str, str]] = []


class RecommendationResponse(BaseModel):
    warnings: List[str]
    diet_plan: List[str]
    exercises: List[str]
