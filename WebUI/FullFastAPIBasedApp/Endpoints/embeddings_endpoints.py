from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import openai
import anthropic
from transformers import AutoTokenizer, AutoModel
import torch

router = APIRouter()

# Initialize models and clients
openai.api_key = "your-openai-api-key"
anthropic_client = anthropic.Client("your-anthropic-api-key")
huggingface_model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
huggingface_tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

class TextInput(BaseModel):
    text: str

class ProviderInput(BaseModel):
    provider: str
    text: str

@router.post("/embed")
async def generate_embedding(input: ProviderInput):
    if input.provider == "openai":
        response = openai.Embedding.create(input=input.text, model="text-embedding-ada-002")
        embedding = response['data'][0]['embedding']
    elif input.provider == "anthropic":
        response = anthropic_client.embeddings.create(input=input.text, model="claude-2")
        embedding = response.embeddings[0]
    elif input.provider == "huggingface":
        inputs = huggingface_tokenizer(input.text, return_tensors="pt", padding=True, truncation=True)
        with torch.no_grad():
            outputs = huggingface_model(**inputs)
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()
    else:
        raise HTTPException(status_code=400, detail="Unsupported provider")
    
    return {"embedding": embedding}
