package com.hackathon.fooddelivery.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final TrackingWebSocketHandler trackingHandler;

    public WebSocketConfig(TrackingWebSocketHandler trackingHandler) {
        this.trackingHandler = trackingHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(trackingHandler, "/ws/tracking/{orderId}")
                .setAllowedOrigins("*");
    }
}