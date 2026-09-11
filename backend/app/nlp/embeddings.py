from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

model = None

def get_model():
    global model
    if model is None:
        try:
            from sentence_transformers import SentenceTransformer
            print("Loading Sentence Transformer model...")
            model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print("SentenceTransformer not available, using TF-IDF fallback:", e)
            model = "TFIDF"
    return model

def calculate_semantic_similarity(resume_text: str, job_description: str) -> float:
    if not resume_text or not job_description:
        return 0.0
    
    m = get_model()
    if m != "TFIDF" and m is not None:
        try:
            embeddings = m.encode([resume_text, job_description])
            resume_vector = embeddings[0].reshape(1, -1)
            job_vector = embeddings[1].reshape(1, -1)
            similarity_matrix = cosine_similarity(resume_vector, job_vector)
            score = float(similarity_matrix[0][0]) * 100
            return max(0.0, min(100.0, score))
        except Exception as e:
            print("Encoding error, falling back to TF-IDF:", e)

    # TF-IDF Cosine Similarity Fallback (Lightweight for Vercel Serverless)
    try:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        score = float(sim[0][0]) * 100
        return max(0.0, min(100.0, score))
    except Exception as e:
        print("TF-IDF error:", e)
        return 0.0