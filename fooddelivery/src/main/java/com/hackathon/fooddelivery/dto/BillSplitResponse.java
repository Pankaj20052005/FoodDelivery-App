package com.hackathon.fooddelivery.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class BillSplitResponse {
    private Long orderId;
    private Double totalAmount;
    private Integer splitCount;
    private Double amountPerPerson;
    private List<BillSplitEntry> splits;
}