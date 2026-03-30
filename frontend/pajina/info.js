document.getElementById("contactForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const successMsg = document.getElementById('successMessage');

    // 1. Capturamos los datos (Asegúrate de que 'telefono' exista en tu HTML)
    const datos = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono") ? document.getElementById("telefono").value : "",
        mensaje: document.getElementById("mensaje").value
    };

    try {
        // 2. CAMBIO CLAVE: Usamos ruta relativa para Render
        const respuesta = await fetch("/mensajes/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            // 3. Si el servidor responde bien, ejecutamos tu animación
            form.style.opacity = '0';
            
            setTimeout(() => {
                form.style.display = 'none';
                successMsg.style.display = 'block';
                successMsg.style.animation = 'fadeIn 0.5s ease-in';
            }, 400);

            console.log("Mensaje enviado con éxito:", datos);
        } else {
            const errorData = await respuesta.json();
            alert("Error al enviar: " + (errorData.detail || "Intente más tarde"));
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
});