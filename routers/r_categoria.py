from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from database import get_session
from schemas.s_categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate
from crud import c_categoria

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=CategoriaRead)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_session)):
    return c_categoria.crear_categoria(db, categoria)


@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(db: Session = Depends(get_session)):
    return c_categoria.obtener_categorias(db)


@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(categoria_id: int, datos: CategoriaUpdate, db: Session = Depends(get_session)):
    categoria = c_categoria.actualizar_categoria(db, categoria_id, datos)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


@router.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_session)):
    categoria = c_categoria.eliminar_categoria(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"mensaje": "Categoría eliminada correctamente"}