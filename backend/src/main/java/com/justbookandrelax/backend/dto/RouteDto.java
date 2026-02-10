package com.justbookandrelax.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteDto {
    private Long id;

    @NotBlank(message = "From city is required")
    private String fromCity;

    @NotBlank(message = "To city is required")
    private String toCity;

    private boolean active;
}
