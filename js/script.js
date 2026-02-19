document.addEventListener('DOMContentLoaded', function() {
    const btnSecretaria = document.getElementById('btnSecretaria');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');
    const chatBody = document.getElementById('chatBody'); // Usamos el ID nuevo
    const input = chatWindow.querySelector('input');
    const sendBtn = chatWindow.querySelector('.btn-primary');

    const FOTO_SECRETARIA = "img/SecretariaVirtual.png";
    const FOTO_USUARIO = "img/Usuario.png"; 

    // Función unificada para crear mensajes con foto
    function agregarMensaje(texto, esSecretaria = false) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `d-flex align-items-end mb-3 ${esSecretaria ? '' : 'flex-row-reverse'}`;

        const avatarHtml = `
            <div class="avatar-circulo shadow-sm mx-2">
                <img src="${esSecretaria ? FOTO_SECRETARIA : FOTO_USUARIO}" alt="Avatar">
            </div>
        `;

        const burbujaHtml = `
            <span class="badge p-2 shadow-sm burbuja-chat ${esSecretaria ? 'burbuja-secretaria' : 'burbuja-usuario'}">
                ${texto}
            </span>
        `;

        mensajeDiv.innerHTML = avatarHtml + burbujaHtml;
        chatBody.appendChild(mensajeDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // --- MENSAJE POR DEFECTO ---
    // Mensaje de la secretaría al abrir la web
    agregarMensaje("¡Hola! 👋 Soy la secretaria virtual del colegio. ¿En qué puedo ayudarte?", true);

    function enviar() {
        const texto = input.value.trim();
        if (texto) {
            agregarMensaje(texto, false);
            input.value = "";
        }
    }

    sendBtn.addEventListener('click', enviar);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') enviar(); });

    btnSecretaria.addEventListener('click', () => { 
        chatWindow.classList.toggle('d-none');
        chatBody.scrollTop = chatBody.scrollHeight;
    });

    closeChat.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        chatWindow.classList.add('d-none'); 
    });
});