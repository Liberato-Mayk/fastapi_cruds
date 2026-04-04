const API_URL = "https://fastapi-cruds.onrender.com";

let seccionActual = 'productos';
let editandoId = null; 
let productoSeleccionadoParaVenta = null;
let carritoVenta = [];

async function mostrarSeccion(seccion) {
    seccionActual = seccion;
    const titulo = document.getElementById('titulo-seccion');
    const btnContenedor = document.getElementById('contenedor-boton');
    const tablaElement = document.getElementById('tabla-general');
    const seccionPagina = document.getElementById('seccion-pagina');
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    const itemMenu = document.getElementById(`menu-${seccion}`);
    if (itemMenu) itemMenu.classList.add('active');
    if (seccion === 'pagina') {
        titulo.innerText = "Página Informativa";
        btnContenedor.innerHTML = "";
        tablaElement.style.display = "none";
        seccionPagina.style.display = "block";
        return;
    }
    tablaElement.style.display = "table";
    seccionPagina.style.display = "none";
    const titulosH1 = { 
        productos: "Gestión de Productos", 
        categorias: "Gestión de Categorías", 
        clientes: "Gestión de Clientes", 
        ventas: "Gestión de Ventas",
        mensajes: "Mensajes Recibidos" 
    };
    const textosBotones = { 
        productos: "Producto", 
        categorias: "Categoría", 
        clientes: "Cliente", 
        ventas: "Venta" 
    };
    titulo.innerText = titulosH1[seccion] || "Panel de Control";
    try {
        const response = await fetch(`${API_URL}/${seccion}/`);
        const lista = await response.json();
        if (seccion === 'ventas') {
            btnContenedor.innerHTML = `<button class="btn-primary" onclick="abrirModalVenta()">Nueva Venta</button>`;
            renderizarTabla(['ID Venta', 'ID Cliente', 'Cliente', 'Producto', 'Total', 'Fecha', ''], lista);
        } 
        else if (seccion === 'mensajes') {
            btnContenedor.innerHTML = ""; 
            renderizarTabla(['ID', 'Nombre Completo', 'Email', 'Teléfono', 'Mensaje', 'Fecha'], lista);
        } 
        else {
            btnContenedor.innerHTML = `<button class="btn-primary" onclick="abrirModalForm()">Nuevo ${textosBotones[seccion]}</button>`;
            
            if (seccion === 'productos') renderizarTabla(['ID', 'Nombre', 'Categoria', 'Stock', 'Precio', 'Fecha', ''], lista);
            else if (seccion === 'categorias') renderizarTabla(['ID', 'Nombre', 'Descripción', 'Fecha', ''], lista);
            else if (seccion === 'clientes') renderizarTabla(['ID', 'Documento', 'Nombre', 'Email', 'Teléfono', 'Fecha de Creación', ''], lista);
        }
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}

function abrirModalVenta() {
    document.getElementById('modalVenta').style.display = "block";
    document.getElementById('v-cliente-buscar').value = "";
    document.getElementById('v-cliente-id-seleccionado').value = "";
    document.getElementById('res-busqueda-cliente').innerHTML = "";
    document.getElementById('v-buscar-prod').value = "";
    document.getElementById('res-busqueda').innerHTML = "";
    document.getElementById('lista-carrito').innerHTML = "";
    document.getElementById('v-total-general').innerText = "0.00";
    carritoVenta = [];
}

async function buscarProductoEnVenta(val){
    const res = document.getElementById("res-busqueda");
    const detalles = document.getElementById("detalles-producto-venta");
    res.innerHTML = "";
    if(val.length === 0){
        detalles.innerHTML = "";
        return;}
    const response = await fetch(`${API_URL}/productos/`);
    const productos = await response.json();
    const filtrados = productos.filter(p =>
        p.id.toString().includes(val) ||
        p.nombre.toLowerCase().includes(val.toLowerCase()));

    filtrados.forEach(p =>{
        const div = document.createElement("div");
        div.className = "item-busqueda";
        div.innerText = `${p.nombre} (Stock: ${p.stock})`;
        div.onclick = () =>{
            productoSeleccionadoParaVenta = p;
            detalles.innerHTML = `
            <strong>Producto:</strong> ${p.nombre} |
            <strong>Precio:</strong> S/ ${p.precio} |
            <strong>Stock:</strong> ${p.stock}
            <br><br>
            Cantidad
            <input type="number" id="v-cantidad" value="1" min="1" max="${p.stock}">
            <br><br>
            <button class="btn-primary"
            onclick="agregarAlCarrito(productoSeleccionadoParaVenta)">
            Agregar al carrito
            </button>
            `;};
        res.appendChild(div);
    });}

function agregarAlCarrito(producto) {
    const cantidadInput = document.getElementById("v-cantidad");
    const cantidad = parseInt(cantidadInput.value);
    if (!cantidad || cantidad <= 0) {
        alert("Cantidad inválida");
        return;
    }
    
    if (cantidad > producto.stock) {
        alert("No hay suficiente stock disponible");
        return;
    }
    const subtotal = producto.precio * cantidad;
    carritoVenta.push({
        producto_id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
        subtotal: subtotal
    });
    const mensajeOk = document.createElement('div');
    mensajeOk.innerHTML = `✅ <strong>${producto.nombre}</strong> agregado correctamente`;
    mensajeOk.style = `
        position: fixed; top: 20px; right: 20px; background: #27ae60; color: white;
        padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 9999; font-family: sans-serif; animation: fadeOut 2.5s forwards;
    `;
    document.body.appendChild(mensajeOk);
    setTimeout(() => mensajeOk.remove(), 2500);
    document.getElementById('v-buscar-prod').value = "";
    document.getElementById('detalles-producto-venta').innerHTML = "";
    
    renderizarCarrito(); 
}

function eliminarDelCarrito(id) {
    carritoVenta = carritoVenta.filter(p => p.producto_id !== id);
    renderizarCarrito();
}

function renderizarTabla(cabeceras, lista) {
    document.getElementById('cabecera-tabla').innerHTML =
        `<tr>${cabeceras.map(c => `<th>${c}</th>`).join('')}</tr>`;
    document.getElementById('cuerpo-tabla').innerHTML = lista.map((item) => {
        let campos = [];
        if (seccionActual === 'productos') {
            campos = [
                item.id,
                item.nombre,
                item.categoria_nombre || item.categoria || "Sin categoría",
                item.stock,
                `S/ ${parseFloat(item.precio).toFixed(2)}`,
                new Date(item.fecha_creacion || item.fecha).toLocaleDateString()
            ];
        }
        else if (seccionActual === 'categorias') {
            campos = [
                item.id,
                item.nombre,
                item.descripcion,
                new Date(item.fecha_creacion || item.fecha).toLocaleDateString()
            ];
        }
        else if (seccionActual === 'clientes') {
            campos = [
                item.id,
                item.documento,
                item.nombre,
                item.email,
                item.telefono,
                new Date(item.fecha_creacion || item.fecha).toLocaleDateString()
            ];
        }
        else if (seccionActual === 'mensajes') {
            campos = [
                item.id,
                item.nombre,
                item.email,
                item.telefono,
                item.mensaje,
                new Date(item.fecha).toLocaleDateString()
            ];
        }
        else if (seccionActual === 'ventas') {
            let productos = "";
            if (item.detalles && item.detalles.length > 0) {
                productos = item.detalles
                    .map(d => d.producto_nombre)
                    .join(", ");
            }
            campos = [
                item.id,
                item.cliente_id,
                item.cliente_nombre,
                productos,
                `S/ ${parseFloat(item.total).toFixed(2)}`,
                new Date(item.fecha).toLocaleDateString()
            ];
        }
        let filasHTML = campos
            .map(valor => `<td>${valor !== undefined ? valor : ''}</td>`)
            .join('');
        let accionesHTML = '';
        if (seccionActual === 'ventas') {
            accionesHTML = `
                <div class="dropdown">
                    <button class="btn-tuerca">⚙️</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="verDetalle(${item.id})">👁️ Ver Detalle</a>
                    </div>
                </div>`;
        } else {
            accionesHTML = `
                <div class="dropdown">
                    <button class="btn-tuerca">⚙️</button>
                    <div class="dropdown-content">
                        <a href="#" onclick="abrirModalForm(${item.id})">📝 Actualizar</a>
                        <a href="#" onclick="eliminarFila(${item.id})" style="color:red">❌ Eliminar</a>
                    </div>
                </div>`;
        }
        filasHTML += `<td>${accionesHTML}</td>`;
        return `<tr>${filasHTML}</tr>`;
    }).join('');
}

async function abrirModalForm(id = null) {
    editandoId = id;
    const contenedor = document.getElementById('campos-formulario');
    const tituloModal = document.getElementById('modal-titulo');
    const btnGuardar = document.querySelector('#formularioDinmico .btn-primary');
    tituloModal.innerText = (id !== null ? "Actualizar " : "Nuevo ") + seccionActual;
    btnGuardar.innerText = id !== null ? "Actualizar Datos" : "Guardar Datos";
    
    contenedor.innerHTML = "";

    if (seccionActual === 'productos') { // contruimos el html segun la accion 
        contenedor.innerHTML = `<input id="f-nombre" placeholder="Nombre" required>
                                <input id="f-cat" type="number" placeholder="ID Categoría (Num)" required>
                                <input id="f-stock" type="number" placeholder="Stock" required>
                                <input id="f-precio" type="number" step="0.01" placeholder="Precio" required>`;
    } else if (seccionActual === 'categorias') {
        contenedor.innerHTML = `<input id="f-nombre" placeholder="Nombre Categoría" required>
                                <input id="f-desc" placeholder="Descripción">`;
    } else if (seccionActual === 'clientes') {
        contenedor.innerHTML = `<select id="f-tipo" onchange="cambiarTipoDoc()"><option value="DNI">DNI</option><option value="RUC">RUC</option></select>
                                <input id="f-doc" placeholder="Número de Documento" required>
                                <input id="f-nombre" placeholder="Nombre completo" required>
                                <input id="f-email" type="email" placeholder="Email">
                                <input id="f-telf" placeholder="Teléfono">`;
    }
    // se cargan los datos, si estamos editando 
    if (id !== null) {
        const resp = await fetch(`${API_URL}/${seccionActual}/${id}`);
        const item = await resp.json();
        // llenamos los campos segun la seccion  
        if (seccionActual === 'productos') {
            document.getElementById('f-nombre').value = item.nombre;
            document.getElementById('f-cat').value = item.categoria_id;
            document.getElementById('f-stock').value = item.stock;
            document.getElementById('f-precio').value = item.precio;
        } else if (seccionActual === 'categorias') {
            document.getElementById('f-nombre').value = item.nombre;
            document.getElementById('f-desc').value = item.descripcion;
        } else if (seccionActual === 'clientes') {
            const docPartes = item.documento.includes(":") ? item.documento.split(": ") : ["DNI", item.documento];
            document.getElementById('f-tipo').value = docPartes[0];
            document.getElementById('f-doc').value = docPartes[1] || docPartes[0];
            document.getElementById('f-nombre').value = item.nombre;
            document.getElementById('f-email').value = item.email;
            document.getElementById('f-telf').value = item.telefono;
        }
    }
    document.getElementById('modalForm').style.display = "block";
}

document.getElementById('formularioDinmico').onsubmit = async function(e) {
    e.preventDefault();
    let objetoBase = {};
    if (seccionActual === 'productos') { // contruye el JSON de productos 
        objetoBase = {
            nombre: document.getElementById('f-nombre').value,
            categoria_id: parseInt(document.getElementById('f-cat').value),
            stock: parseInt(document.getElementById('f-stock').value),
            precio: parseFloat(document.getElementById('f-precio').value)
        };
    } else if (seccionActual === 'categorias') { // contruye el JSON de categorias 
        objetoBase = {
            nombre: document.getElementById('f-nombre').value,
            descripcion: document.getElementById('f-desc').value
        };
    } else if (seccionActual === 'clientes') { // contruye el JSON de clientes
        objetoBase = {
            documento: document.getElementById('f-tipo').value + ": " + document.getElementById('f-doc').value,
            nombre: document.getElementById('f-nombre').value,
            email: document.getElementById('f-email').value,
            telefono: document.getElementById('f-telf').value
        };
    }
    const metodo = editandoId !== null ? 'PUT' : 'POST'; // detecta si es para crear o editar
    const url = editandoId !== null ? `${API_URL}/${seccionActual}/${editandoId}` : `${API_URL}/${seccionActual}/`;
    await fetch(url, { // envia el JSON a fastapi
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objetoBase)
    });
    cerrarModal(); // oculta el modelo
    mostrarSeccion(seccionActual); // vuelve a cargar la tabla actual 
};

