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


class SessionCreate(BaseModel):
    user_id: str
    session_name: str
