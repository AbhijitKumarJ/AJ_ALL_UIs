# chat_log_manager.py
from datetime import datetime
from .log_manager import LogManager
from .api_entities import ChatMessage
import httpx

class ChatLogManager(LogManager):
    def __init__(self):
        super().__init__("chat")

    async def log_chat(self,  user_id: str, message_from :str, session_folder: str, message: str, timestamp: datetime = None):
        data = {
            "user_id": message_from,
            "message": message,
            "timestamp": timestamp or datetime.now(),
        }
        self.log_entry(user_id, session_folder, data)

    async def get_ollama_response(self, user_id: str, session_folder: str, message: str) -> str:
        chat_log = self.get_log(user_id, session_folder)
        context = [{"role": "user" if log["user_id"] == user_id else "assistant", "content": log["message"]} for log in chat_log]
        context.append({"role": "user", "content": message})

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "qwen2:1.5b",
                    "messages": context,
                    "stream":False
                }
            )
            response_data = response.json()
            return response_data["message"]["content"]