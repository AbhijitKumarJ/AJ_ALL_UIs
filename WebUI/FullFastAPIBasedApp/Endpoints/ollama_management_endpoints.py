from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import orm

from API.session_manager import SessionManager
from API.user_manager import UserManager

from API.db_manager import db_get_sub_topics, get_db,  db_get_topics
from API.api_entities import UserCreate, UserLoginCreate, UserSessionCreate
from API.AdvancedLLMManager import AdvancedLLMManager
from API.utils import config
router = APIRouter()


llm_manager = AdvancedLLMManager(config)

@router.get("/get_ollama_models")
async def get_ollama_models():
    models = llm_manager.ollama_provider.get_models()
    return {"status": "success", "data": models}