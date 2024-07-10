from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

router = APIRouter()

model = SentenceTransformer('all-MiniLM-L6-v2')

class TextInput(BaseModel):
    text: str

class TextListInput(BaseModel):
    texts: List[str]

@router.post("/encode")
async def encode_text(input: TextInput):
    embedding = model.encode(input.text)
    return {"embedding": embedding.tolist()}

@router.post("/similarity")
async def compute_similarity(input: TextListInput):
    if len(input.texts) != 2:
        raise HTTPException(status_code=400, detail="Please provide exactly two texts for similarity computation")
    embeddings = model.encode(input.texts)
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    return {"similarity": float(similarity)}

@router.post("/search")
async def similarity_search(query: TextInput, corpus: TextListInput):
    query_embedding = model.encode(query.text)
    corpus_embeddings = model.encode(corpus.texts)
    similarities = cosine_similarity([query_embedding], corpus_embeddings)[0]
    sorted_indices = np.argsort(similarities)[::-1]
    results = [
        {"text": corpus.texts[idx], "similarity": float(similarities[idx])}
        for idx in sorted_indices
    ]
    return {"results": results}
