package com.hackathon.fooddelivery.service;

import com.hackathon.fooddelivery.dto.BillSplitEntry;
import com.hackathon.fooddelivery.dto.BillSplitResponse;
import com.hackathon.fooddelivery.model.Order;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class BillSplitService {

    public BillSplitResponse getSplitDetails(Order order) {
        if (order.getSplitUpiIds() == null || order.getSplitUpiIds().isBlank()) {
            throw new RuntimeException("No UPI IDs found for this order");
        }

        double total = order.getTotalAmount();
        List<String> upiIds = Arrays.stream(order.getSplitUpiIds().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        int count = upiIds.size();
        double perPerson = Math.round((total / count) * 100.0) / 100.0;
        double firstPersonAmount = Math.round((total - perPerson * (count - 1)) * 100.0) / 100.0;

        List<BillSplitEntry> splits = new ArrayList<>();
        for (int i = 0; i < upiIds.size(); i++) {
            String upi = upiIds.get(i);
            double amount = (i == 0) ? firstPersonAmount : perPerson;
            splits.add(BillSplitEntry.builder()
                    .upiId(upi)
                    .amount(amount)
                    .paymentLink(buildUpiLink(upi, amount, order.getId()))
                    .build());
        }

        return BillSplitResponse.builder()
                .orderId(order.getId())
                .totalAmount(total)
                .splitCount(count)
                .amountPerPerson(perPerson)
                .splits(splits)
                .build();
    }

    private String buildUpiLink(String upiId, double amount, Long orderId) {
        return String.format(
                "upi://pay?pa=%s&am=%.2f&cu=INR&tn=FoodOrder%%23%d&mc=5812",
                upiId, amount, orderId
        );
    }
}