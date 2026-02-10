package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Map<String, Object> getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "joinedAt", "2024-01-01" // Placeholder date
        );
    }
}
