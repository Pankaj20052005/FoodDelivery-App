package com.hackathon.fooddelivery.controller;

import com.hackathon.fooddelivery.dto.BillSplitResponse;
import com.hackathon.fooddelivery.dto.OrderResponse;
import com.hackathon.fooddelivery.dto.PlaceOrderRequest;
import com.hackathon.fooddelivery.dto.UpdateTrackingRequest;
import com.hackathon.fooddelivery.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrder(orderId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }

    @PutMapping("/{orderId}/tracking")
    public ResponseEntity<OrderResponse> updateTracking(
            @PathVariable Long orderId,
            @RequestBody UpdateTrackingRequest request) {
        return ResponseEntity.ok(orderService.updateTracking(orderId, request));
    }

    @GetMapping("/{orderId}/bill-split")
    public ResponseEntity<BillSplitResponse> getBillSplit(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getBillSplit(orderId));
    }
}