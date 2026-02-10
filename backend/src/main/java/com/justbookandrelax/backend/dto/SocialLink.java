package com.justbookandrelax.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SocialLink {
    private String platform;
    private String url;
    private String iconCode; // e.g., "twitter", "facebook"
}
