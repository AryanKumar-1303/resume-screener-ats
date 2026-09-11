# AI-Powered Resume Screener & ATS

An end-to-end AI-powered Applicant Tracking System (ATS) and Resume Screener application.

🌐 **Live Demo Website:** [https://resume-screener-ats.vercel.app](https://resume-screener-ats.vercel.app)

---

## 🚀 Features

- **Candidate Screening**: Intelligent resume parsing and ATS scoring matching candidate profiles against job requirements.
- **NLP & Semantic Analysis**: Sentence-Transformers embeddings (ll-MiniLM-L6-v2) and keyword extraction for similarity matching.
- **Skill Gap Analysis**: Identifies matched and missing skills between candidate resumes and job postings.
- **Modern Dashboard**: Built with React, Tailwind CSS, Recharts, and Lucide Icons.
- **RESTful API**: Built with FastAPI, PostgreSQL / SQLAlchemy, and JWT Authentication.

---

## 🛠️ Project Structure

`	ext
├── backend/
│   ├── app/
│   │   ├── core/          # Configuration & security
│   │   ├── database/      # Database models & setup
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── nlp/           # Resume parser, embeddings & scoring algorithms
│   │   ├── routers/       # API endpoints (Auth, Jobs, Resumes, Screening)
│   │   └── schemas/       # Pydantic schemas
│   └── requirements.txt
└── frontend/
    ├── src/               # React pages, components, context & layouts
    ├── package.json
    └── vite.config.js
`

---

## 💻 Getting Started

### 1. Backend Setup

`ash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
`
The FastAPI backend server will start at http://localhost:8000. API docs available at http://localhost:8000/api/docs.

### 2. Frontend Setup

`ash
cd frontend
npm install
npm run dev
`
The React frontend application will start at http://localhost:5173.

---

## 🌐 Live Deployment

- **Frontend & Backend (Vercel):** [https://resume-screener-ats.vercel.app](https://resume-screener-ats.vercel.app)

---

## 📜 License

MIT License
