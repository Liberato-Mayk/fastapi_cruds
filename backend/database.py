from sqlmodel import SQLModel, create_engine, Session
from backend.settings import username, password, host, database, port
from typing import Generator
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("No se encontró la variable DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

def crear_db():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator:
    with Session(engine) as session:
        yield session