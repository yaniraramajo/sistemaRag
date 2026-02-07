document.addEventListener('DOMContentLoaded', function() {
    const btnSecretaria = document.getElementById('btnSecretaria');
    const chatWindow = document.getElementById('chatWindow');
    const closeChat = document.getElementById('closeChat');

    if (btnSecretaria && chatWindow && closeChat) {
        // Abrir/Cerrar el chat al pulsar la secretaria
        btnSecretaria.addEventListener('click', () => {
            chatWindow.classList.toggle('d-none');
        });

        // Cerrar el chat desde la X
        closeChat.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el clic llegue al botón de atrás
            chatWindow.classList.add('d-none');
        });
    }
});
