# routes/performance.py - Performance Tracking & AI Prediction API

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Performance, Student, Subject, Attendance, Prediction
from app.ml.predict import predict_student_risk
from app.services.ai_service import generate_student_report
from pydantic import BaseModel
from datetime import date
from typing import Optional

router = APIRouter(prefix="/performance", tags=["Performance"])

# ── Schemas ──
class PerformanceCreate(BaseModel):
    student_id: int
    subject_id: int
    score:      float
    max_score:  float
    exam_type:  str
    exam_date:  date
    remarks:    Optional[str] = None

class AttendanceCreate(BaseModel):
    student_id: int
    date:       date
    status:     str  # present/absent/late
    remarks:    Optional[str] = None

# ── GET all performance for a student ──
@router.get("/{student_id}")
def get_student_performance(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    records = db.query(Performance).filter(
        Performance.student_id == student_id
    ).all()

    result = []
    for r in records:
        percentage = (r.score / r.max_score) * 100
        # Get subject name
        subject = db.query(Subject).filter(Subject.id == r.subject_id).first()
        result.append({
            "id":           r.id,
            "subject_id":   r.subject_id,
            "subject_name": subject.name if subject else "Unknown",
            "score":        r.score,
            "max_score":    r.max_score,
            "percentage":   round(percentage, 2),
            "exam_type":    r.exam_type,
            "exam_date":    str(r.exam_date),
            "grade":        get_grade(percentage),
            "remarks":      r.remarks
        })

    avg = sum(r["percentage"] for r in result) / len(result) if result else 0

    return {
        "student_id":   student_id,
        "student_name": student.name,
        "records":      result,
        "average":      round(avg, 2),
        "total_exams":  len(result),
        "grade":        get_grade(avg)
    }

# ── POST add performance record ──
@router.post("/")
def add_performance(perf: PerformanceCreate, db: Session = Depends(get_db)):
    new_perf = Performance(**perf.dict())
    db.add(new_perf)
    db.commit()
    db.refresh(new_perf)
    return {"message": "Performance record added!", "id": new_perf.id}

# ── POST add attendance ──
@router.post("/attendance")
def add_attendance(att: AttendanceCreate, db: Session = Depends(get_db)):
    new_att = Attendance(**att.dict())
    db.add(new_att)
    db.commit()
    return {"message": "Attendance marked!"}

# ── GET AI Risk Prediction for a student ──
@router.get("/{student_id}/predict")
def predict_performance(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    records = db.query(Performance).filter(
        Performance.student_id == student_id
    ).all()

    if not records:
        return {"message": "No performance data available for prediction"}

    # Calculate features
    scores      = [(r.score / r.max_score) * 100 for r in records]
    avg_score   = sum(scores) / len(scores)
    failed      = sum(1 for s in scores if s < 40)

    # Score trend
    mid = len(scores) // 2
    if mid > 0:
        first_half  = sum(scores[:mid]) / mid
        second_half = sum(scores[mid:]) / (len(scores) - mid)
        trend       = second_half - first_half
    else:
        trend = 0

    # Attendance percentage
    att_records  = db.query(Attendance).filter(Attendance.student_id == student_id).all()
    present      = sum(1 for a in att_records if a.status == "present")
    attendance   = (present / len(att_records) * 100) if att_records else 80

    # Run prediction
    prediction = predict_student_risk(
        avg_score=       avg_score,
        attendance=      attendance,
        score_trend=     trend,
        failed_subjects= failed
    )

    # Save prediction to DB
    new_pred = Prediction(
        student_id=     student_id,
        risk_level=     prediction["risk_level"],
        risk_score=     prediction["risk_score"],
        recommendation= prediction["recommendation"]
    )
    db.add(new_pred)
    db.commit()

    return {
        "student_name": student.name,
        "avg_score":    round(avg_score, 2),
        "attendance":   round(attendance, 2),
        "prediction":   prediction
    }

# ── GET All Students Summary with Risk Levels ──
@router.get("/summary/all")
def get_all_summary(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    summary  = []

    for student in students:
        records = db.query(Performance).filter(
            Performance.student_id == student.id
        ).all()

        if records:
            scores = [(r.score / r.max_score) * 100 for r in records]
            avg    = sum(scores) / len(scores)
            failed = sum(1 for s in scores if s < 40)
        else:
            avg    = 0
            failed = 0

        att_records = db.query(Attendance).filter(
            Attendance.student_id == student.id
        ).all()
        present    = sum(1 for a in att_records if a.status == "present")
        attendance = (present / len(att_records) * 100) if att_records else 80

        prediction = predict_student_risk(avg, attendance, 0, failed)

        summary.append({
            "id":          student.id,
            "name":        student.name,
            "roll":        student.roll_number,
            "class":       student.class_name,
            "section":     student.section,
            "avg_score":   round(avg, 2),
            "attendance":  round(attendance, 2),
            "risk_level":  prediction["risk_level"],
            "risk_score":  prediction["risk_score"],
            "grade":       get_grade(avg)
        })

    # Sort by risk score descending (highest risk first)
    summary.sort(key=lambda x: x["risk_score"], reverse=True)

    high_risk   = [s for s in summary if s["risk_level"] == "HIGH"]
    medium_risk = [s for s in summary if s["risk_level"] == "MEDIUM"]
    low_risk    = [s for s in summary if s["risk_level"] == "LOW"]

    return {
        "students":    summary,
        "total":       len(summary),
        "high_risk":   len(high_risk),
        "medium_risk": len(medium_risk),
        "low_risk":    len(low_risk)
    }

# ── GET AI Report for student ──
@router.get("/{student_id}/report")
def get_ai_report(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    records = db.query(Performance).filter(
        Performance.student_id == student_id
    ).all()

    if not records:
        return {"message": "No performance data for report generation"}

    scores   = [r.score for r in records]
    subjects = []
    for r in records:
        subject = db.query(Subject).filter(Subject.id == r.subject_id).first()
        if subject:
            subjects.append(subject.name)

    report = generate_student_report(student.name, scores, subjects)
    return {"student_name": student.name, "report": report}

# ── Helper: Grade Calculator ──
def get_grade(percentage: float) -> str:
    if percentage >= 90:   return "A+"
    elif percentage >= 80: return "A"
    elif percentage >= 70: return "B"
    elif percentage >= 60: return "C"
    elif percentage >= 40: return "D"
    else:                  return "F"
