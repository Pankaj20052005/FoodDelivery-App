package com.hackathon.fooddelivery.service;

import com.hackathon.fooddelivery.dto.AddToCartRequest;
import com.hackathon.fooddelivery.dto.CartItemResponse;
import com.hackathon.fooddelivery.dto.CartResponse;
import com.hackathon.fooddelivery.model.Cart;
import com.hackathon.fooddelivery.model.CartItem;
import com.hackathon.fooddelivery.model.FoodItem;
import com.hackathon.fooddelivery.model.User;
import com.hackathon.fooddelivery.repository.CartItemRepository;
import com.hackathon.fooddelivery.repository.CartRepository;
import com.hackathon.fooddelivery.repository.FoodItemRepository;
import com.hackathon.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final FoodItemRepository foodItemRepo;
    private final UserRepository userRepo;

    public CartResponse getCart(Long userId) {
        Cart cart = cartRepo.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItem(AddToCartRequest req) {
        Cart cart = cartRepo.findByUserId(req.getUserId())
                .orElseGet(() -> createEmptyCart(req.getUserId()));

        FoodItem food = foodItemRepo.findById(req.getFoodItemId())
                .orElseThrow(() -> new RuntimeException("Food item not found: " + req.getFoodItemId()));

        if (!food.isAvailable()) {
            throw new RuntimeException("Food item is currently unavailable");
        }

        Optional<CartItem> existing = cartItemRepo
                .findByCartIdAndFoodItemId(cart.getId(), food.getId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + req.getQuantity());
            cartItemRepo.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .foodItem(food)
                    .quantity(req.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        return mapToResponse(cartRepo.save(cart));
    }

    @Transactional
    public CartResponse updateItemQuantity(Long cartItemId, int quantity) {
        CartItem item = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (quantity <= 0) {
            Cart cart = item.getCart();
            cartItemRepo.delete(item);
            return mapToResponse(cartRepo.findById(cart.getId()).get());
        }
        item.setQuantity(quantity);
        cartItemRepo.save(item);
        return mapToResponse(cartRepo.findById(item.getCart().getId()).get());
    }

    @Transactional
    public CartResponse removeItem(Long cartItemId) {
        CartItem item = cartItemRepo.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepo.delete(item);
        return mapToResponse(cartRepo.save(cart));
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepo.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepo.save(cart);
        });
    }

    private Cart createEmptyCart(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return cartRepo.save(Cart.builder().user(user).build());
    }

    public CartResponse mapToResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(i ->
                CartItemResponse.builder()
                        .id(i.getId())
                        .foodItemId(i.getFoodItem().getId())
                        .foodItemName(i.getFoodItem().getName())
                        .price(i.getFoodItem().getPrice())
                        .quantity(i.getQuantity())
                        .subtotal(i.getSubtotal())
                        .build()
        ).toList();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .totalAmount(cart.getTotalAmount())
                .build();
    }
}