from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import openai

router = APIRouter()

openai.api_key = "your-openai-api-key"

class CodeInput(BaseModel):
    code: str
    language: str

class CodeCompletionInput(CodeInput):
    max_tokens: int = 100

class CodeInfillInput(CodeInput):
    prefix: str
    suffix: str

@router.post("/complete")
async def complete_code(input: CodeCompletionInput):
    prompt = f"Complete the following {input.language} code:\n\n{input.code}"
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=prompt,
        max_tokens=input.max_tokens,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return {"completion": response.choices[0].text.strip()}

@router.post("/infill")
async def infill_code(input: CodeInfillInput):
    prompt = f"Fill in the middle of this {input.language} code:\n\n{input.prefix}\n[CODE HERE]\n{input.suffix}"
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.5,
    )
    return {"infill": response.choices[0].text.strip()}

@router.post("/explain")
async def explain_code(input: CodeInput):
    prompt = f"Explain the following {input.language} code:\n\n{input.code}\n\nExplanation:"
    response = openai.Completion.create(
        engine="davinci-codex",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return {"explanation": response.choices[0].text.strip()}
