from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import os

from API.api_entities import ChatMessage, LogEntry
from API.AdvancedLLMChatManager import AdvancedLLMChatManager

from API.chat_log_manager import  ChatLogManager
from API.execution_log_manager import ExecutionLogManager


llm_manager = AdvancedLLMChatManager()

app = FastAPI()


# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "title": "FastAPI Example"}
    )


@app.get("/api/providers/ollama/models")
async def get_ollama_models():
    models = llm_manager.ollama_provider.get_models()
    return {"status": "success", "data": models}


#work_folder="./userfiles/"

chat_manager = ChatLogManager()
execution_manager = ExecutionLogManager()


@app.post("/log_chat")
async def log_chat(message: ChatMessage):
    chat_manager.log_chat(message)
    return {"status": "success", "message": "Chat message logged"}

@app.post("/log_execution")
async def log_execution(log_entry: LogEntry):
    execution_manager.log_execution(log_entry)
    return {"status": "success", "message": "Execution log entry added"}

@app.get("/get_chat_log/{user_id}")
async def get_chat_log(user_id: str):
    log = chat_manager.get_log(user_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Chat log not found for this user")
    return log

@app.get("/get_execution_log/{user_id}")
async def get_execution_log(user_id: str):
    log = execution_manager.get_log(user_id)
    if log is None:
        raise HTTPException(status_code=404, detail="Execution log not found for this user")
    return log


# cmd> uvicorn main:app --reload
