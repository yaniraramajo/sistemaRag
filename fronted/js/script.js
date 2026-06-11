document.addEventListener('DOMContentLoaded', function() {

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
    const iconoEnviar = document.getElementById('iconoEnviar');
    const iconoStop = document.getElementById('iconoStop');
    const inputBienvenida = document.getElementById('inputBienvenida');
    const botonEnviarBienvenida = document.getElementById('botonEnviarBienvenida');
    const botonesRapidos = document.querySelectorAll('.boton-rapido');
    const bocadillo = document.getElementById('bocadillo');
    const cerrarBocadillo = document.getElementById('cerrarBocadillo');

    const FOTO_SECRETARIA = "img/SecretariaVirtual.png";
    const FOTO_USUARIO = "img/Usuario.png";

    let iaRespondiendo = false;
    let abortController = null;

    // ─── BOCADILLO ──────────────────────────────────────────────
    setTimeout(() => {
        if (bocadillo && bocadillo.dataset.cerrado !== 'true') {
            bocadillo.style.display = 'block';
        }
    }, 1500);

    if (cerrarBocadillo) {
        cerrarBocadillo.addEventListener('click', (e) => {
            e.stopPropagation();
            bocadillo.style.display = 'none';
        });
    }

    function ocultarBocadillo() {
    if (bocadillo) {
        bocadillo.style.display = 'none';
        bocadillo.dataset.cerrado = 'true';
    }
}

    // ─── BLOQUEO / DESBLOQUEO INPUT ─────────────────────────────
    function bloquearInput() {
        iaRespondiendo = true;
        inputMensaje.disabled = true;
        inputMensaje.placeholder = 'La IA está respondiendo...';
        botonEnviar.classList.add('modo-stop');
        document.querySelector('.pie-chat .contenedor-input').classList.add('bloqueado');
        iconoEnviar.style.display = 'none';
        iconoStop.style.display = 'block';
        botonesRapidos.forEach(b => b.disabled = true);
        botonEnviarBienvenida.disabled = true;
        inputBienvenida.disabled = true;
    }

    function desbloquearInput() {
        iaRespondiendo = false;
        abortController = null;
        inputMensaje.disabled = false;
        inputMensaje.placeholder = 'Escribe aquí tu mensaje';
        botonEnviar.classList.remove('modo-stop');
        document.querySelector('.pie-chat .contenedor-input')?.classList.remove('bloqueado');
        iconoEnviar.style.display = 'block';
        iconoStop.style.display = 'none';
        botonesRapidos.forEach(b => b.disabled = false);
        botonEnviarBienvenida.disabled = false;
        inputBienvenida.disabled = false;
        inputMensaje.focus();
    }

    // ─── MENSAJES ────────────────────────────────────────────────
    function agregarMensaje(texto, esSecretaria = false) {
        if (!texto || texto === 'undefined') return;

        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `d-flex align-items-end mb-3 ${esSecretaria ? '' : 'flex-row-reverse'}`;

        const contenido = esSecretaria ? marked.parse(texto) : texto;

        const avatarHtml = `
            <div class="avatar-circulo mx-2">
                <img src="${esSecretaria ? FOTO_SECRETARIA : FOTO_USUARIO}" alt="Avatar">
            </div>
        `;
        const burbujaHtml = `
            <div class="burbuja-mensaje ${esSecretaria ? 'burbuja-secretaria' : 'burbuja-usuario'}">
                ${contenido}
            </div>
        `;

        mensajeDiv.innerHTML = avatarHtml + burbujaHtml;
        areaMensajes.appendChild(mensajeDiv);
        areaMensajes.scrollTop = areaMensajes.scrollHeight;
    }

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
        if (indicadorCarga) indicadorCarga.remove();
    }

    // ─── PANTALLAS ───────────────────────────────────────────────
    function irAlChat() {
        pantallaBienvenida.classList.add('d-none');
        pantallaChat.classList.remove('d-none');
    }

    function mensajeBienvenida() {
        agregarMensaje("¡Hola! 👋 Soy la secretaria virtual del colegio. ¿En qué puedo ayudarte?", true);
    }

    // ─── ENVÍO ───────────────────────────────────────────────────
    async function enviarMensaje(texto) {
        if (!texto.trim() || iaRespondiendo) return;

        if (!pantallaBienvenida.classList.contains('d-none')) {
            irAlChat();
            mensajeBienvenida();
        }

        agregarMensaje(texto, false);
        mostrarCargando();
        bloquearInput();

        inputBienvenida.value = "";
        inputBienvenida.style.height = '48px';
        inputMensaje.value = "";
        inputMensaje.style.height = '48px';

        abortController = new AbortController();

        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje: texto }),
                signal: abortController.signal
            });

            const data = await response.json();
            ocultarCargando();

            if (data && data.respuesta) {
                agregarMensaje(data.respuesta, true);
            } else {
                agregarMensaje('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo o contacta con secretaría al 923225477.', true);
            }

        } catch (error) {
            ocultarCargando();
            if (error.name === 'AbortError') {
                agregarMensaje('Respuesta cancelada.', true);
            } else {
                agregarMensaje('Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo o contacta con secretaría al 923225477.', true);
            }
        } finally {
            desbloquearInput();
        }
    }

    // ─── BOTÓN ENVIAR / STOP ─────────────────────────────────────
    botonEnviar.addEventListener('click', () => {
        if (iaRespondiendo) {
            if (abortController) abortController.abort();
        } else {
            enviarMensaje(inputMensaje.value);
        }
    });

    inputMensaje.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!iaRespondiendo) enviarMensaje(inputMensaje.value);
        }
    });

    // ─── BOTONES RÁPIDOS ─────────────────────────────────────────
    botonesRapidos.forEach(btn => {
        btn.addEventListener('click', function() {
            enviarMensaje(this.getAttribute('data-mensaje'));
        });
    });

    // ─── INPUT BIENVENIDA ────────────────────────────────────────
    botonEnviarBienvenida.addEventListener('click', () => {
        enviarMensaje(inputBienvenida.value);
    });

    inputBienvenida.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarMensaje(inputBienvenida.value);
        }
    });

    // ─── AUTO-RESIZE ─────────────────────────────────────────────
    inputBienvenida.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    inputMensaje.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // ─── ABRIR / CERRAR CHAT ─────────────────────────────────────
    botonSecretaria.addEventListener('click', () => {
        ocultarBocadillo();
        ventanaChat.classList.toggle('d-none');
        const wrapper = document.querySelector('.secretaria-btn-wrapper');
        if (!ventanaChat.classList.contains('d-none')) {
            inputBienvenida.focus();
            wrapper.classList.add('chat-abierto');
        } else {
            wrapper.classList.remove('chat-abierto');
        }
    });

    cerrarBienvenida.addEventListener('click', () => {
        ventanaChat.classList.add('d-none');
        document.querySelector('.secretaria-btn-wrapper').classList.remove('chat-abierto');
    });

    cerrarChat.addEventListener('click', () => {
        ventanaChat.classList.add('d-none');
        document.querySelector('.secretaria-btn-wrapper').classList.remove('chat-abierto');
    });

    editarChat.addEventListener('click', () => {
        areaMensajes.innerHTML = '';
        pantallaChat.classList.add('d-none');
        pantallaBienvenida.classList.remove('d-none');
        inputBienvenida.value = '';
        inputMensaje.value = '';
        if (iaRespondiendo && abortController) abortController.abort();
        desbloquearInput();
    });
});