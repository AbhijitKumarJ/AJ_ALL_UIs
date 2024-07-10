from typing import List

from pydantic import BaseModel
from .api_inference_providers import OllamaProvider, OpenAIProvider, GroqProvider, ClaudeProvider, GeminiProvider
#from .ollama_model_manager import OllamaModelManager
import json
import os

from .utils import config

from .AdvancedLLMManager import AdvancedLLMManager


class TaskInput(BaseModel):
    prompt: str
    provider:str
    model:str

# class SubTask(BaseModel):
#     title: str
#     description: str

# class DividedTask(BaseModel):
#     main_task: str
#     sub_tasks: List[SubTask]

# class ActionPlan(BaseModel):
#     steps: List[str]

class AdvancedTaskManager():
    def __init__(self):
        self.llmManager=AdvancedLLMManager(config)
        self.inference_providers=self.llmManager.get_providers()

    def get_sub_tasks(self, input: TaskInput):
        #prompt = f"Divide the following task into smaller sub-tasks:\n\nTask: {input.task}\n\nSub-tasks:"
        
        if input.provider=="" or input.provider == None:
            input.provider=config.get("default_provider","Ollama")

        if input.model=="" or input.model == None:
            input.model=config.get("default_model","qwen2:1.5b")        

        if input.provider=="Ollama":
            is_success, resp_message=self.llmManager.ollama_provider.get_response(input.prompt, input.model)

            if is_success:
                return {"status":"success", "message":"", "data": resp_message}
            else:
                return {"status":"exception", "message":"error getting response", "data": resp_message}
        
        
        if input.provider=="Groq":
            is_success, resp_message=self.llmManager.groq_provider.get_response(input.prompt, input.model)

            if is_success:
                return {"status":"success", "message":"", "data": resp_message}
            else:
                return {"status":"exception", "message":"error getting response", "data": resp_message}
        

        if input.provider=="Gemini":
            is_success, resp_message=self.llmManager.gemini_provider.get_response(input.prompt, input.model)

            if is_success:
                return {"status":"success", "message":"", "data": resp_message}
            else:
                return {"status":"exception", "message":"error getting response", "data": resp_message}
        


        if input.provider=="Claude":
            is_success, resp_message=self.llmManager.claude_provider.get_response(input.prompt, input.model)

            if is_success:
                return {"status":"success", "message":"", "data": resp_message}
            else:
                return {"status":"exception", "message":"error getting response", "data": resp_message}
        


        if input.provider=="OpenAI":
            is_success, resp_message=self.llmManager.openai_provider.get_response(input.prompt, input.model)

            if is_success:
                return {"status":"success", "message":"", "data": resp_message}
            else:
                return {"status":"exception", "message":"error getting response", "data": resp_message}
        
        return {"status":"exception", "message":"error getting response", "data": "provider does not exist"}
        
    # def create_action_plan(self, input: TaskInput):
    #     prompt = f"Create a step-by-step action plan for the following task:\n\nTask: {input.task}\n\nAction Plan:"
       
    #     is_success, resp_message=self.llmManager.ollama_provider.get_response(prompt, input.model)

    #     if is_success:
    #         return {"status":"success", "message":"", "data": resp_message}
    #     else:
    #         return {"status":"exception", "message":"error getting response", "data": resp_message}
