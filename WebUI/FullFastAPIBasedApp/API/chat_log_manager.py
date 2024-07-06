# chat_log_manager.py
from datetime import datetime
from .log_manager import LogManager
from .api_entities import ChatMessage


class ChatLogManager(LogManager):
    def __init__(self):
        super().__init__("chat")

    def log_chat(self, message: ChatMessage):
        data = {
            "user_id": message.user_id,
            "message": message.message,
            "timestamp": message.timestamp or datetime.now(),
        }
        self.log_entry(message.user_id, data)
