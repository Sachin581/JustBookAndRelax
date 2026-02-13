package com.justbookandrelax.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@lombok.Getter
@lombok.Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pickup_points")
public class PickupPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String locationName;
    private String address;
    private LocalDateTime time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Ride ride;
}
