from sqlmodel import SQLModel, create_engine, Session
from settings import username, password, host, database, port
from typing import Generator

DATABASE_URL = (
    f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}"
)

engine = create_engine(DATABASE_URL, echo=True)

def crear_db():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator:
    with Session(engine) as session:
        yield session