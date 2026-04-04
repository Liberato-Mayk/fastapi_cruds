let esRegistro = false;
const API_URL = "https://fastapi-cruds.onrender.com/admin";  // url de la api en render

const formTitle = document.getElementById("form-title");   // titulo del formulario 
const btnMain = document.getElementById("btn-main");       //boton primcipal
const toggleText = document.getElementById("toggle-text"); // texto para cambiar login/registro
const errorMsg = document.getElementById("error");         // mensaje de error
const form = document.getElementById("loginForm");         // el formulario completo

// funcion para activar el cambio entre login y registro
function activarToggle() {
    const toggleLink = document.getElementById("toggle-link"); // obtiene el link que el usuario hace click
    
    toggleLink.addEventListener("click", (e) => {e.preventDefault(); // evita que el link recarge la pagina

        esRegistro = !esRegistro;  // cambia de login/registro

        formTitle.innerText = esRegistro ? "Crear Administrador" : "Acceso al Sistema"; // cambia los titulos
        btnMain.innerText = esRegistro ? "Registrar" : "Ingresar";                      // cambia los titulos

        toggleText.innerHTML = esRegistro  // cambia el texto inferior y recrea el link
            ? '¿Ya tienes cuenta? <a href="#" id="toggle-link">Inicia sesión</a>'
            : '¿No tienes cuenta? <a href="#" id="toggle-link">Regístrate aquí</a>';

        activarToggle(); // reactivar evento correctamente
    });
}

// ejecuta la funcion al cargar la pagina
activarToggle();

// escucha cuando el usuario enviael formulario 
form.addEventListener("submit", async function(e) {
    e.preventDefault(); // evita que la pagina se recargue

    errorMsg.innerText = ""; // limpia errores anteriores 

    const username = document.getElementById("username").value.trim(); // obrirne el usuario
    const password = document.getElementById("password").value.trim(); // obtiene la contraceña

    if (!username || !password) {
        errorMsg.innerText = "Todos los campos son obligatorios";
        return;
    }  // verifica si estan correctos 

    const endpoint = esRegistro   
        ? `${API_URL}/create-admin` 
        : `${API_URL}/login`;

    try {
        const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
        });  // envia los datos al backend

        let data;  // conbierte los datos JSON
        try {
            data = await response.json();
        } catch {
            throw new Error("Respuesta inválida del servidor");
        }

        if (response.ok) {
            //  acceso si todo sale bien 
            if (esRegistro) {
                alert(`✅ Admin creado: ${data.usuario}\nAhora inicia sesión`);
                location.reload(); // muestra el mensaje y recarga la pagina
            } else {
                localStorage.setItem("token", data.access_token); // guarda el token jwt

                // Redirección al sistema
                window.location.href = "../sistema/index.html";
            }

        } else {
            errorMsg.innerText = data.detail || "Error en la operación";  // muestra el error del servidor 
        }

    } catch (err) {
        console.error(err);
        errorMsg.innerText = "❌ Error de conexión con el servidor";  // muestra el error si la api falla 
    }
});