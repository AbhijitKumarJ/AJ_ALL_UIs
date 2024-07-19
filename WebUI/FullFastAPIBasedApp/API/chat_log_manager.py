# chat_log_manager.py
from datetime import datetime
import json

from .AdvancedLLMManager import AdvancedLLMManager
from .log_manager import LogManager
from .api_entities import ChatMessage
import httpx
from .utils import config


class ChatLogManager(LogManager):
    def __init__(self):
        super().__init__("chat")
        self.llmManager=AdvancedLLMManager(config)

    async def log_chat(
        self,
        user_id: str,
        message_from: str,
        session_folder: str,
        message: str,
        timestamp: datetime = None,
    ):
        data = {
            "user_id": message_from,
            "message": message,
            "timestamp": timestamp or datetime.now(),
        }
        self.log_entry(user_id, session_folder, data)

    def get_bot_response(self, prompt: str, provider: str, model: str):
        context = {}

        if provider == "" or provider == None:
            provider = config.get("default_provider", "Ollama")

        if model == "" or model == None:
            model = config.get("default_ollama_model", "qwen2:1.5b")

        if provider == "Ollama":
            is_success, resp_message = self.llmManager.ollama_provider.get_response(
                prompt, model
            )

            if is_success:
                return {"status": "success", "message": "", "data": resp_message}
            else:
                return {
                    "status": "exception",
                    "message": "error getting response",
                    "data": resp_message,
                }

        if provider == "Groq":
            print('hello groq')
            is_success, resp_message = self.llmManager.groq_provider.get_response(
                prompt, model
            )

            if is_success:
                return {"status": "success", "message": "", "data": resp_message}
            else:
                return {
                    "status": "exception",
                    "message": "error getting response",
                    "data": resp_message,
                }

        if provider == "Gemini":
            is_success, resp_message = self.llmManager.gemini_provider.get_response(
                prompt, model
            )

            if is_success:
                return {"status": "success", "message": "", "data": resp_message}
            else:
                return {
                    "status": "exception",
                    "message": "error getting response",
                    "data": resp_message,
                }

        if provider == "Claude":
            is_success, resp_message = self.llmManager.claude_provider.get_response(
                prompt, model
            )

            if is_success:
                return {"status": "success", "message": "", "data": resp_message}
            else:
                return {
                    "status": "exception",
                    "message": "error getting response",
                    "data": resp_message,
                }

        if provider == "OpenAI":
            is_success, resp_message = self.llmManager.openai_provider.get_response(
                prompt, model
            )

            if is_success:
                return {"status": "success", "message": "", "data": resp_message}
            else:
                return {
                    "status": "exception",
                    "message": "error getting response",
                    "data": resp_message,
                }

        return {
            "status": "exception",
            "message": "error getting response",
            "data": "provider does not exist",
        }

    # async def get_ollama_task_steps(
    #     self, user_id: str, session_folder: str, message: str
    # ) -> str:
    #     # chat_log = self.get_log(user_id, session_folder)
    #     context = json.loads(message)

    #     async with httpx.AsyncClient() as client:
    #         response = await client.post(
    #             "http://localhost:11434/api/chat",
    #             json={"model": "qwen2:1.5b", "messages": context, "stream": False},
    #             timeout=200.0,
    #         )
    #         response_data = response.json()
    #         return response_data["message"]["content"]
