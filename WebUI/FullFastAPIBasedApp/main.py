from datetime import datetime
from typing import Optional
from fastapi import Depends, FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from sqlalchemy import orm
import os

from API.api_entities import ChatMessage, LogEntry, UserSessionCreate, UserInDB, UserCreate, TopicInDB, UserLoginCreate

from API.AdvancedLLMChatManager import AdvancedLLMChatManager

from API.chat_log_manager import  ChatLogManager
from API.execution_log_manager import ExecutionLogManager
from API.session_manager import SessionManager
from API.user_manager import UserManager
from API.db_manager import db_get_user_projects, db_get_sub_topics, db_create_user_session, db_get_user_sessions, db_register_user, get_db, db_authenticate_user, db_get_user, db_get_topics

app = FastAPI()

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "title": "FastAPI Example"}
    )

@app.get("/TaskAnalyser", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "taskanalyser/index.html", {"request": request, "title": "FastAPI Example"}
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

@app.get("/get_topics")
def get_topics(db: orm.Session = Depends(get_db)):
    topics = db_get_topics()
    return {"status":"success", "message":"", "data": topics}

@app.get("/get_sub_topics")
def get_sub_topics(db: orm.Session = Depends(get_db)):
    subtopics = db_get_sub_topics()
    return {"status":"success", "message":"", "data": subtopics}


@app.get("/users")
async def get_users():
    return user_manager.get_users()


@app.get("/get_user_projects/{user_id}")
def get_user_projects(user_id: int, db: orm.Session = Depends(get_db)):
    user_projects = db_get_user_projects(db, user_id)
    return {"status":"success", "message":"", "data": user_projects}


@app.post("/register_user")
def register_user(user: UserCreate, db: orm.Session = Depends(get_db)):
    db_user = db_get_user(db, user.username)
    if db_user:
        raise { "status":"failure", "message":"Username already registered", "data":{}}
    db_user=db_register_user(db, user.username, user.password, user.persona)
    return {"status":"success", "message":"", "data": db_user}

@app.post("/login_user")
def login(form_data: UserLoginCreate, db: orm.Session = Depends(get_db)):
    db_user = db_authenticate_user(db, form_data.username, form_data.password)
    if not db_user:
        raise { "status":"failure", "message":"Incorrect username or password", "data":{}}
    return {"status":"success", "message":"", "data": db_user}

@app.post("/create_user_session")
async def create_user_session(session: UserSessionCreate, db:orm.Session=Depends(get_db)):
    folder_name = session_manager.create_session(str(session.user_id), session.session_name)
    db_session=db_create_user_session(db, session.user_id, session.topic_id, session.sub_topic_id, session.project_id, session.project_desc, session.project_name, session.session_name, folder_name)
    return {"status": "success", "message": f"Session '{session.session_name}' created", "data": db_session}

@app.get("/get_user_sessions/{user_id}")
async def get_user_sessions(user_id: int, db:orm.Session=Depends(get_db)):
    db_user_sessions=db_get_user_sessions(db, user_id)
    session_logs = user_manager.get_user_sessions(str(user_id))
    if db_user_sessions is None:
        return {"status":"failure", "message":"error fetching sessions"}
    return {"status":"success", "message":"", "data": {"db":db_user_sessions, "logs":session_logs}}

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

# @app.post("/get_chat_log")
# async def get_chat_log(session: SessionCreate):
#     folder_name = session_manager.get_session_folder(session.user_id, session.session_name)
#     if not folder_name:
#         raise HTTPException(status_code=404, detail="Session not found")
#     log = chat_manager.get_log(session.user_id, folder_name)
#     return {"user_id": session.user_id, "session_name": session.session_name, "chat_log": log}

# @app.post("/get_execution_log")
# async def get_execution_log(session: SessionCreate):
#     folder_name = session_manager.get_session_folder(session.user_id, session.session_name)
#     if not folder_name:
#         raise HTTPException(status_code=404, detail="Session not found")
#     log = execution_manager.get_log(session.user_id, folder_name)
#     return {"user_id": session.user_id, "session_name": session.session_name, "execution_log": log}


@app.post("/get_task_steps")
async def get_task_steps(message: ChatMessage):
    message.session_folder = session_manager.get_session_folder(message.user_id, message.session_name)
    if not message.session_folder:
        raise HTTPException(status_code=404, detail="Session not found")
    await chat_manager.log_chat(message.user_id, "User", message.session_folder, message.message, message.timestamp)
    response = await chat_manager.get_ollama_task_steps(message.user_id, message.session_folder, message.message)
    await chat_manager.log_chat(message.user_id, "Bot", message.session_folder, response)
    return {"status": "success", "message": "Chat message logged", "response": response}
