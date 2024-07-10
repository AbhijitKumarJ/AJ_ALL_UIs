from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import orm

from API.db_manager import db_get_sub_topics, get_db,  db_get_topics

router = APIRouter()

@router.get("/get_topics")
def get_topics(db: orm.Session = Depends(get_db)):
    topics = db_get_topics(db)
    return {"status":"success", "message":"", "data": topics}

@router.get("/get_sub_topics")
def get_sub_topics(db: orm.Session = Depends(get_db)):
    subtopics = db_get_sub_topics(db)
    return {"status":"success", "message":"", "data": subtopics}

