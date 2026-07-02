package com.hackathon.fooddelivery.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    public enum OrderStatus {
        PLACED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private OrderStatus status = OrderStatus.PLACED;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "placed_at")
    @Builder.Default
    private LocalDateTime placedAt = LocalDateTime.now();

    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;

    @Column(name = "delivery_lat")
    private Double deliveryLat;

    @Column(name = "delivery_lng")
    private Double deliveryLng;

    @Column(name = "split_upi_ids")
    private String splitUpiIds;

    @Column(name = "split_count")
    private Integer splitCount;

    public Double getAmountPerPerson() {
        if (splitCount == null || splitCount <= 1) return totalAmount;
        return totalAmount / splitCount;
    }
}