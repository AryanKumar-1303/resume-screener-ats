import re
from datetime import datetime

def extract_experience_years(text: str) -> float:
    # Regex to find year ranges like "2020 - 2023" or "2021 to Present"
    pattern = r'((?:19|20)\d{2})\s*(?:-|to|–)\s*((?:19|20)\d{2}|present|current)'
    matches = re.findall(pattern, text.lower())
    
    total_years = 0.0
    current_year = datetime.now().year
    
    for start, end in matches:
        try:
            start_yr = int(start)
            end_yr = current_year if end in ['present', 'current'] else int(end)
            
            if end_yr >= start_yr:
                total_years += (end_yr - start_yr)
        except ValueError:
            continue
            
    # Cap unreasonable parsing (e.g., if someone wrote 1990-2024 multiple times)
    return min(total_years, 40.0)

def extract_education_level(text: str) -> str:
    text_lower = text.lower()
    if re.search(r'\b(ph\.?d|doctorate)\b', text_lower):
        return "PhD"
    elif re.search(r'\b(master|m\.?tech|m\.?sc|m\.?a|mba)\b', text_lower):
        return "Master's Degree"
    elif re.search(r'\b(bachelor|b\.?tech|b\.?e|b\.?sc|b\.?a|degree)\b', text_lower):
        return "Bachelor's Degree"
    return "Not Specified"