package com.hackathon.fooddelivery.service;

import com.hackathon.fooddelivery.dto.BillSplitResponse;
import com.hackathon.fooddelivery.dto.OrderResponse;
import com.hackathon.fooddelivery.dto.PlaceOrderRequest;
import com.hackathon.fooddelivery.dto.UpdateTrackingRequest;
import com.hackathon.fooddelivery.model.Cart;
import com.hackathon.fooddelivery.model.CartItem;
import com.hackathon.fooddelivery.model.Order;
import com.hackathon.fooddelivery.model.OrderItem;
import com.hackathon.fooddelivery.model.User;
import com.hackathon.fooddelivery.repository.CartRepository;
import com.hackathon.fooddelivery.repository.OrderRepository;
import com.hackathon.fooddelivery.repository.UserRepository;
import com.hackathon.fooddelivery.websocket.TrackingWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final CartRepository cartRepo;
    private final UserRepository userRepo;
    private final BillSplitService billSplitService;
    private final TrackingWebSocketHandler trackingHandler;
    private final PaymentService paymentService;

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest req) {

        // 1. Verify that all payment properties are present in the checkout request
        if (req.getRazorpayOrderId() == null || req.getRazorpayPaymentId() == null || req.getRazorpaySignature() == null) {
            throw new RuntimeException("Payment details missing from order placement request");
        }

        // 2. Perform signature check using PaymentService (Key Secret)
        boolean isPaymentVerified = paymentService.verifySignature(
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature()
        );

        // 3. Reject order placement if signature check fails
        if (!isPaymentVerified) {
            throw new RuntimeException("Security check failed: Cryptographic payment signature is invalid");
        }

        Cart cart = cartRepo.findByUserId(req.getUserId())
                .orElseThrow(() -> new RuntimeException("No cart found for user"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cannot place order with empty cart");
        }

        User user = userRepo.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cart.getItems()) {
            orderItems.add(OrderItem.builder()
                    .foodItem(ci.getFoodItem())
                    .quantity(ci.getQuantity())
                    .price(ci.getFoodItem().getPrice())
                    .build());
        }

        List<String> upiIds = req.getSplitUpiIds();
        if (upiIds == null || upiIds.isEmpty()) {
            upiIds = user.getUpiId() != null
                    ? List.of(user.getUpiId())
                    : List.of("orderer@upi");
        }
        String splitUpiIds = String.join(",", upiIds);

        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getTotalAmount())
                .deliveryAddress(req.getDeliveryAddress())
                .splitUpiIds(splitUpiIds)
                .splitCount(upiIds.size())
                .estimatedDelivery(LocalDateTime.now().plusMinutes(40))
                .status(Order.OrderStatus.PLACED)
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        order.setItems(orderItems);

        Order saved = orderRepo.save(order);

        cart.getItems().clear();
        cartRepo.save(cart);

        return mapToResponse(saved);
    }

    public OrderResponse getOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        return mapToResponse(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepo.findByUserIdOrderByPlacedAtDesc(userId)
                .stream().map(this::mapToResponse).toList();
    }


    @Transactional
    public OrderResponse updateStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        Order saved = orderRepo.save(order);

        // Broadcast status updates over websocket connection
        String message = String.format(
                "{\"orderId\":%d,\"lat\":%f,\"lng\":%f,\"status\":\"%s\"}",
                orderId, saved.getDeliveryLat() != null ? saved.getDeliveryLat() : 0.0,
                saved.getDeliveryLng() != null ? saved.getDeliveryLng() : 0.0, saved.getStatus().name()
        );
        trackingHandler.broadcast(orderId.toString(), message);

        return mapToResponse(saved);
    }

    @Transactional
    public OrderResponse updateTracking(Long orderId, UpdateTrackingRequest req) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setDeliveryLat(req.getLat());
        order.setDeliveryLng(req.getLng());
        if (req.getStatus() != null) {
            order.setStatus(Order.OrderStatus.valueOf(req.getStatus().toUpperCase()));
        }

        Order saved = orderRepo.save(order);

        String message = String.format(
                "{\"orderId\":%d,\"lat\":%f,\"lng\":%f,\"status\":\"%s\"}",
                orderId, req.getLat(), req.getLng(), saved.getStatus()
        );
        trackingHandler.broadcast(orderId.toString(), message);

        return mapToResponse(saved);
    }

    public BillSplitResponse getBillSplit(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return billSplitService.getSplitDetails(order);
    }

    public OrderResponse mapToResponse(Order o) {
        List<String> upiList = o.getSplitUpiIds() != null
                ? List.of(o.getSplitUpiIds().split(","))
                : List.of();
        return OrderResponse.builder()
                .orderId(o.getId())
                .userId(o.getUser().getId())
                .status(o.getStatus().name())
                .totalAmount(o.getTotalAmount())
                .deliveryAddress(o.getDeliveryAddress())
                .placedAt(o.getPlacedAt())
                .estimatedDelivery(o.getEstimatedDelivery())
                .deliveryLat(o.getDeliveryLat())
                .deliveryLng(o.getDeliveryLng())
                .splitUpiIds(upiList)
                .splitCount(o.getSplitCount())
                .amountPerPerson(o.getAmountPerPerson())
                .build();
    }
}