from sqlmodel import SQLModel

class AdminCreate(SQLModel):
    username: str
    password: str

class AdminLogin(SQLModel):
    username: str
    password: str

class AdminResponse(SQLModel):
    id: int
    username: str