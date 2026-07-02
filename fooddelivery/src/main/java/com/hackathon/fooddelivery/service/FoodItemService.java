package com.hackathon.fooddelivery.service;

import com.hackathon.fooddelivery.model.FoodItem;
import com.hackathon.fooddelivery.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodItemService {

    private final FoodItemRepository foodItemRepo;

    public List<FoodItem> getAllAvailable() {
        return foodItemRepo.findByAvailableTrue();
    }

    public List<FoodItem> search(String keyword) {
        return foodItemRepo.findByNameContainingIgnoreCase(keyword);
    }

    public List<FoodItem> getByCategory(String category) {
        return foodItemRepo.findByCategory(category);
    }

    public List<FoodItem> getByRestaurant(String restaurantName) {
        return foodItemRepo.findByRestaurantName(restaurantName);
    }

    public FoodItem getById(Long id) {
        return foodItemRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Food item not found: " + id));
    }

    public FoodItem save(FoodItem foodItem) {
        return foodItemRepo.save(foodItem);
    }

    public void delete(Long id) {
        foodItemRepo.deleteById(id);
    }
}