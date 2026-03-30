from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from backend.database import get_session
from backend.crud.c_producto import obtener_productos
from backend.schemas.s_producto import ProductoCreate, ProductoRead, ProductoUpdate
from backend.crud import c_producto

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.post("/", response_model=ProductoRead)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_session)):
    return c_producto.crear_producto(db, producto)


@router.get("/", response_model=List[ProductoRead])
def listar_productos(db: Session = Depends(get_session)):
    return obtener_productos(db)


@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, db: Session = Depends(get_session)):
    producto = c_producto.obtener_producto(db, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(producto_id: int, datos: ProductoUpdate, db: Session = Depends(get_session)):
    producto = c_producto.actualizar_producto(db, producto_id, datos)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto


@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_session)):
    producto = c_producto.eliminar_producto(db, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": "Producto eliminado correctamente"}