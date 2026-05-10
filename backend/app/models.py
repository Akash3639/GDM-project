from datetime import datetime
from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    preferred_language = Column(String, default="en")
    pregnancy_start_date = Column(Date, nullable=False)
    emergency_contact = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    health_logs = relationship("HealthLog", back_populates="user")
    reminders = relationship("Reminder", back_populates="user")
    mood_logs = relationship("MoodLog", back_populates="user")


class HealthLog(Base):
    __tablename__ = "health_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    weight = Column(Float, nullable=False)
    blood_pressure = Column(String, nullable=False)
    sugar_level = Column(Float, nullable=False)
    symptoms = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="health_logs")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    reminder_time = Column(DateTime, nullable=False)
    type = Column(String, default="medicine")
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="reminders")


class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    mood = Column(String, nullable=False)
    note = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mood_logs")
