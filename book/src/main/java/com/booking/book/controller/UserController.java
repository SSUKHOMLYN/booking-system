package com.booking.book.controller;

import com.booking.book.model.User;
import com.booking.book.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")

public class UserController {

    // Secret key for signing JWT
    private static final String SECRET_KEY = "e797c0013811a1d1e35ad7edd10fb99986db664b0996c76ed9ae5e0a5151bbf9";

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        System.out.println("Login request received: " + loginRequest);
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            System.out.println("User not found for username: " + username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid username or password");
        }

        User user = optionalUser.get();
        System.out.println("User found: " + user);

        if (!user.getPassword().equals(password)) {
            System.out.println("Invalid password for username: " + username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid username or password");
        }
        // Generate JWT token with additional userId claim
        String token = Jwts.builder()
                .setSubject(user.getId().toString()) // Use user ID as subject
                .claim("role", user.getRole()) // Example role
                .claim("username", user.getUsername()) // Include username
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1-hour expiration
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // Use the same secret key
                .compact();

        // Return the token and user details
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

}
