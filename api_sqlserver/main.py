from fastapi import FastAPI, HTTPException, Depends
from typing import List, Union
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from settings import username, password, server, database

app = FastAPI()

conexion_db = (
    f"mssql+pyodbc://{username}:{password}@{server}/{database}"
    "?driver=ODBC+Driver+17+for+SQL+Server")

engine = create_engine(conexion_db)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProductosDB(Base):
    __tablename__ = "PRODUCTOS"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(100), nullable=False)
    precio = Column(Float, nullable=False)

Base.metadata.create_all(bind=engine)

class ProductoCreate(BaseModel):
    nombre: str
    descripcion: Union[str, None] = None
    precio: float

class Producto(ProductoCreate):
    id: int
    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"Mensaje": "Hola mundo."}

# Obtener todos los productos
@app.get("/productos", response_model=List[Producto])
async def get_productos(db: Session = Depends(get_db)):
    return db.query(ProductosDB).all()

# Obtener un producto por id
@app.get("/productos/{id_producto}", response_model=Producto)
async def get_producto(id_producto: int, db: Session = Depends(get_db)):
    producto = db.query(ProductosDB).filter(ProductosDB.id == id_producto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    return producto

# Crear producto
@app.post("/productos", response_model=Producto)
async def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = ProductosDB(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

# Actualizar producto
@app.put("/productos/{id_producto}", response_model=Producto)
async def actualizar_producto(id_producto: int, producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(ProductosDB).filter(ProductosDB.id == id_producto).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    for key, value in producto.dict().items():
        setattr(db_producto, key, value)
    db.commit()
    db.refresh(db_producto)
    return db_producto

# Eliminar producto
@app.delete("/productos/{id_producto}", response_model=dict)
async def eliminar_producto(id_producto: int, db: Session = Depends(get_db)):
    db_producto = db.query(ProductosDB).filter(ProductosDB.id == id_producto).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado.")
    db.delete(db_producto)
    db.commit()
    return {"mensaje": "Producto eliminado"}
