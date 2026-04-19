# config.py - Application Configuration

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres123@localhost:5432/ai_student_tracker"
    SECRET_KEY: str = "ai-student-tracker-secret-key-2025"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    OPENAI_API_KEY: str = ""
    APP_NAME: str = "AI Student Performance Tracker"
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
