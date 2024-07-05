from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from API.AdvancedLLMChatManager import AdvancedLLMChatManager

llm_manager = AdvancedLLMChatManager()

app = FastAPI()


# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


class ChatPayload(BaseModel):
    provider: str
    model: str
    message:str


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "title": "FastAPI Example"}
    )


# @app.get("/api/providers/get_all")
# async def get_all_providers():
#     providers = llm_manager.get_providers()
#     return {"status": "success", "data": providers}

@app.get("/api/providers/ollama/models")
async def get_ollama_models():
    models = llm_manager.ollama_provider.get_models()
    return {"status": "success", "data": models}

# @app.get("/api/providers/groq/models")
# async def get_groq_models():
#     models = llm_manager.groq_provider.get_models()
#     return {"status": "success", "data": models}

# @app.get("/api/providers/claude/models")
# async def get_claude_models():
#     models = llm_manager.claude_provider.get_models()
#     return {"status": "success", "data": models}

# @app.get("/api/providers/openai/models")
# async def get_openai_models():
#     models = llm_manager.openai_provider.get_models()
#     return {"status": "success", "data": models}

# @app.get("/api/providers/gemini/models")
# async def get_gemini_models():
#     models = llm_manager.gemini_provider.get_models()
#     return {"status": "success", "data": models}


@app.post("/api/chat/get_response")
async def get_chat_response(item: ChatPayload):
    return {"status": "success", "data": item}

# cmd> uvicorn main:app --reload
