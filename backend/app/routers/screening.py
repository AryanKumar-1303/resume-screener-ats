from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database.database import get_db
from app.models.models import Job, Candidate, Resume, ScreeningResult, User
from app.core.security import get_current_user
from app.nlp.embeddings import calculate_semantic_similarity
from app.nlp.scoring import calculate_ats_score

router = APIRouter(prefix="/screening", tags=["ATS Scoring & Matching"])

@router.post("/evaluate/{candidate_id}")
def evaluate_candidate(
    candidate_id: UUID, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    resume = db.query(Resume).filter(Resume.candidate_id == candidate.id).first()
    job = db.query(Job).filter(Job.id == candidate.job_id).first()
    
    if not resume or not job:
        raise HTTPException(status_code=404, detail="Missing resume or job data")

    # 1. Prepare data
    candidate_skills = set([s.lower() for s in resume.extracted_data.get("skills", [])])
    job_skills_required = [s.skill_name.lower() for s in job.skills if s.is_required]
    
    # 2. Skill Matching
    matched_skills = list(candidate_skills.intersection(set(job_skills_required)))
    missing_skills = list(set(job_skills_required) - candidate_skills)
    
    # 3. Semantic Similarity
    semantic_similarity = calculate_semantic_similarity(resume.parsed_text, job.description)
    
    # 4. ATS Scoring Algorithm
    scoring_results = calculate_ats_score(
        matched_skills_count=len(matched_skills),
        total_required_skills=len(job_skills_required),
        semantic_similarity=semantic_similarity,
        candidate_exp=candidate.experience_years,
        required_exp=job.experience_required_years,
        candidate_edu=resume.extracted_data.get("education", "Not Specified"),
    )
    
    # 5. Save Results
    # Delete old result if re-evaluating
    old_result = db.query(ScreeningResult).filter(ScreeningResult.candidate_id == candidate.id).first()
    if old_result:
        db.delete(old_result)
        db.commit()

    screening = ScreeningResult(
        candidate_id=candidate.id,
        ats_score=scoring_results["total_ats_score"],
        skill_match_score=scoring_results["skill_score"],
        semantic_score=scoring_results["semantic_score"],
        experience_score=scoring_results["experience_score"],
        education_score=scoring_results["education_score"],
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        recommendation=scoring_results["recommendation"],
        detailed_report=scoring_results
    )
    
    db.add(screening)
    db.commit()
    db.refresh(screening)
    
    return screening