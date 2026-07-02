package com.hackathon.fooddelivery.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RazorpayOrderResponse {
    private String razorpayOrderId;
    private String currency;
    private Integer amount; // in paise
    private String keyId; // Sent so frontend doesn't hardcode it
}