from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# 'all-MiniLM-L6-v2' is fast, small (~80MB), and perfect for this project.
# It will download automatically the first time this code is executed.
print("Loading Sentence Transformer model. This may take a moment on the first run...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded successfully.")

def calculate_semantic_similarity(resume_text: str, job_description: str) -> float:
    if not resume_text or not job_description:
        return 0.0
    
    # Generate vector embeddings
    embeddings = model.encode([resume_text, job_description])
    
    # Calculate cosine similarity between the two vectors
    resume_vector = embeddings[0].reshape(1, -1)
    job_vector = embeddings[1].reshape(1, -1)
    
    similarity_matrix = cosine_similarity(resume_vector, job_vector)
    
    # Convert to a percentage (0 to 100)
    score = float(similarity_matrix[0][0]) * 100
    
    # Ensure it's between 0 and 100
    return max(0.0, min(100.0, score))