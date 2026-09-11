import re

def clean_text(text: str) -> str:
    if not text:
        return ""
    
    # Remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    # Remove multiple spaces and newlines
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.,;:\-\(\)]', '', text)
    
    return text.strip()