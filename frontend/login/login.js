let esRegistro = false;
const API_URL = "http://127.0.0.1:8000/admin"; // Incluimos el prefijo del router

const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");
const btnMain = document.getElementById("btn-main");
const toggleText = document.getElementById("toggle-text");
const errorMsg = document.getElementById("error");

toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    esRegistro = !esRegistro;
    formTitle.innerText = esRegistro ? "Crear Administrador" : "Acceso al Sistema";
    btnMain.innerText = esRegistro ? "Registrar" : "Ingresar";
    toggleText.innerHTML = esRegistro 
        ? '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>'
        : '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate aquí</a>';
    
    // Re-vincular evento al nuevo link
    document.getElementById("toggle-link").addEventListener("click", () => toggleLink.click());
});

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    errorMsg.innerText = "";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Ajuste de rutas según tu r_admin.py
    const endpoint = esRegistro ? `${API_URL}/create-admin` : `${API_URL}/login`;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Enviamos los datos. Nota: create-admin en tu código actual no recibe parámetros, 
            // crea uno por defecto "admin/123456".
            body: JSON.stringify({ username, password }) 
        });

        const data = await response.json();

        if (response.ok) {
            if (esRegistro) {
                alert(`Admin creado: ${data.usuario}. Ahora inicia sesión.`);
                location.reload();
            } else {
                localStorage.setItem("token", data.access_token);
                // Salir de carpeta 'login' e ingresar a 'sistema'
                window.location.href = "../sistema/index.html";
            }
        } else {
            errorMsg.innerText = data.detail || "Error en la operación";
        }
    } catch (err) {
        errorMsg.innerText = "Error de conexión con el servidor.";
    }
});