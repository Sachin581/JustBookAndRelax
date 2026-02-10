package com.justbookandrelax.backend.dto;

import com.justbookandrelax.backend.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDto {
    private Long id;
    private Long rideId;
    private String passengerName;
    private LocalDateTime bookingTime;
    private BookingStatus status;

    // Additional info for UI
    private String fromCity;
    private String toCity;
    private LocalDateTime departureTime;
    private Double price;
}
