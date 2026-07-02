package com.hackathon.fooddelivery.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String status;
    private Double totalAmount;
    private String deliveryAddress;
    private LocalDateTime placedAt;
    private LocalDateTime estimatedDelivery;
    private Double deliveryLat;
    private Double deliveryLng;
    private List<String> splitUpiIds;
    private Integer splitCount;
    private Double amountPerPerson;
}