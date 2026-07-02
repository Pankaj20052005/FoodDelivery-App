package com.hackathon.fooddelivery.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class TrackingWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, Set<WebSocketSession>> orderSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String orderId = extractOrderId(session);
        orderSessions.computeIfAbsent(orderId, k -> new CopyOnWriteArraySet<>()).add(session);
        sendMessage(session, "{\"type\":\"connected\",\"orderId\":\"" + orderId + "\",\"message\":\"Tracking started\"}");
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        sendMessage(session, "{\"type\":\"pong\"}");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String orderId = extractOrderId(session);
        Set<WebSocketSession> sessions = orderSessions.get(orderId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                orderSessions.remove(orderId);
            }
        }
    }

    public void broadcast(String orderId, String jsonMessage) {
        Set<WebSocketSession> sessions = orderSessions.get(orderId);
        if (sessions == null || sessions.isEmpty()) return;
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                sendMessage(session, jsonMessage);
            }
        }
    }

    private void sendMessage(WebSocketSession session, String text) {
        try {
            session.sendMessage(new TextMessage(text));
        } catch (IOException e) {
            // session closed
        }
    }

    private String extractOrderId(WebSocketSession session) {
        String path = session.getUri() != null ? session.getUri().getPath() : "";
        String[] parts = path.split("/");
        return parts.length > 0 ? parts[parts.length - 1] : "unknown";
    }
}