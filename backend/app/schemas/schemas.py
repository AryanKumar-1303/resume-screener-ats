from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime
from uuid import UUID

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Job Skill Schema
class JobSkillCreate(BaseModel):
    skill_name: str
    is_required: bool = True

class JobSkillResponse(BaseModel):
    id: UUID
    skill_name: str
    is_required: bool

    class Config:
        from_attributes = True

# Job Schemas
class JobCreate(BaseModel):
    title: str
    department: Optional[str] = "Engineering"
    location: Optional[str] = "Remote"
    employment_type: Optional[str] = "Full-time"
    experience_required_years: float = 0.0
    description: str
    skills: List[JobSkillCreate]

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_required_years: Optional[float] = None
    description: Optional[str] = None
    status: Optional[str] = None

class JobResponse(BaseModel):
    id: UUID
    title: str
    department: Optional[str]
    location: Optional[str]
    employment_type: Optional[str]
    experience_required_years: float
    description: str
    status: str
    created_at: datetime
    skills: List[JobSkillResponse]

    class Config:
        from_attributes = True

# Screening & Candidate Schemas
class ScreeningResultResponse(BaseModel):
    id: UUID
    ats_score: float
    skill_match_score: float
    semantic_score: float
    experience_score: float
    education_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendation: str
    detailed_report: Optional[dict[str, Any]] = None

    class Config:
        from_attributes = True

class CandidateResponse(BaseModel):
    id: UUID
    name: str
    email: str
    phone: str
    location: str
    experience_years: float
    job_id: UUID
    created_at: datetime
    screening_result: Optional[ScreeningResultResponse] = None

    class Config:
        from_attributes = True