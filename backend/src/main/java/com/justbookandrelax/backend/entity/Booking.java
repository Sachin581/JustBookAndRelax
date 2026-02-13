package com.justbookandrelax.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @ManyToOne
    @JoinColumn(name = "pickup_point_id")
    private PickupPoint pickupPoint;

    @ManyToOne
    @JoinColumn(name = "drop_point_id")
    private DropPoint dropPoint;

    private LocalDateTime bookingTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}
