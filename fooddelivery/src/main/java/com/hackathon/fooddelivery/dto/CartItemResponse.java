package com.hackathon.fooddelivery.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {
    private Long id;
    private Long foodItemId;
    private String foodItemName;
    private Double price;
    private int quantity;
    private Double subtotal;
}