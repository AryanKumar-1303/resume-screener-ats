import spacy
from spacy.matcher import PhraseMatcher
import re

# Load the small English NLP model. 
# (You will need to run: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading en_core_web_sm model...")
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# A comprehensive list of skills for our PhraseMatcher
TECH_SKILLS = [
    "python", "java", "c++", "c", "c#", "javascript", "typescript", "ruby", "php", "go", "rust", "swift",
    "html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask", "fastapi", "spring boot",
    "sql", "mysql", "postgresql", "mongodb", "oracle", "redis", "elasticsearch",
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab", "ci/cd",
    "machine learning", "deep learning", "nlp", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "linux", "bash", "rest api", "graphql", "microservices", "agile", "scrum"
]

matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
patterns = [nlp.make_doc(text) for text in TECH_SKILLS]
matcher.add("TECH_SKILLS", patterns)

def extract_skills(text: str) -> list[str]:
    doc = nlp(text.lower())
    matches = matcher(doc)
    skills = set()
    for match_id, start, end in matches:
        span = doc[start:end]
        skills.add(span.text)
    return list(skills)

def extract_email(text: str) -> str:
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else "Not detected"

def extract_phone(text: str) -> str:
    # A basic regex for phone numbers (adjust based on expected formats)
    phone_pattern = r'\+?\d[\d -]{8,12}\d'
    matches = re.findall(phone_pattern, text)
    return matches[0] if matches else "Not detected"