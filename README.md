Secretaría Virtual – Sistema RAG Interactivo
¡Bienvenido al repositorio oficial de la Secretaría Virtual del Colegio Santísima Trinidad de Salamanca!

Este proyecto implementa un sistema avanzado de Generación Aumentada por Recuperación (RAG) diseñado para automatizar la atención a usuarios (familias, alumnos y personal docente), resolviendo dudas organizativas, académicas y administrativas de manera inmediata, precisa y completamente segura.

¿Qué es este proyecto?
    El núcleo de la aplicación consiste en un asistente virtual inteligente capaz de responder preguntas complejas en lenguaje natural (por ejemplo: "¿Cuándo empieza el plazo de matrícula?" o "¿Cuáles son los horarios de secretaría?").

    A diferencia de los chatbots genéricos de internet, este sistema garantiza respuestas verídicas y libres de invenciones (alucinaciones). Consigue este nivel de fiabilidad mediante una arquitectura híbrida que fusiona la potencia de los Modelos de Lenguaje Masivos (LLMs) con un repositorio de datos privado y exclusivo de la institución.

Arquitectura del Sistema
    El proyecto está construido bajo una robusta arquitectura desacoplada y organizada en capas físicas:

        Capa de Presentación (Frontend): Interfaz web interactiva, intuitiva y accesible desde la cual los usuarios formulan sus consultas en tiempo real.

        Capa de Negocio (Backend - Spring Boot): El motor inteligente desarrollado en Java. Utiliza el ecosistema Spring AI para gestionar el flujo de datos, modularizar los prompts de seguridad y coordinar la comunicación entre los clientes y los servicios cognitivos.

        Capa de Almacenamiento Vectorial (Supabase + pgvector): Una base de datos en la nube optimizada para Inteligencia Artificial. Almacena el conocimiento del colegio fragmentado y convertido en vectores numéricos de alta dimensionalidad.

¿Cómo funciona el flujo RAG?
    El ciclo de vida de la información se divide en dos fases esenciales:

        1. Servicio de Ingesta Automatizada (IngestionService)
        Al arrancar el servidor, el sistema localiza de forma interna los documentos informativos del centro (PDFs, circulares, calendarios, archivos de Word). Utilizando la librería Apache Tika, extrae el texto limpio y lo fragmenta mediante un algoritmo inteligente (TokenTextSplitter) en bloques con solapamiento (overlap). Posteriormente, transforma estos bloques en vectores numéricos y los aloja de forma segura en la tabla de Supabase, implementando controles automáticos para evitar la duplicidad de registros.

        2. Motor de Inferencia y Chat (ChatService)
        Cuando un usuario realiza una consulta, el Backend optimiza semánticamente la pregunta y lanza una búsqueda matemática de similitud de cosenos en Supabase, extrayendo exclusivamente los fragmentos documentales más relevantes.
        Esta información real es inyectada en una plantilla rígida de directrices junto con la consulta original. El modelo de lenguaje (ejecutado de forma eficiente en la nube a través de la API de Groq) procesa este contexto restringido y genera una respuesta directa, educada y 100% fiel a los documentos institucionales. Si la información no existe en los manuales, el sistema activa un protocolo de contingencia que redirige al usuario a los canales de soporte físico del colegio.

Tecnologías Utilizadas
    Lenguaje Principal: Java 17 / 21

    Framework Backend: Spring Boot 3.x con Spring AI

    Base de Datos Vectorial: Supabase (PostgreSQL con la extensión pgvector)

    Procesamiento de Documentos: Apache Tika Document Reader

    Modelos de IA: Modelos de embeddings e inferencia de texto integrados mediante APIs de alto rendimiento (Groq / Ollama).