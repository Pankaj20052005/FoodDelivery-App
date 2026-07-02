package com.hackathon.fooddelivery.dto;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Long userId;
    private Long foodItemId;
    private int quantity;
}