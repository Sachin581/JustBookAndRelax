package com.justbookandrelax.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class RideResponse {
    private Long id;
    private String source;
    private String destination;
    private LocalDateTime dateTime;
    private Double pricePerSeat;
    private Integer totalSeats;
    private Integer availableSeats;
    private String driverName;
    private java.util.List<PointDto> pickupPoints;
    private java.util.List<PointDto> dropPoints;
}
