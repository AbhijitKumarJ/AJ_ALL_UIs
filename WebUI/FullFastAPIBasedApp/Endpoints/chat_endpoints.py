from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import orm

from API.session_manager import SessionManager
from API.user_manager import UserManager

from API.db_manager import db_get_sub_topics, get_db, db_get_topics
from API.api_entities import ChatMessage, UserCreate, UserLoginCreate, UserSessionCreate

router = APIRouter()

from API.chat_log_manager import ChatLogManager


chat_manager = ChatLogManager()


@router.post("/get_bot_response")
def get_bot_response(message: ChatMessage):
    # message.session_folder = "test" #session_manager.get_session_folder(message.user_id, message.session_name)
    # if not message.session_folder:
    #     raise HTTPException(status_code=404, detail="Session not found")
    # await chat_manager.log_chat(message.user_id, "User", message.session_folder, message.message)
    response = chat_manager.get_bot_response(message.prompt, message.provider, message.model)
    # await chat_manager.log_chat(message.user_id, "Bot", message.session_folder, response)
    return response
