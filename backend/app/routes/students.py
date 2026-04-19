# routes/students.py - Student CRUD API Endpoints

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Student
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/students", tags=["Students"])

# ── Pydantic Schemas ──
class StudentCreate(BaseModel):
    name:         str
    email:        Optional[str] = None
    roll_number:  str
    class_name:   str
    section:      str
    parent_name:  Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    address:      Optional[str] = None

class StudentUpdate(BaseModel):
    name:         Optional[str] = None
    email:        Optional[str] = None
    class_name:   Optional[str] = None
    section:      Optional[str] = None
    parent_name:  Optional[str] = None
    parent_phone: Optional[str] = None

# ── GET all students ──
@router.get("/")
def get_all_students(db: Session = Depends(get_db)):
    students = db.query(Student).all()
    result = []
    for s in students:
        result.append({
            "id":           s.id,
            "name":         s.name,
            "email":        s.email,
            "roll_number":  s.roll_number,
            "class_name":   s.class_name,
            "section":      s.section,
            "parent_name":  s.parent_name,
            "parent_phone": s.parent_phone,
        })
    return {"students": result, "total": len(result)}

# ── GET single student ──
@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return {
        "id":           student.id,
        "name":         student.name,
        "email":        student.email,
        "roll_number":  student.roll_number,
        "class_name":   student.class_name,
        "section":      student.section,
        "parent_name":  student.parent_name,
        "parent_phone": student.parent_phone,
        "parent_email": student.parent_email,
        "address":      student.address,
    }

# ── POST create student ──
@router.post("/")
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    # Check duplicate roll number
    existing = db.query(Student).filter(
        Student.roll_number == student.roll_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Roll number already exists")

    new_student = Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return {"message": "Student created successfully!", "id": new_student.id}

# ── PUT update student ──
@router.put("/{student_id}")
def update_student(student_id: int, student: StudentUpdate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.id == student_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Student not found")

    update_data = student.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(existing, key, value)

    db.commit()
    return {"message": "Student updated successfully!"}

# ── DELETE student ──
@router.delete("/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully!"}
