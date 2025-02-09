from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./db/app.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    persona = Column(String)


class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String, index=True)


class SubTopic(Base):
    __tablename__ = "subtopics"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    sub_topic_name = Column(String, index=True)


class UserProject(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer)
    sub_topic_id = Column(Integer)
    project_name = Column(String)
    project_desc = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))


class UserSession(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer)
    sub_topic_id = Column(Integer)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    Session_Name = Column(String)
    Session_Folder = Column(String)


# Create tables
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Helper functions
def db_get_users(db: Session):
    return db.query(User).all()

def db_get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def db_verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def db_get_password_hash(password):
    return pwd_context.hash(password)

def db_authenticate_user(db: Session, username: str, password: str):
    user = db_get_user(db, username)
    if not user or not db_verify_password(password, user.hashed_password):
        return False
    return user

def db_register_user(db: Session, username: str, password: str, persona: str):
    hashed_password = db_get_password_hash(password)
    db_user = User(username=username, hashed_password=hashed_password, persona=persona)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def db_create_topic(db: Session, topic_name: str):
    topic = Topic()
    topic.topic_name = topic_name
    db.add(topic)
    db.commit()
    db.refresh(topic)
    return topic

def db_get_topics(db: Session):
    return db.query(Topic).all()

def db_get_sub_topics(db: Session):
    return db.query(SubTopic).all()

def db_create_user_project(
    db: Session,
    user_id: int,
    topic_id: int,
    sub_topic_id: int,
    project_name: str,
    project_desc: str,
):
    user_project = UserProject()
    user_project.user_id = user_id
    user_project.topic_id = topic_id
    user_project.sub_topic_id = sub_topic_id
    user_project.project_name = project_name
    user_project.project_desc = project_desc

    db.add(user_project)
    db.commit()
    db.refresh(user_project)
    return user_project

def db_get_user_projects(db: Session, user_id: int):
    return db.query(UserProject).filter(UserProject.user_id == user_id).all()

def db_create_user_session(
    db: Session,
    user_id: int,
    topic_id: int,
    sub_topic_id: int,
    project_id: int,
    project_name: str,
    project_desc: str,
    session_name: str,
    session_folder: str
):

    local_project_id = project_id
    if local_project_id == 0:
        up = db_create_user_project(
            db, user_id, topic_id, sub_topic_id, project_name, project_desc
        )
        local_project_id = up.id

    user_session = UserSession()
    user_session.user_id = user_id
    user_session.topic_id = topic_id
    user_session.sub_topic_id = sub_topic_id
    user_session.project_id = local_project_id
    user_session.Session_Name = session_name
    user_session.Session_Folder = session_folder

    db.add(user_session)
    db.commit()
    db.refresh(user_session)
    return user_session

def db_get_user_sessions(db: Session, user_id: int):
    return db.query(UserSession).filter(UserSession.user_id == user_id).all()
