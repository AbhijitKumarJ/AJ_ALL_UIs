from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import openai

router = APIRouter()

openai.api_key = "your-openai-api-key"

class TextInput(BaseModel):
    text: str

class ChatInput(BaseModel):
    messages: List[dict]

class SummaryOutput(BaseModel):
    summary: str

class ChatOutput(BaseModel):
    response: str

class ImprovedPromptOutput(BaseModel):
    improved_prompt: str

@router.post("/chat", response_model=ChatOutput)
async def chat(input: ChatInput):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=input.messages
    )
    return ChatOutput(response=response['choices'][0]['message']['content'])

@router.post("/summarize", response_model=SummaryOutput)
async def summarize(input: TextInput):
    prompt = f"Please summarize the following text:\n\n{input.text}\n\nSummary:"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return SummaryOutput(summary=response.choices[0].text.strip())

@router.post("/improve-prompt", response_model=ImprovedPromptOutput)
async def improve_prompt(input: TextInput):
    prompt = f"Improve the following prompt to get better results from an AI model:\n\nOriginal prompt: {input.text}\n\nImproved prompt:"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=100,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return ImprovedPromptOutput(improved_prompt=response.choices[0].text.strip())

@router.post("/describe-task", response_model=TextInput)
async def describe_task(input: TextInput):
    prompt = f"Provide a detailed description of how to accomplish the following task:\n\nTask: {input.text}\n\nDescription:"
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=prompt,
        max_tokens=200,
        n=1,
        stop=None,
        temperature=0.7,
    )
    return TextInput(text=response.choices[0].text.strip())
</antArt