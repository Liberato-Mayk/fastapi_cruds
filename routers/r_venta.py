from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from database import get_session
from crud.c_venta import obtener_ventas, eliminar_venta

from database import get_session
from schemas.s_venta import VentaCreate, VentaRead
from crud import c_venta

router = APIRouter(prefix="/ventas", tags=["Ventas"])


@router.post("/", response_model=VentaRead)
def crear_venta(venta: VentaCreate, db: Session = Depends(get_session)):
    return c_venta.crear_venta(db, venta)


@router.get("/")
def listar_ventas(db: Session = Depends(get_session)):
    return obtener_ventas(db)


@router.delete("/{venta_id}")
def eliminar_venta_router(venta_id: int, db: Session = Depends(get_session)):
    return c_venta.eliminar_venta(db, venta_id)