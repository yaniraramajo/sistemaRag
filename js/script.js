// Espera a que todo el HTML esté cargado antes de ejecutar el código para evitar errores
document.addEventListener('DOMContentLoaded', function() {

    // --- SELECCIÓN DE ELEMENTOS ---
    // Guardamos en constantes los elementos del HTML que vamos a usar
    const btnSecretaria = document.getElementById('btnSecretaria'); // Botón flotante (SECRETARIA)
    const chatWindow = document.getElementById('chatWindow'); // Ventana de chat
    const closeChat = document.getElementById('closeChat'); // El botón 'X' de la cabecera para cerrar el chat
    const chatBody = document.getElementById('chatBody'); // Área de visualización de mensajes
    
    // CAMBIO: Ahora seleccionamos el 'textarea' en lugar del 'input'
    const input = chatWindow.querySelector('textarea'); 
    
    const sendBtn = chatWindow.querySelector('.btn-primary'); // Botón de Enviar

    // Definimos las rutas de las imágenes
    const FOTO_SECRETARIA = "img/SecretariaVirtual.png";
    const FOTO_USUARIO = "img/Usuario.png"; 

    // --- FUNCIÓN PARA CREAR MENSAJES ---
    // Esta función fabrica el HTML de cada burbuja de chat
    function agregarMensaje(texto, esSecretaria = false) {

        // Creamos un nuevo contenedor para el mensaje 
        const mensajeDiv = document.createElement('div');

        // Si el usuario (esSecretaria = false), añade 'flex-row-reverse' para poner la foto a la derecha
        mensajeDiv.className = `d-flex align-items-end mb-3 ${esSecretaria ? '' : 'flex-row-reverse'}`;

        // Definimos el HTML de la foto (avatar). Se elige la imagen según quién hable
        const avatarHtml = `
            <div class="avatar-circulo shadow-sm mx-2">
                <img src="${esSecretaria ? FOTO_SECRETARIA : FOTO_USUARIO}" alt="Avatar">
            </div>
        `;

        // Definimos el HTML de la burbuja. Se elige la clase CSS según quién hable
        const burbujaHtml = `
            <span class="badge p-2 shadow-sm burbuja-chat ${esSecretaria ? 'burbuja-secretaria' : 'burbuja-usuario'}">
                ${texto}
            </span>
        `;

        // Metemos el avatar y la burbuja dentro del div principal del mensaje
        mensajeDiv.innerHTML = avatarHtml + burbujaHtml;

        // Añadimos el mensaje al final del cuerpo del chat
        chatBody.appendChild(mensajeDiv);

        // Hacemos scroll automático hacia abajo para ver siempre el último mensaje
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // --- MENSAJE POR BIENVENIDA ---
    // Mensaje de la secretaría al abrir la web
    agregarMensaje("¡Hola! 👋 Soy la secretaria virtual del colegio. ¿En qué puedo ayudarte?", true);


    // --- LÓGICA DE ENVÍO ---
    // Esta función lee lo que escribió el usuario y lo añade al chat
    function enviar() {
        const texto = input.value.trim(); // Cogemos el texto y quitamos espacios vacíos
        if (texto) { // Solo enviamos si el mensaje no está vacío
            agregarMensaje(texto, false); // Añadimos mensaje como usuario (esSecretaria = false)
            input.value = ""; // Limpiamos el cuadro de texto
            input.style.height = 'auto'; // Reseteamos la altura del textarea al enviar
        }
    }

    // Al pulsar el botón de enviar
    sendBtn.addEventListener('click', enviar);

    // Ajuste para el textarea: permite Enter para enviar y Shift+Enter para nueva línea
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Evita que el Enter cree una línea nueva en el textarea
            enviar();
        }
    });

    // Efecto para que el textarea crezca según escribes (como WhatsApp)
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Al pulsar el botón circular de la secretaria (abre/cierra el chat)
    btnSecretaria.addEventListener('click', () => { 
        chatWindow.classList.toggle('d-none'); // Quita o pone la clase que oculta el chat
        chatBody.scrollTop = chatBody.scrollHeight; // Se asegura de bajar el scroll al abrir
    });

    // Al pulsar el botón de cerrar (la 'X')
    closeChat.addEventListener('click', (e) => { 
        e.stopPropagation(); // Evita que el clic afecte a otros elementos padres
        chatWindow.classList.add('d-none'); // Oculta la ventana de chat
    });
});