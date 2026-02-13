package com.justbookandrelax.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long rideId;
    private Integer seats;
    private Long pickupPointId;
    private Long dropPointId;
}
