from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware 
from database import crear_db
from routers import r_producto, r_categoria, r_clientes, r_venta, r_admin, r_mensaje

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

app.include_router(r_producto.router)
app.include_router(r_categoria.router)
app.include_router(r_clientes.router)
app.include_router(r_venta.router)
app.include_router(r_admin.router)
app.include_router(r_mensaje.router)

@app.on_event("startup")
def on_startup():
    crear_db()

@app.get("/")
def home():
    return {"mensaje": "API Gestión de Usuario Activa"}


app.mount("/pagina", StaticFiles(directory="../frontend/pajina"), name="pagina")
app.mount("/sistema", StaticFiles(directory="../frontend/sistema"), name="sistema")
app.mount("/login", StaticFiles(directory="../frontend/login"), name="login")