package com.trinitarias.sistema_rag.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private VectorStore vectorStore;

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String chat(String pregunta) {
        // Enriquecer la query para mejor búsqueda
        String queryBusqueda = "colegio trinitarias salamanca " + pregunta;
        
        SearchRequest request = SearchRequest
                .builder()
                .query(queryBusqueda)
                .topK(4)
                .similarityThreshold(0.0)
                .build();

        List<Document> documentosRelevantes = vectorStore.similaritySearch(request);
        
        System.out.println("=== DOCUMENTOS ENCONTRADOS: " + documentosRelevantes.size() + " ===");
        documentosRelevantes.forEach(d -> System.out.println(">>> " + d.getText().substring(0, Math.min(150, d.getText().length()))));

        String contexto = documentosRelevantes.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        String prompt = """
        	    Eres la Secretaría Virtual del Colegio Santísima Trinidad de Salamanca.
        	    Responde SIEMPRE en español, de forma amable y concisa.
        	    Usa ÚNICAMENTE la información del CONTEXTO para responder.
        	    Si la respuesta está en el contexto, respóndela directamente y de forma COMPLETA sin omitir datos.
        	    NO resumas ni omitas elementos de listas o tablas — inclúyelos TODOS.
        	    Si no encuentras la información en el contexto, di:
        	    "No tengo esa información disponible. Por favor contacta con la secretaría
        	    en secretaria@trinitarias.com o llamando al 923225477."
        	    NO inventes ni añadas información que no esté en el contexto.
        	    
        	    CONTEXTO:
        	    %s
        	    
        	    PREGUNTA:
        	    %s
        	    """.formatted(contexto, pregunta);

        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}