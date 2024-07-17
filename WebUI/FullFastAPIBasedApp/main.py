from datetime import datetime
from typing import Optional
from fastapi import Depends, FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

# Import router modules
# from Endpoints.sentence_transformers_endpoints import router as st_router
# from Endpoints.embeddings_endpoints import router as embed_router
# from Endpoints.vision_tasks_endpoints import router as vision_router
# from Endpoints.code_tasks_endpoints import router as code_router
from Endpoints.task_handling_endpoints import router as task_router
# from Endpoints.general_inference_endpoints import router as gen_router
from Endpoints.user_management_endpoints import router as user_router
from Endpoints.master_data_endpoints import router as master_router
from Endpoints.ollama_management_endpoints import router as ollama_router
from Endpoints.chat_endpoints import router as chat_router
from Endpoints.logging_endpoints import router as log_router
from Endpoints.web_socket_endpoints import router as ws_router


app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")


# Include routers
# app.include_router(st_router, prefix="/st", tags=["sentence transformers"])
# app.include_router(embed_router, prefix="/embed", tags=["embeddings"])
# app.include_router(vision_router, prefix="/vision", tags=["vision tasks"])
# app.include_router(code_router, prefix="/code", tags=["code tasks"])
app.include_router(task_router, prefix="/task", tags=["task handling"])
# app.include_router(gen_router, prefix="/gen", tags=["general inference"])
app.include_router(user_router, prefix="/user", tags=["user and session management"])
app.include_router(master_router, prefix="/master", tags=["master data"])
app.include_router(ollama_router, prefix="/ollama", tags=["ollama management"])
app.include_router(chat_router, prefix="/chat", tags=["general chat"])
app.include_router(log_router, prefix="/log", tags=["general logging"])
app.include_router(ws_router, prefix="/ws", tags=["web socket endpoints"])

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse(
        "index.html", {"request": request, "title": "FastAPI Example"}
    )

# @app.get("/TaskAnalyser", response_class=HTMLResponse)
# async def read_root(request: Request):
#     return templates.TemplateResponse(
#         "taskanalyser/index.html", {"request": request, "title": "FastAPI Example"}
#     )


# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)



