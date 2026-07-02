package com.hackathon.fooddelivery.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.hackathon.fooddelivery.dto.RazorpayOrderResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    /**
     * Creates a Razorpay Order in their server and returns the order metadata.
     */
    public RazorpayOrderResponse createRazorpayOrder(double amountInRupees) {
        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            // Razorpay processes amount in Paise (1 Rupee = 100 Paise)
            int amountInPaise = (int) Math.round(amountInRupees * 100);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);

            return RazorpayOrderResponse.builder()
                    .razorpayOrderId(order.get("id"))
                    .currency(order.get("currency"))
                    .amount(order.get("amount"))
                    .keyId(keyId)
                    .build();
        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to generate Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Verifies the cryptographic signature returned by the checkout overlay using the secret key.
     */
    public boolean verifySignature(String orderId, String paymentId, String signature) {
        try {
            // Wrap attributes inside a JSONObject
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", orderId);
            attributes.put("razorpay_payment_id", paymentId);
            attributes.put("razorpay_signature", signature);
            // Pass the JSONObject to the Razorpay verify function
            return Utils.verifyPaymentSignature(attributes, keySecret);
        } catch (Exception e) {
            return false;
        }
    }
}