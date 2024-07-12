from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import orm

from API.session_manager import SessionManager
from API.user_manager import UserManager

from API.db_manager import db_get_user_projects, db_get_users, db_create_user_session, db_get_user_sessions, db_register_user, get_db, db_authenticate_user, db_get_user
from API.api_entities import UserCreate, UserLoginCreate, UserSessionCreate

router = APIRouter()

user_manager=UserManager()
session_manager=SessionManager(user_manager)

@router.get("/users")
async def get_users(db: orm.Session = Depends(get_db)):
    users = db_get_users(db)
    return {"status":"success", "message":"", "data": users}

@router.get("/get_user_projects/{user_id}")
def get_user_projects(user_id: int, db: orm.Session = Depends(get_db)):
    user_projects = db_get_user_projects(db, user_id)
    return {"status":"success", "message":"", "data": user_projects}

@router.post("/register_user")
def register_user(user: UserCreate, db: orm.Session = Depends(get_db)):
    db_user = db_get_user(db, user.username)
    if db_user:
        return { "status":"failure", "message":"Username already registered", "data":{}}
    db_user=db_register_user(db, user.username, user.password, user.persona)
    return {"status":"success", "message":"", "data": db_user}

@router.post("/login_user")
def login(form_data: UserLoginCreate, db: orm.Session = Depends(get_db)):
    db_user = db_authenticate_user(db, form_data.username, form_data.password)
    if not db_user:
        return { "status":"failure", "message":"Incorrect username or password", "data":{}}
    return {"status":"success", "message":"", "data": db_user}

@router.post("/create_user_session")
async def create_user_session(session: UserSessionCreate, db:orm.Session=Depends(get_db)):
    folder_name = session_manager.create_session(str(session.user_id), session.session_name)
    db_session=db_create_user_session(db, session.user_id, session.topic_id, session.sub_topic_id, session.project_id, session.project_name, session.project_desc, session.session_name, folder_name)
    return {"status": "success", "message": f"Session '{session.session_name}' created", "data": db_session}

@router.get("/get_user_sessions/{user_id}")
async def get_user_sessions(user_id: int, db:orm.Session=Depends(get_db)):
    db_user_sessions=db_get_user_sessions(db, user_id)
    session_logs = user_manager.get_user_sessions(str(user_id))
    if db_user_sessions is None:
        return {"status":"failure", "message":"error fetching sessions"}
    return {"status":"success", "message":"", "data": {"db":db_user_sessions, "logs":session_logs}}
