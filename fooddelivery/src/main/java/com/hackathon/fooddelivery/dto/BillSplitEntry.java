package com.hackathon.fooddelivery.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BillSplitEntry {
    private String upiId;
    private Double amount;
    private String paymentLink;
}