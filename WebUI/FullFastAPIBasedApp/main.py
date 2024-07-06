from datetime import datetime
from typing import Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import os

from API.api_entities import ChatMessage, LogEntry, SessionCreate

from API.AdvancedLLMChatManager import AdvancedLLMChatManager

from API.chat_log_manager import  ChatLogManager
from API.execution_log_manager import ExecutionLogManager
from API.session_manager import SessionManager
from API.user_manager import UserManager

app = FastAPI()

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "title": "FastAPI Example"}
    )


llm_manager = AdvancedLLMChatManager()

chat_manager = ChatLogManager()
execution_manager = ExecutionLogManager()
user_manager=UserManager()
session_manager=SessionManager(user_manager)

@app.get("/api/providers/ollama/models")
async def get_ollama_models():
    models = llm_manager.ollama_provider.get_models()
    return {"status": "success", "data": models}


#work_folder="./userfiles/"



# @app.post("/log_chat")
# async def log_chat(message: ChatMessage):
#     chat_manager.log_chat(message)
#     return {"status": "success", "message": "Chat message logged"}

# @app.post("/log_execution")
# async def log_execution(log_entry: LogEntry):
#     execution_manager.log_execution(log_entry)
#     return {"status": "success", "message": "Execution log entry added"}

# @app.get("/get_chat_log/{user_id}")
# async def get_chat_log(user_id: str):
#     log = chat_manager.get_log(user_id)
#     if log is None:
#         raise HTTPException(status_code=404, detail="Chat log not found for this user")
#     return log

# @app.get("/get_execution_log/{user_id}")
# async def get_execution_log(user_id: str):
#     log = execution_manager.get_log(user_id)
#     if log is None:
#         raise HTTPException(status_code=404, detail="Execution log not found for this user")
#     return log


# cmd> uvicorn main:app --reload




@app.post("/create_session")
async def create_session(session: SessionCreate):
    folder_name = session_manager.create_session(session.user_id, session.session_name)
    return {"status": "success", "message": f"Session '{session.session_name}' created", "folder_name": folder_name}

@app.get("/users")
async def get_users():
    return user_manager.get_users()

@app.get("/user_sessions/{user_id}")
async def get_user_sessions(user_id: str):
    sessions = user_manager.get_user_sessions(user_id)
    if sessions is None:
        raise HTTPException(status_code=404, detail="User not found")
    return sessions

@app.post("/log_chat")
async def log_chat(message: ChatMessage):
    message.session_folder = session_manager.get_session_folder(message.user_id, message.session_name)
    if not message.session_folder:
        raise HTTPException(status_code=404, detail="Session not found")
    await chat_manager.log_chat(message.user_id, "User", message.session_folder, message.message, message.timestamp)
    response = await chat_manager.get_ollama_response(message.user_id, message.session_folder, message.message)
    await chat_manager.log_chat(message.user_id, "Bot", message.session_folder, response)
    return {"status": "success", "message": "Chat message logged", "response": response}

@app.post("/log_execution")
async def log_execution(log_entry: LogEntry):
    log_entry.session_folder = session_manager.get_session_folder(log_entry.user_id, log_entry.session_name)
    if not log_entry.session_folder:
        raise HTTPException(status_code=404, detail="Session not found")
    execution_manager.log_execution(log_entry)
    return {"status": "success", "message": "Execution log entry added"}

@app.post("/get_chat_log")
async def get_chat_log(session: SessionCreate):
    folder_name = session_manager.get_session_folder(session.user_id, session.session_name)
    if not folder_name:
        raise HTTPException(status_code=404, detail="Session not found")
    log = chat_manager.get_log(session.user_id, folder_name)
    return {"user_id": session.user_id, "session_name": session.session_name, "chat_log": log}

@app.post("/get_execution_log")
async def get_execution_log(session: SessionCreate):
    folder_name = session_manager.get_session_folder(session.user_id, session.session_name)
    if not folder_name:
        raise HTTPException(status_code=404, detail="Session not found")
    log = execution_manager.get_log(session.user_id, folder_name)
    return {"user_id": session.user_id, "session_name": session.session_name, "execution_log": log}
