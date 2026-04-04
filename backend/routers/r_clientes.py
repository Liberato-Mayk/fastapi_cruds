from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from backend.database import get_session
from backend.schemas.s_cliente import ClienteCreate, ClienteRead, ClienteUpdate
from backend.crud import c_cliente

router = APIRouter(prefix="/clientes", tags=["Clientes"])

@router.post("/", response_model=ClienteRead)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_session)):
    return c_cliente.crear_cliente(db, cliente)

@router.get("/", response_model=List[ClienteRead])
def listar_clientes(db: Session = Depends(get_session)):
    return c_cliente.obtener_clientes(db)

@router.get("/{cliente_id}", response_model=ClienteRead)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_session)):
    cliente = c_cliente.obtener_cliente(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.put("/{cliente_id}", response_model=ClienteRead)
def actualizar_cliente(cliente_id: int, datos: ClienteUpdate, db: Session = Depends(get_session)):
    cliente = c_cliente.actualizar_cliente(db, cliente_id, datos)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_session)):
    cliente = c_cliente.eliminar_cliente(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"mensaje": "Cliente eliminado correctamente"}