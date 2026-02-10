package com.justbookandrelax.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RideDto {
    private Long id;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    @Min(value = 0, message = "Price must be positive")
    @Max(value = 1000, message = "Price cannot exceed ₹1000")
    private Double price;
    private Integer seats;
    private String driverName;
}