// elimina la fila en la seccion que se encuentra
async function eliminarFila(id) {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
        await fetch(`${API_URL}/${seccionActual}/${id}`, { method: 'DELETE' });
        mostrarSeccion(seccionActual);
    }
}

// ventana para poder registrar la venta
async function registrarVenta() {
    let clienteId = document.getElementById('v-cliente-id-seleccionado').value;
    const esNuevo = document.getElementById('seccion-cliente-nuevo').style.display === "block";

    if (esNuevo) {
        const nuevoCliente = {
            documento: document.getElementById('vn-tipo').value + ": " + document.getElementById('vn-doc').value,
            nombre: document.getElementById('vn-nombre').value,
            email: document.getElementById('vn-email').value,
            telefono: document.getElementById('vn-telf').value
        };

        if (!nuevoCliente.nombre || !document.getElementById('vn-doc').value) {
            return alert("Por favor, completa el nombre y documento del nuevo cliente.");
        }

        const resC = await fetch(`${API_URL}/clientes/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoCliente)
        });
        const clienteCreado = await resC.json();
        clienteId = clienteCreado.id;
    }

    if (!clienteId) return alert("Seleccione o registre un cliente.");
    if (carritoVenta.length === 0) return alert("El carrito está vacío.");

    const payload = {
        cliente_id: Number(clienteId),
        detalles: carritoVenta.map(p => ({
            producto_id: p.producto_id,
            cantidad: p.cantidad
        }))
    };

    const response = await fetch(`${API_URL}/ventas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (response.ok) {
    const mensajeOk = document.createElement('div');
    mensajeOk.innerHTML = `✅ Venta registrada`;
    mensajeOk.style = `
        position: fixed; top: 20px; right: 20px; background: #27ae60; color: white;
        padding: 15px 25px; border-radius: 8px; z-index: 9999;
    `;
    document.body.appendChild(mensajeOk);

    setTimeout(() => mensajeOk.remove(), 2000);

    cerrarModal();
    mostrarSeccion('ventas');
    }
}

// cierra las ventanas emergentes 
function cerrarModal() {
    document.getElementById('modalForm').style.display = "none";
    document.getElementById('modalVenta').style.display = "none";
}

//calcula el total a pagar 
function calcularTotal() {
    const cantElem = document.getElementById('v-cantidad');
    const totalElem = document.getElementById('v-total');
    let cantidad = parseInt(cantElem.value) || 0;
    if (cantidad > productoSeleccionadoParaVenta.stock) {
        alert("Stock insuficiente");
        cantidad = productoSeleccionadoParaVenta.stock;
        cantElem.value = cantidad;
    }
    totalElem.innerText = (cantidad * productoSeleccionadoParaVenta.precio).toFixed(2);
}

// cambia la cantidad de digitos del DNI/RUC
function cambiarTipoDoc() {
    const tipo = document.getElementById('f-tipo').value;
    const inputDoc = document.getElementById('f-doc');
    inputDoc.placeholder = tipo === "DNI" ? "8 dígitos" : "11 dígitos";
    inputDoc.maxLength = tipo === "DNI" ? 8 : 11;
}

// muestra las ventas que a hecho el cliente
mostrarSeccion('productos');
async function verDetalle(ventaId) {
    const response = await fetch(`${API_URL}/ventas/`);
    const ventas = await response.json();
    const venta = ventas.find(v => v.id === ventaId);
    if (!venta) {
        return alert("Venta no encontrada");
    }
    let html = `
        <h3>Detalle de Venta #${venta.id}</h3>
        <p><strong>Cliente:</strong> ${venta.cliente_nombre}</p>
        <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
        <hr>
    `;
    venta.detalles.forEach(d => {
        html += `
            <div style="margin-bottom:10px;">
                Producto: ${d.producto_nombre}<br>
                Cantidad: ${d.cantidad}<br>
                Precio Unitario: S/ ${d.precio_unitario}<br>
                Subtotal: S/ ${d.subtotal}
            </div>
            <hr>
        `;
    });
    html += `<h4>Total: S/ ${venta.total}</h4>`;
    document.getElementById('modal-titulo').innerText = "Detalle de Venta";
    document.getElementById('campos-formulario').innerHTML = html;
    document.getElementById('modalForm').style.display = "block";
}

// busca el cliente al registrar la venta
async function buscarClienteAlVuelo(val) {
    const res = document.getElementById("res-busqueda-cliente");
    const secNuevo = document.getElementById("seccion-cliente-nuevo");
    const inputId = document.getElementById("v-cliente-id-seleccionado");
    res.innerHTML = "";
    if (val.length === 0) {
        secNuevo.style.display = "none";
        return;
    }
    const response = await fetch(`${API_URL}/clientes/`);
    const clientes = await response.json();
    const filtrados = clientes.filter(c =>
        c.id.toString().includes(val) ||
        c.nombre.toLowerCase().includes(val.toLowerCase()) ||
        c.documento.includes(val)
    );
    if (filtrados.length > 0) {
        secNuevo.style.display = "none";
        filtrados.forEach(c => {
            const div = document.createElement("div");
            div.className = "item-busqueda";
            div.innerText = `${c.nombre} - ${c.documento}`;
            div.onclick = () => {
                document.getElementById("v-cliente-buscar").value = c.nombre;
                inputId.value = c.id;
                res.innerHTML = "";
            };
            res.appendChild(div);
        });
    } else {
        secNuevo.style.display = "block";
        inputId.value = "";
        document.getElementById("vn-nombre").value = val;
    }
}

// carga los mensajes enviados de la pagina
async function cargarMensajes() {
    const cabecera = document.getElementById('cabecera-tabla');
    const cuerpo = document.getElementById('cuerpo-tabla');
    cabecera.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Mensaje</th>
            <th>Fecha</th>
            <th>Acciones</th>
        </tr>
    `;
    try {
        const response = await fetch(`${API_URL}/mensajes/`);
        const mensajes = await response.json();
        cuerpo.innerHTML = '';
        mensajes.forEach(m => {
            cuerpo.innerHTML += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.nombre}</td>
                    <td>${m.email}</td>
                    <td>${m.telefono || '-'}</td>
                    <td><small>${m.mensaje}</small></td>
                    <td>${m.fecha}</td>
                    <td>
                        <button class="btn-delete" onclick="eliminarMensaje(${m.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar mensajes:", error);
        cuerpo.innerHTML = '<tr><td colspan="7">No se pudieron cargar los mensajes.</td></tr>';
    }
}

function renderizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalElem = document.getElementById("v-total-general");

    lista.innerHTML = "";

    let total = 0;

    carritoVenta.forEach(p => {
        total += p.subtotal;

        const div = document.createElement("div");
        div.style = "margin-bottom:10px; padding:10px; border-bottom:1px solid #ccc;";

        div.innerHTML = `
            <strong>${p.nombre}</strong><br>
            Cantidad: ${p.cantidad}<br>
            Precio: S/ ${p.precio}<br>
            Subtotal: S/ ${p.subtotal.toFixed(2)}<br>
            <button onclick="eliminarDelCarrito(${p.producto_id})" 
                style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;">
                ❌ Eliminar
            </button>
        `;

        lista.appendChild(div);
    });

    totalElem.innerText = total.toFixed(2);
}