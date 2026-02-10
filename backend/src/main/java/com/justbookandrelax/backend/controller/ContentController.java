package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.Quote;
import com.justbookandrelax.backend.dto.SocialLink;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    @GetMapping("/quotes")
    public ResponseEntity<List<Quote>> getQuotes() {
        return ResponseEntity.ok(List.of(
                new Quote("The best ride I've ever had. Smooth and timely!", "Alice Johnson", "Frequent Traveler"),
                new Quote("JustBookAndRelax makes my daily commute a breeze.", "Mark Smith", "Daily Commuter"),
                new Quote("Excellent service and friendly drivers. Highly recommended!", "Sarah Williams",
                        "Business Traveler"),
                new Quote("I love the ease of booking. It's just perfect.", "David Brown", "Tourist"),
                new Quote("Reliable and safe. I trust them with my kids.", "Emily Davis", "Parent")));
    }

    @GetMapping("/social-links")
    public ResponseEntity<List<SocialLink>> getSocialLinks() {
        return ResponseEntity.ok(List.of(
                new SocialLink("Facebook", "https://facebook.com", "facebook"),
                new SocialLink("Twitter", "https://twitter.com", "twitter"),
                new SocialLink("Instagram", "https://instagram.com", "instagram"),
                new SocialLink("LinkedIn", "https://linkedin.com", "linkedin"),
                new SocialLink("GitHub", "https://github.com", "github")));
    }
}
