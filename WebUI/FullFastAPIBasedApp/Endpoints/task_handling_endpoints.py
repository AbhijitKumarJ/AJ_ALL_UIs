from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from API.task_manager import (
    AdvancedTaskManager,
    TaskInput
)

router = APIRouter()

taskManager = AdvancedTaskManager()

@router.post("/get_sub_tasks")
async def divide_task(input: TaskInput):
    divided_tasks = taskManager.get_sub_tasks(input)
    return {"status":"success", "message":"", "data": divided_tasks}


# @router.post("/plan", response_model=ActionPlan)
# async def create_action_plan(input: TaskInput):
#     plan = taskManager.create_action_plan(input)
#     return {"status":"success", "message":"", "data": plan}
