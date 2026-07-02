package com.hackathon.fooddelivery.dto;

import lombok.Data;

@Data
public class UpdateTrackingRequest {
    private Double lat;
    private Double lng;
    private String status;
}