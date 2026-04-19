# routes/auth.py - Authentication API Endpoints

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from pydantic import BaseModel
from passlib.context import CryptContext
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── Schemas ──
class UserCreate(BaseModel):
    email:     str
    full_name: str
    password:  str
    role:      Optional[str] = "teacher"

class UserLogin(BaseModel):
    email:    str
    password: str

# ── POST Register ──
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = pwd_context.hash(user.password)
    new_user = User(
        email=     user.email,
        full_name= user.full_name,
        password=  hashed,
        role=      user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully!", "id": new_user.id}

# ── POST Login ──
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "message": "Login successful!",
        "user": {
            "id":        db_user.id,
            "email":     db_user.email,
            "full_name": db_user.full_name,
            "role":      db_user.role
        },
        "token": "jwt-token-phase-5"  # Real JWT coming in Phase 5
    }

# ── GET all users ──
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": [
        {"id": u.id, "email": u.email, "full_name": u.full_name, "role": u.role}
        for u in users
    ]}
