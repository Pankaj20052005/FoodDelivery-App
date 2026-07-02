package com.hackathon.fooddelivery.service;

import com.hackathon.fooddelivery.dto.LoginRequest;
import com.hackathon.fooddelivery.dto.LoginResponse;
import com.hackathon.fooddelivery.dto.RegisterRequest;
import com.hackathon.fooddelivery.model.User;
import com.hackathon.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponse(null, "User not found", null);
        }

        boolean matches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!matches) {
            return new LoginResponse(null, "Invalid password", null);
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(token, "Login successful", user.getId());
    }
}