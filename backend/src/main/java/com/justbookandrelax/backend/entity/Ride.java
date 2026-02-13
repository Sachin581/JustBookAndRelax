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
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;
    private LocalDateTime dateTime;
    private Double pricePerSeat;
    private Integer totalSeats;
    private Integer availableSeats;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private java.util.Set<PickupPoint> pickupPoints = new java.util.HashSet<>();

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private java.util.Set<DropPoint> dropPoints = new java.util.HashSet<>();
}
