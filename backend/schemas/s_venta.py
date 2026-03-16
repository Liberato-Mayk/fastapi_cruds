from pydantic import BaseModel
from datetime import datetime
from typing import List

class DetalleCreate(BaseModel):
    producto_id: int
    cantidad: int

class VentaCreate(BaseModel):
    cliente_id: int
    detalles: List[DetalleCreate]


class DetalleRead(BaseModel):
    producto_nombre: str
    cantidad: int
    precio_unitario: float
    subtotal: float

class VentaRead(BaseModel):
    id: int
    cliente_id: int
    cliente_nombre: str
    total: float
    fecha: datetime
    detalles: List[DetalleRead]

    class Config:
        from_attributes = True