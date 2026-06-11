package com.trinitarias.sistema_rag.controller;

import org.springframework.web.bind.annotation.*;

import com.trinitarias.sistema_rag.service.ChatService;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String respuesta = chatService.chat(request.mensaje());
        return new ChatResponse(respuesta);
    }

    public record ChatRequest(String mensaje) {}
    public record ChatResponse(String respuesta) {}
}