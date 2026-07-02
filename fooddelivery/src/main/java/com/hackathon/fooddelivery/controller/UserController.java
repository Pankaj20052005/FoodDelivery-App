package com.hackathon.fooddelivery.controller;

import com.hackathon.fooddelivery.model.User;
import com.hackathon.fooddelivery.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User created = userService.register(user);
        created.setPassword("[HIDDEN]");
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.getById(id);
        user.setPassword("[HIDDEN]");
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/upi")
    public ResponseEntity<User> updateUpi(
            @PathVariable Long id,
            @RequestParam String upiId) {
        User user = userService.updateUpiId(id, upiId);
        user.setPassword("[HIDDEN]");
        return ResponseEntity.ok(user);
    }
}