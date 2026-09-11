from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database.database import get_db
from app.models.models import Job, JobSkill, User
from app.schemas.schemas import JobCreate, JobUpdate, JobResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/jobs", tags=["Jobs Management"])

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job_in: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = Job(
        title=job_in.title,
        department=job_in.department,
        location=job_in.location,
        employment_type=job_in.employment_type,
        experience_required_years=job_in.experience_required_years,
        description=job_in.description,
        user_id=current_user.id
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    for skill in job_in.skills:
        job_skill = JobSkill(
            job_id=job.id,
            skill_name=skill.skill_name.strip(),
            is_required=skill.is_required
        )
        db.add(job_skill)
    
    db.commit()
    db.refresh(job)
    return job

@router.get("", response_model=List[JobResponse])
def get_all_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Job).filter(Job.user_id == current_user.id).order_by(Job.created_at.desc()).all()

@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found.")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: UUID, job_in: JobUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found.")

    update_data = job_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id, Job.user_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job posting not found.")
    
    db.delete(job)
    db.commit()
    return None