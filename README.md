# 🎓 AI Student Performance Tracker

AI-powered full-stack web application for tracking, analyzing and predicting student performance.

---

## 🚀 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite + TailwindCSS + Recharts |
| Backend | Python FastAPI |
| Database | PostgreSQL |
| AI/ML | Scikit-learn + OpenAI API |
| Auth | Firebase (Phase 5) |
| Hosting | AWS (Phase 8) |

---

## ⚡ Quick Start

### 1. Setup Database (pgAdmin)
- Open pgAdmin → Create database: `ai_student_tracker`
- Run `database/schema.sql` in Query Tool
- Run `database/seed.sql` for sample data

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Edit .env — add your PostgreSQL password
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📁 Project Structure
```
ai-student-tracker/
├── frontend/          # React.js app
├── backend/           # FastAPI server
├── database/          # SQL scripts
└── ml_models/         # Trained ML models
```

---

## 🔑 Environment Variables
Edit `backend/.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_student_tracker
SECRET_KEY=your-secret-key
OPENAI_API_KEY=sk-your-key (optional)
```

---

## 👨‍💻 Developer
**Nitin Jarodia** | GitHub: nitin-jarodia
