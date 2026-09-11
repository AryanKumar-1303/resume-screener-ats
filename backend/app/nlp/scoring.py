def calculate_ats_score(
    matched_skills_count: int, 
    total_required_skills: int, 
    semantic_similarity: float,
    candidate_exp: float = 0.0,
    required_exp: float = 0.0,
    candidate_edu: str = "Not Specified"
) -> dict:
    
    # 1. FIX: Skill Match Score (No free points if no skills required)
    if total_required_skills > 0:
        skill_score = (matched_skills_count / total_required_skills) * 40.0
    else:
        skill_score = 0.0 

    # 2. Semantic Similarity Score
    semantic_score = (semantic_similarity / 100) * 25.0

    # 3. REAL Experience Match Score
    if required_exp > 0:
        if candidate_exp >= required_exp:
            exp_score = 15.0
        else:
            exp_score = (candidate_exp / required_exp) * 15.0
    else:
        exp_score = 15.0 if candidate_exp > 0 else 5.0 

    # 4. REAL Education Match Score
    edu_score = 0.0
    if candidate_edu in ["Bachelor's Degree", "Master's Degree", "PhD"]:
        edu_score = 10.0

    # 5. Projects & Certifications (Remaining static as base points for now)
    proj_score = 5.0
    cert_score = 5.0

    total_score = skill_score + semantic_score + exp_score + edu_score + proj_score + cert_score

    # Determine Recommendation
    if total_score >= 80:
        recommendation = "Strong Match"
    elif total_score >= 65:
        recommendation = "Good Match"
    elif total_score >= 50:
        recommendation = "Needs Review"
    else:
        recommendation = "Low Match"

    # We are returning the real data in the detailed_report so the frontend can read it
    return {
        "total_ats_score": round(total_score, 2),
        "skill_score": round(skill_score, 2),
        "semantic_score": round(semantic_score, 2),
        "experience_score": round(exp_score, 2),
        "education_score": round(edu_score, 2),
        "recommendation": recommendation,
        "candidate_exp": round(candidate_exp, 1),
        "candidate_edu": candidate_edu,
        "total_required_skills": total_required_skills
    }