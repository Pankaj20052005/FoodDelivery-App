package com.hackathon.fooddelivery.controller;

import com.hackathon.fooddelivery.model.FoodItem;
import com.hackathon.fooddelivery.service.FoodItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/food")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FoodItemController {

    private final FoodItemService foodItemService;

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAll() {
        return ResponseEntity.ok(foodItemService.getAllAvailable());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(foodItemService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<FoodItem>> search(@RequestParam String q) {
        return ResponseEntity.ok(foodItemService.search(q));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FoodItem>> byCategory(@PathVariable String category) {
        return ResponseEntity.ok(foodItemService.getByCategory(category));
    }

    @GetMapping("/restaurant/{name}")
    public ResponseEntity<List<FoodItem>> byRestaurant(@PathVariable String name) {
        return ResponseEntity.ok(foodItemService.getByRestaurant(name));
    }

    @PostMapping
    public ResponseEntity<FoodItem> create(@RequestBody FoodItem foodItem) {
        return ResponseEntity.ok(foodItemService.save(foodItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FoodItem> update(
            @PathVariable Long id,
            @RequestBody FoodItem foodItem) {
        foodItem.setId(id);
        return ResponseEntity.ok(foodItemService.save(foodItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        foodItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}