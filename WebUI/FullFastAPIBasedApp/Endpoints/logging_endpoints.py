from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import orm

from API.session_manager import SessionManager
from API.user_manager import UserManager

from API.db_manager import db_get_sub_topics, get_db,  db_get_topics
from API.api_entities import UserCreate, UserLoginCreate, UserSessionCreate
from API.execution_log_manager import ExecutionLogManager

router = APIRouter()


execution_manager = ExecutionLogManager()


@router.post("/get_execution_log")
async def get_execution_log(session: UserSessionCreate):
    folder_name = "test" #session_manager.get_session_folder(session.user_id, session.session_name)
    if not folder_name:
        raise HTTPException(status_code=404, detail="Session not found")
    log = execution_manager.get_log(session.user_id, folder_name)
    return {"user_id": session.user_id, "session_name": session.session_name, "execution_log": log}

