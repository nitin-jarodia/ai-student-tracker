# models/models.py - SQLAlchemy Database Models for PostgreSQL

from sqlalchemy import Column, Integer, String, Float, Boolean, Date, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String(255), unique=True, nullable=False)
    full_name  = Column(String(255), nullable=False)
    password   = Column(String(255), nullable=False)
    role       = Column(String(50), nullable=False, default="teacher")
    is_active  = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Student(Base):
    __tablename__ = "students"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String(255), nullable=False)
    email        = Column(String(255), unique=True)
    roll_number  = Column(String(50), unique=True, nullable=False)
    class_name   = Column(String(50), nullable=False)
    section      = Column(String(10), nullable=False)
    parent_name  = Column(String(255))
    parent_phone = Column(String(20))
    parent_email = Column(String(255))
    address      = Column(Text)
    created_at   = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    performance = relationship("Performance", back_populates="student", cascade="all, delete")
    attendance  = relationship("Attendance",  back_populates="student", cascade="all, delete")
    predictions = relationship("Prediction",  back_populates="student", cascade="all, delete")

class Subject(Base):
    __tablename__ = "subjects"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(255), nullable=False)
    code       = Column(String(50), unique=True, nullable=False)
    class_name = Column(String(50), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    performance = relationship("Performance", back_populates="subject")

class Performance(Base):
    __tablename__ = "performance"

    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    score      = Column(Float, nullable=False)
    max_score  = Column(Float, nullable=False)
    exam_type  = Column(String(100), nullable=False)
    exam_date  = Column(Date, nullable=False)
    remarks    = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    student = relationship("Student", back_populates="performance")
    subject = relationship("Subject", back_populates="performance")

class Attendance(Base):
    __tablename__ = "attendance"

    id         = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    date       = Column(Date, nullable=False)
    status     = Column(String(20), nullable=False)  # present/absent/late
    remarks    = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

    student = relationship("Student", back_populates="attendance")

class Prediction(Base):
    __tablename__ = "predictions"

    id             = Column(Integer, primary_key=True, index=True)
    student_id     = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    risk_level     = Column(String(20), nullable=False)   # LOW/MEDIUM/HIGH
    risk_score     = Column(Float, nullable=False)
    recommendation = Column(Text)
    predicted_at   = Column(TIMESTAMP, server_default=func.now())

    student = relationship("Student", back_populates="predictions")
