package com.hackathon.fooddelivery.config;

import com.hackathon.fooddelivery.model.FoodItem;
import com.hackathon.fooddelivery.model.User;
import com.hackathon.fooddelivery.repository.FoodItemRepository;
import com.hackathon.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final FoodItemRepository foodRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedFoodItems();
    }

    private void seedUsers() {
        if (userRepo.count() > 0) return;
        userRepo.saveAll(List.of(
                User.builder().name("Pankaj").email("pankaj@test.com")
                        .password(passwordEncoder.encode("pass123"))
                        .phone("9876543210").upiId("pankaj@okicici")
                        .address("VIT-AP, Amaravati").build(),
                User.builder().name("Rahul").email("rahul@test.com")
                        .password(passwordEncoder.encode("pass123"))
                        .phone("9876543211").upiId("rahul@ybl")
                        .address("Pune, Maharashtra").build(),
                User.builder().name("Priya").email("priya@test.com")
                        .password(passwordEncoder.encode("pass123"))
                        .phone("9876543212").upiId("priya@paytm")
                        .address("Bangalore, Karnataka").build()
        ));
    }

    private void seedFoodItems() {
        if (foodRepo.count() > 0) return;
        foodRepo.saveAll(List.of(
                FoodItem.builder().name("Classic Beef Burger")
                        .description("Juicy beef patty with lettuce, tomato & cheese")
                        .price(199.0).category("Burger").restaurantName("Burger Barn").available(true).build(),
                FoodItem.builder().name("Spicy Chicken Burger")
                        .description("Crispy fried chicken with jalapeños")
                        .price(179.0).category("Burger").restaurantName("Burger Barn").available(true).build(),
                FoodItem.builder().name("Veggie Burger")
                        .description("Aloo tikki patty with mint chutney")
                        .price(149.0).category("Burger").restaurantName("Burger Barn").available(true).build(),
                FoodItem.builder().name("Margherita Pizza")
                        .description("Fresh mozzarella, tomato sauce, basil")
                        .price(299.0).category("Pizza").restaurantName("Pizza Palace").available(true).build(),
                FoodItem.builder().name("Paneer Tikka Pizza")
                        .description("Spiced paneer with capsicum and onion")
                        .price(349.0).category("Pizza").restaurantName("Pizza Palace").available(true).build(),
                FoodItem.builder().name("BBQ Chicken Pizza")
                        .description("Smoky BBQ sauce with grilled chicken")
                        .price(379.0).category("Pizza").restaurantName("Pizza Palace").available(true).build(),
                FoodItem.builder().name("Hyderabadi Chicken Biryani")
                        .description("Dum cooked with basmati & whole spices")
                        .price(249.0).category("Biryani").restaurantName("Biryani House").available(true).build(),
                FoodItem.builder().name("Veg Dum Biryani")
                        .description("Seasonal veggies with saffron-infused rice")
                        .price(199.0).category("Biryani").restaurantName("Biryani House").available(true).build(),
                FoodItem.builder().name("Mutton Biryani")
                        .description("Slow-cooked mutton with caramelized onions")
                        .price(329.0).category("Biryani").restaurantName("Biryani House").available(true).build(),
                FoodItem.builder().name("Gulab Jamun (2 pcs)")
                        .description("Soft milk solids in sugar syrup")
                        .price(69.0).category("Dessert").restaurantName("Sweet Corner").available(true).build(),
                FoodItem.builder().name("Chocolate Lava Cake")
                        .description("Warm cake with molten chocolate centre")
                        .price(129.0).category("Dessert").restaurantName("Sweet Corner").available(true).build(),
                FoodItem.builder().name("Mango Lassi")
                        .description("Fresh mango blended with thick curd")
                        .price(79.0).category("Drinks").restaurantName("Burger Barn").available(true).build(),
                FoodItem.builder().name("Cold Coffee")
                        .description("Strong cold brew with milk and ice")
                        .price(89.0).category("Drinks").restaurantName("Pizza Palace").available(true).build()
        ));
        System.out.println("✅ Seed data loaded: " + foodRepo.count() + " food items ready.");
    }
}