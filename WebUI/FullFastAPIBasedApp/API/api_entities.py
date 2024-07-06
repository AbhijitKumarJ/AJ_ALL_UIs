
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ChatMessage(BaseModel):
    user_id: str
    message: str
    timestamp: Optional[datetime] = None

class LogEntry(BaseModel):
    user_id: str
    log_type: str
    content: str
    timestamp: Optional[datetime] = None