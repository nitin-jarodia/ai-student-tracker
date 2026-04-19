# main.py - FastAPI Application Entry Point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import models
from app.routes import students, performance, auth

# Auto-create all tables in PostgreSQL
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Student Performance Tracker",
    description="Full-stack AI project for tracking student performance",
    version="1.0.0"
)

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(students.router)
app.include_router(performance.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {
        "message": "AI Student Performance Tracker API is running! ✅",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
