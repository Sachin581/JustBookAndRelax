package com.justbookandrelax.backend.config;

import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        User user = userRepository.findByEmail(email).orElseThrow();

        String token = jwtUtil.generateToken(user);
        String name = user.getName();
        String role = user.getRole().name();

        // Redirect to frontend with token
        // In production, this should be an environment variable
        String targetUrl = "http://localhost:5173/oauth2/redirect?token=" + token + "&name=" + name + "&role=" + role
                + "&email=" + email;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
