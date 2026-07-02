package com.hackathon.fooddelivery.dto;

import lombok.Data;
import java.util.List;

@Data
public class PlaceOrderRequest {
    private Long userId;
    private String deliveryAddress;
    private List<String> splitUpiIds;

    // Razorpay payment verification fields
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}