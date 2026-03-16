document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.target;
    const successMsg = document.getElementById('successMessage');

    form.style.opacity = '0';
    
    setTimeout(() => {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.style.animation = 'fadeIn 0.5s ease-in';
    }, 400);

    const datos = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    console.log("Datos capturados para el Admin:", datos);
});

document.getElementById("contactForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const datos = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        mensaje: document.getElementById("mensaje").value
    };
    try{
        const respuesta = await fetch("http://127.0.0.1:8000/mensajes/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(datos)
        });
        if(respuesta.ok){
            document.getElementById("contactForm").style.display = "none";
            document.getElementById("successMessage").style.display = "block";
        }else{
            alert("Error al enviar el mensaje");
        }
    }catch(error){
        console.error(error);
        alert("No se pudo conectar con el servidor");
    }
});