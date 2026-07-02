package com.hackathon.fooddelivery.repository;

import com.hackathon.fooddelivery.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByCategory(String category);
    List<FoodItem> findByRestaurantName(String restaurantName);
    List<FoodItem> findByAvailableTrue();
    List<FoodItem> findByNameContainingIgnoreCase(String keyword);
}