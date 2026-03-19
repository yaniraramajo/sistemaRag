// Espera a que todo el HTML esté cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- SELECCIÓN DE ELEMENTOS ---
    const botonSecretaria = document.getElementById('botonSecretaria');
    const ventanaChat = document.querySelector('.contenedor-chat');
    const pantallaBienvenida = document.getElementById('pantallaBienvenida');
    const pantallaChat = document.getElementById('pantallaChat');
    const cerrarBienvenida = document.getElementById('cerrarBienvenida');
    const cerrarChat = document.getElementById('cerrarChat');
    const editarChat = document.getElementById('editarChat');
    const areaMensajes = document.getElementById('areaMensajes');
    const inputMensaje = document.getElementById('inputMensaje');
    const botonEnviar = document.getElementById('botonEnviar');
    const inputBienvenida = document.getElementById('inputBienvenida');
    const botonEnviarBienvenida = document.getElementById('botonEnviarBienvenida');
    const botonesRapidos = document.querySelectorAll('.boton-rapido');

    // Imágenes
    const FOTO_SECRETARIA = "img/SecretariaVirtual.png";
    const FOTO_USUARIO = "img/Usuario.png";

    // --- FUNCIÓN PARA AGREGAR MENSAJES ---
    function agregarMensaje(texto, esSecretaria = false) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `d-flex align-items-end mb-3 ${esSecretaria ? '' : 'flex-row-reverse'}`;

        const avatarHtml = `
            <div class="avatar-circulo mx-2">
                <img src="${esSecretaria ? FOTO_SECRETARIA : FOTO_USUARIO}" alt="Avatar">
            </div>
        `;

        const burbujaHtml = `
            <div class="burbuja-mensaje ${esSecretaria ? 'burbuja-secretaria' : 'burbuja-usuario'}">
                ${texto}
            </div>
        `;

        mensajeDiv.innerHTML = avatarHtml + burbujaHtml;
        areaMensajes.appendChild(mensajeDiv);
        areaMensajes.scrollTop = areaMensajes.scrollHeight;
    }

    // --- ANIMACIÓN DE CARGA (SOLO 3 PUNTOS) ---
    function mostrarCargando() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'd-flex align-items-end mb-3';
        loadingDiv.id = 'indicadorCarga';
        
        loadingDiv.innerHTML = `
            <div class="avatar-circulo mx-2">
                <img src="${FOTO_SECRETARIA}" alt="Avatar">
            </div>
            <div class="animacion-carga">
                <div class="puntos-carga">
                    <div class="punto-carga"></div>
                    <div class="punto-carga"></div>
                    <div class="punto-carga"></div>
                </div>
            </div>
        `;
        
        areaMensajes.appendChild(loadingDiv);
        areaMensajes.scrollTop = areaMensajes.scrollHeight;
    }

    function ocultarCargando() {
        const indicadorCarga = document.getElementById('indicadorCarga');
        if (indicadorCarga) {
            indicadorCarga.remove();
        }
    }

    // --- CAMBIAR DE PANTALLA DE BIENVENIDA A CHAT ---
    function irAlChat() {
        pantallaBienvenida.classList.add('d-none');
        pantallaChat.classList.remove('d-none');
    }

    // --- MENSAJE DE BIENVENIDA EN CHAT ---
    function mensajeBienvenida() {
        agregarMensaje("¡Hola! 👋 Soy la secretaria virtual del colegio. ¿En qué puedo ayudarte?", true);
    }

    // --- FUNCIÓN DE ENVÍO ---
    function enviarMensaje(texto) {
        if (texto.trim()) {
            // Cambiar a pantalla de chat si estamos en bienvenida
            if (!pantallaBienvenida.classList.contains('d-none')) {
                irAlChat();
                mensajeBienvenida();
            }
            
            // Agregar mensaje del usuario
            agregarMensaje(texto, false);
            
            // Mostrar animación de carga
            mostrarCargando();
            
            // Aquí conectarás con tu backend
            // Ejemplo: cuando llegue la respuesta del backend, hacer:
            // ocultarCargando();
            // agregarMensaje(respuestaDelBackend, true);
            
            // Limpiar inputs
            inputBienvenida.value = "";
            inputBienvenida.style.height = '48px';
            inputMensaje.value = "";
            inputMensaje.style.height = '48px';
        }
    }

    // --- BOTONES DE ACCESO RÁPIDO EN BIENVENIDA ---
    botonesRapidos.forEach(btn => {
        btn.addEventListener('click', function() {
            const mensaje = this.getAttribute('data-mensaje');
            enviarMensaje(mensaje);
        });
    });

    // --- ENVIAR DESDE INPUT DE BIENVENIDA ---
    botonEnviarBienvenida.addEventListener('click', () => {
        enviarMensaje(inputBienvenida.value);
    });

    inputBienvenida.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje(inputBienvenida.value);
        }
    });

    // --- AUTO-RESIZE DE AMBOS TEXTAREA ---
    inputBienvenida.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    inputMensaje.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // --- ENVIAR DESDE CHAT ---
    botonEnviar.addEventListener('click', () => {
        enviarMensaje(inputMensaje.value);
    });

    inputMensaje.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje(inputMensaje.value);
        }
    });

    // --- ABRIR CHAT ---
    botonSecretaria.addEventListener('click', () => {
        ventanaChat.classList.toggle('d-none');
        const wrapper = document.querySelector('.secretaria-btn-wrapper');
        if (!ventanaChat.classList.contains('d-none')) {
            inputBienvenida.focus();
            wrapper.classList.add('chat-abierto');
        } else {
            wrapper.classList.remove('chat-abierto');
        }
    });

    // --- CERRAR DESDE BIENVENIDA ---
    cerrarBienvenida.addEventListener('click', () => {
        ventanaChat.classList.add('d-none');
        document.querySelector('.secretaria-btn-wrapper').classList.remove('chat-abierto');
    });

    // --- CERRAR DESDE CHAT ---
    cerrarChat.addEventListener('click', () => {
        ventanaChat.classList.add('d-none');
        document.querySelector('.secretaria-btn-wrapper').classList.remove('chat-abierto');
    });

    // --- LIMPIAR CHAT (BOTÓN EDITAR) ---
    editarChat.addEventListener('click', () => {
        areaMensajes.innerHTML = '';
        pantallaChat.classList.add('d-none');
        pantallaBienvenida.classList.remove('d-none');
        inputBienvenida.value = '';
        inputMensaje.value = '';
    });
});