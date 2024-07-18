from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
import httpx
from pydantic import BaseModel
from typing import List
from sqlalchemy import orm

from API.session_manager import SessionManager
from API.user_manager import UserManager

from API.db_manager import db_get_sub_topics, get_db,  db_get_topics
from API.api_entities import UserCreate, UserLoginCreate, UserSessionCreate
from API.ollama_model_manager import OllamaError, OllamaModelManager
from API.utils import config
router = APIRouter()

class SelectedOllamaConfig(BaseModel):
    ollama_host:str="http://localhost:11434/"

class Message(BaseModel):
    role: str
    content: str

class ModelCreateEntity(BaseModel):
    ollama_config:SelectedOllamaConfig
    name: str
    modelfile: str

class ModelShowEntity(BaseModel):
    ollama_config:SelectedOllamaConfig
    model: str

class EmbeddingRequest(BaseModel):
    model: str
    prompt: str

class VisionRequest(BaseModel):
    model: str
    prompt: str


# OLLAMA_BASE_URL = "http://localhost:11434"


# @router.post("/get_ollama_models")
# async def get_ollama_models(config:SelectedOllamaConfig):
#     models = llm_manager.ollama_provider.get_models(config.ollama_host)
#     return {"status": "success", "data": models}

class GenerateMessageEntity(BaseModel):
    ollama_config:SelectedOllamaConfig
    model:str=""
    prompt:str=""
    stream:bool=False

class ChatMessageEntity(BaseModel):
    ollama_config:SelectedOllamaConfig
    model:str=""
    messages: List[Message]=[]
    stream:bool=False

@router.post("/generate")
async def generate(message:GenerateMessageEntity):
    try:
        manager = OllamaModelManager(message.ollama_config.ollama_host)
        if message.stream:
            return StreamingResponse(manager.generate(message.model, message.prompt, True), media_type="text/event-stream")
        else:
            return await manager.generate(message.model, message.prompt)
    except OllamaError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def chat(message: ChatMessageEntity ):
    try:
        manager = OllamaModelManager(message.ollama_config.ollama_host)
        if message.stream:
            return StreamingResponse(manager.chat(message.model, [m.dict() for m in message.messages], True), media_type="text/event-stream")
        else:
            return await manager.chat(message.model, [m.dict() for m in message.messages])
    except OllamaError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create_model")
async def create_model(message: ModelCreateEntity):
    try:
        print(message)
        manager = OllamaModelManager(message.ollama_config.ollama_host)
        return await manager.create_model(message.name, message.modelfile)
    except OllamaError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/list_models")
async def list_models(message:SelectedOllamaConfig):
    try:
        manager = OllamaModelManager(message.ollama_host)
        return await manager.list_models()
    except OllamaError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/show_model")
async def show_model_info(message: ModelShowEntity):
    try:
        manager = OllamaModelManager(message.ollama_config.ollama_host)
        return await manager.show_model_info(message.model)
    except OllamaError as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/models/{source}/copy")
# async def copy_model(source: str, destination: str):
#     try:
#         manager = OllamaModelManager(message.ollama_host)
#         return await manager.copy_model(source, destination)
#     except OllamaError as e:
#         raise HTTPException(status_code=500, detail=str(e))

@router.post("/delete_model")
async def delete_model(message:ModelShowEntity):
    try:
        manager = OllamaModelManager(message.ollama_config.ollama_host)
        return await manager.delete_model(message.model)
    except OllamaError as e:
        raise HTTPException(status_code=500, detail=str(e))

# @router.post("/pull_model")
# async def pull_model(message:ModelShowEntity):
#     try:
#         manager = OllamaModelManager(message.ollama_config.ollama_host)
#         return StreamingResponse(manager.pull_model(message.model), media_type="text/event-stream")
#     except OllamaError as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/models/{name}/push")
# async def push_model(name: str):
#     try:
#         manager = OllamaModelManager(message.ollama_host)
#         return StreamingResponse(manager.push_model(name), media_type="text/event-stream")
#     except OllamaError as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.post("/embeddings/{model}")
# async def generate_embeddings(model: str, prompt: str):
#     try:
#         manager = OllamaModelManager(message.ollama_host)
#         return await manager.generate_embeddings(model, prompt)
#     except OllamaError as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/running")
# async def list_running_models():
#     try:
#         manager = OllamaModelManager(message.ollama_host)
#         return await manager.list_running_models()
#     except OllamaError as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @router.get("/", response_class=HTMLResponse)
# async def read_root(request: Request):
#     with open("index.html", "r") as f:
#         content = f.read()
#     return HTMLResponse(content=content)

# async def ensure_model_loaded(model: str):
#     async with httpx.AsyncClient() as client:
#         # Check if model is loaded
#         response = await client.get(f"{OLLAMA_BASE_URL}/api/show", params={"name": model})
#         if response.status_code == 404:
#             # Model not found, initiate loading
#             load_response = await client.post(f"{OLLAMA_BASE_URL}/api/pull", json={"name": model})
#             if load_response.status_code != 200:
#                 raise HTTPException(status_code=500, detail=f"Failed to load model {model}")
            
#             # Wait for model to finish loading
#             while True:
#                 status_response = await client.get(f"{OLLAMA_BASE_URL}/api/show", params={"name": model})
#                 if status_response.status_code == 200:
#                     break
#                 await asyncio.sleep(1)  # Wait for 1 second before checking again

# @router.post("/embed")
# async def create_embedding(request: EmbeddingRequest):
#     await ensure_model_loaded(request.model)
#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             f"{OLLAMA_BASE_URL}/api/embeddings",
#             json={"model": request.model, "prompt": request.prompt}
#         )
#         return response.json()

# @router.post("/vision")
# async def process_vision(request: VisionRequest, image: UploadFile = File(...)):
#     await ensure_model_loaded(request.model)
#     image_content = await image.read()
#     image_base64 = base64.b64encode(image_content).decode("utf-8")

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             f"{OLLAMA_BASE_URL}/api/generate",
#             json={
#                 "model": request.model,
#                 "prompt": request.prompt,
#                 "images": [image_base64]
#             }
#         )
#         return response.json()