let esRegistro = false;
const API_URL = "/admin"; 

const formTitle = document.getElementById("form-title");
const btnMain = document.getElementById("btn-main");
const toggleText = document.getElementById("toggle-text");
const errorMsg = document.getElementById("error");
const form = document.getElementById("loginForm");

// 🔹 FUNCIÓN PARA ACTIVAR EL TOGGLE (sin errores)
function activarToggle() {
    const toggleLink = document.getElementById("toggle-link");

    toggleLink.addEventListener("click", (e) => {
        e.preventDefault();

        esRegistro = !esRegistro;

        formTitle.innerText = esRegistro ? "Crear Administrador" : "Acceso al Sistema";
        btnMain.innerText = esRegistro ? "Registrar" : "Ingresar";

        toggleText.innerHTML = esRegistro 
            ? '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>'
            : '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate aquí</a>';

        activarToggle(); // 🔥 reactivar evento correctamente
    });
}

// Activar por primera vez
activarToggle();

// 🔹 ENVÍO DEL FORMULARIO
form.addEventListener("submit", async function(e) {
    e.preventDefault();

    errorMsg.innerText = "";

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        errorMsg.innerText = "Todos los campos son obligatorios";
        return;
    }

    const endpoint = esRegistro 
        ? `${API_URL}/create-admin` 
        : `${API_URL}/login`;

    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Respuesta inválida del servidor");
        }

        if (response.ok) {

            if (esRegistro) {
                alert(`✅ Admin creado: ${data.usuario}\nAhora inicia sesión`);
                location.reload();
            } else {
                localStorage.setItem("token", data.access_token);

                // Redirección al sistema
                window.location.href = "../sistema/index.html";
            }

        } else {
            errorMsg.innerText = data.detail || "Error en la operación";
        }

    } catch (err) {
        console.error(err);
        errorMsg.innerText = "❌ Error de conexión con el servidor";
    }
});