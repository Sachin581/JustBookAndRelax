package com.justbookandrelax.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RideDetailsResponseDTO {
    private Long id;
    private String source;
    private String destination;
    private LocalDateTime dateTime;
    private Double pricePerSeat;
    private Integer totalSeats;
    private Integer availableSeats;
    private String driverName;
    private List<PointDto> pickupPoints;
    private List<PointDto> dropPoints;
}
