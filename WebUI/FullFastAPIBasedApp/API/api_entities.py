from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ChatMessage(BaseModel):
    user_id: str
    session_name: str
    session_folder: str
    message: str
    timestamp: Optional[datetime] = None


class LogEntry(BaseModel):
    user_id: str
    session_name: str
    session_folder: str
    log_type: str
    content: str
    timestamp: Optional[datetime] = None


class UserSessionCreate(BaseModel):
    user_id: int
    topic_id: int
    session_name: str


# Pydantic models
class UserCreate(BaseModel):
    username: str
    password: str
    persona: str

class UserInDB(BaseModel):
    id: int
    username: str
    persona: str

class TopicCreate(BaseModel):
    title: str

class TopicInDB(BaseModel):
    id: int
    title: str

class UserLoginCreate(BaseModel):
    username: str
    password: str
