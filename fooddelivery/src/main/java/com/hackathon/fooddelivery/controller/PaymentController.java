package com.hackathon.fooddelivery.controller;

import com.hackathon.fooddelivery.dto.RazorpayOrderResponse;
import com.hackathon.fooddelivery.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@RequestBody Map<String, Double> payload) {
        Double amount = payload.get("amount");
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Invalid payment amount");
        }
        return ResponseEntity.ok(paymentService.createRazorpayOrder(amount));
    }
}