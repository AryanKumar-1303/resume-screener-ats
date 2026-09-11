import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from uuid import UUID

from app.database.database import get_db
from app.models.models import Resume, Candidate, Job, User
from app.core.security import get_current_user
from app.core.config import settings
from app.nlp.text_extractor import extract_text
from app.nlp.text_cleaner import clean_text
from app.nlp.skill_extractor import extract_skills, extract_email, extract_phone
from app.nlp.advanced_extractor import extract_experience_years, extract_education_level

router = APIRouter(prefix="/resumes", tags=["Resume Upload & Processing"])

@router.post("/upload/{job_id}")
async def upload_resume(
    job_id: UUID, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Verify Job exists and belongs to user
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".doc"]:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    # Save file locally
    file_path = os.path.join(settings.UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1. NLP Pipeline: Extract & Clean
    raw_text = extract_text(file_path, file.filename)
    cleaned_text = clean_text(raw_text)

    # 2. NLP Pipeline: Extract Entities
    candidate_skills = extract_skills(cleaned_text)
    candidate_email = extract_email(raw_text)
    candidate_phone = extract_phone(raw_text)

    # 3. NLP Pipeline: Real Data Extraction
    exp_years = extract_experience_years(cleaned_text)
    edu_level = extract_education_level(cleaned_text)
    
    # Create Candidate Record
    candidate = Candidate(
        name=file.filename.split(".")[0], # Fallback name
        email=candidate_email,
        phone=candidate_phone,
        job_id=job.id,
        experience_years=exp_years  # <-- Using REAL extracted data
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    # Create Resume Record
    resume = Resume(
        candidate_id=candidate.id,
        filename=file.filename,
        file_path=file_path,
        parsed_text=cleaned_text,
        extracted_data={"skills": candidate_skills,"education": edu_level}
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded and parsed successfully",
        "candidate_id": candidate.id,
        "extracted_skills": candidate_skills
    }