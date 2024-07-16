# ollama_manager.py
from ollama import AsyncClient
from typing import List, Dict, Any, AsyncGenerator
import asyncio

class OllamaError(Exception):
    pass

class OllamaModelManager:
    def __init__(self, host):
        self.client = AsyncClient(host)

    async def generate(self, model: str, prompt: str, stream: bool = False, **kwargs) -> Any:
        try:
            if stream:
                return self.client.generate(model=model, prompt=prompt, stream=True, **kwargs)
            else:
                response = await self.client.generate(model=model, prompt=prompt, **kwargs)
                return response['response']
        except Exception as e:
            raise OllamaError(f"Error generating response: {str(e)}")

    async def chat(self, model: str, messages: List[Dict[str, str]], stream: bool = False, **kwargs) -> Any:
        try:
            if stream:
                return self.client.chat(model=model, messages=messages, stream=True, **kwargs)
            else:
                response = await self.client.chat(model=model, messages=messages, **kwargs)
                return response['message']['content']
        except Exception as e:
            raise OllamaError(f"Error in chat: {str(e)}")

    async def create_model(self, name: str, modelfile: str) -> Dict[str, Any]:
        try:
            return await self.client.create(name, modelfile)
        except Exception as e:
            raise OllamaError(f"Error creating model: {str(e)}")

    async def list_models(self) -> List[Dict[str, Any]]:
        try:
            return await self.client.list()
        except Exception as e:
            raise OllamaError(f"Error listing models: {str(e)}")

    async def show_model_info(self, name: str) -> Dict[str, Any]:
        try:
            return await self.client.show(name)
        except Exception as e:
            raise OllamaError(f"Error showing model info: {str(e)}")

    async def copy_model(self, source: str, destination: str) -> Dict[str, Any]:
        try:
            return await self.client.copy(source, destination)
        except Exception as e:
            raise OllamaError(f"Error copying model: {str(e)}")

    async def delete_model(self, name: str) -> Dict[str, Any]:
        try:
            return await self.client.delete(name)
        except Exception as e:
            raise OllamaError(f"Error deleting model: {str(e)}")

    async def pull_model(self, name: str) -> AsyncGenerator[Dict[str, Any], None]:
        try:
            async for progress in self.client.pull(name,False, True):
                yield progress
        except Exception as e:
            raise OllamaError(f"Error pulling model: {str(e)}")

    async def push_model(self, name: str) -> AsyncGenerator[Dict[str, Any], None]:
        try:
            async for progress in self.client.push(name):
                yield progress
        except Exception as e:
            raise OllamaError(f"Error pushing model: {str(e)}")

    async def generate_embeddings(self, model: str, prompt: str) -> List[float]:
        try:
            response = await self.client.embeddings(model=model, prompt=prompt)
            return response['embedding']
        except Exception as e:
            raise OllamaError(f"Error generating embeddings: {str(e)}")

    async def list_running_models(self) -> List[Dict[str, Any]]:
        try:
            # Note: As of my knowledge cutoff, Ollama doesn't have a direct method for this.
            # This is a placeholder. You might need to implement this differently based on Ollama's capabilities.
            return await self.client.list()
        except Exception as e:
            raise OllamaError(f"Error listing running models: {str(e)}")