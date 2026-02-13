package com.justbookandrelax.backend.dto;

import com.justbookandrelax.backend.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long rideId;
    private String passengerName;
    private LocalDateTime bookingTime;
    private BookingStatus status;
    private String source;
    private String destination;
    private LocalDateTime departureTime;
    private Double price;
    private PointDto pickupPoint;
    private PointDto dropPoint;
}
