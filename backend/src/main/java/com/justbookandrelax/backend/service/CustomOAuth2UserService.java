package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.entity.Role;
import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update name?
            // user.setName(name);
            // userRepository.save(user);
        } else {
            user = User.builder()
                    .email(email)
                    .name(name)
                    .password(UUID.randomUUID().toString()) // Random dummy password
                    .role(Role.USER) // Default role
                    .build();
            userRepository.save(user);
        }

        return oauth2User;
    }
}
