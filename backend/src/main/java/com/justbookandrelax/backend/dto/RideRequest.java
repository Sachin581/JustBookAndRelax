package com.justbookandrelax.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RideRequest {
    private String source;
    private String destination;
    private LocalDateTime dateTime;
    private Double pricePerSeat;
    private Integer totalSeats;
    private java.util.List<PointDto> pickupPoints;
    private java.util.List<PointDto> dropPoints;
}
