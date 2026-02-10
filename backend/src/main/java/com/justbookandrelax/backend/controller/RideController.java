package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.RideDto;
import com.justbookandrelax.backend.entity.Ride;
import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.repository.RideRepository;
import com.justbookandrelax.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime; // Import LocalDateTime
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

        private final RideRepository rideRepository;
        private final UserRepository userRepository;
        private final com.justbookandrelax.backend.repository.RouteRepository routeRepository;

        @PostMapping
        public ResponseEntity<RideDto> createRide(@RequestBody RideDto request,
                        @AuthenticationPrincipal UserDetails userDetails) {
                User driver = userRepository.findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Validate Route
                boolean routeExists = routeRepository.findAll().stream()
                                .anyMatch(r -> r.getFromCity().equalsIgnoreCase(request.getOrigin()) &&
                                                r.getToCity().equalsIgnoreCase(request.getDestination()) &&
                                                r.isActive());

                if (!routeExists) {
                        throw new RuntimeException(
                                        "Invalid route. You can only offer rides on active routes defined by Admin.");
                }

                Ride ride = Ride.builder()
                                .origin(request.getOrigin())
                                .destination(request.getDestination())
                                .departureTime(request.getDepartureTime())
                                .price(request.getPrice())
                                .seats(request.getSeats())
                                .driver(driver)
                                .build();

                rideRepository.save(ride);

                return ResponseEntity.ok(RideDto.builder()
                                .id(ride.getId())
                                .origin(ride.getOrigin())
                                .destination(ride.getDestination())
                                .departureTime(ride.getDepartureTime())
                                .price(ride.getPrice())
                                .seats(ride.getSeats())
                                .driverName(driver.getName())
                                .build());
        }

        @GetMapping("/my-offers")
        public ResponseEntity<List<RideDto>> getMyOfferedRides(@AuthenticationPrincipal UserDetails userDetails) {
                User driver = userRepository.findByEmail(userDetails.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Ride> rides = rideRepository.findByDriver(driver);

                return ResponseEntity.ok(rides.stream().map(ride -> RideDto.builder()
                                .id(ride.getId())
                                .origin(ride.getOrigin())
                                .destination(ride.getDestination())
                                .departureTime(ride.getDepartureTime())
                                .price(ride.getPrice())
                                .seats(ride.getSeats())
                                .driverName(driver.getName())
                                .build()).collect(Collectors.toList()));
        }

        @GetMapping("/search")
        public ResponseEntity<List<RideDto>> searchRides(@RequestParam String origin,
                        @RequestParam String destination) {
                List<Ride> rides = rideRepository.findByOriginContainingAndDestinationContaining(origin, destination);

                return ResponseEntity.ok(rides.stream().map(ride -> RideDto.builder()
                                .id(ride.getId())
                                .origin(ride.getOrigin())
                                .destination(ride.getDestination())
                                .departureTime(ride.getDepartureTime())
                                .price(ride.getPrice())
                                .seats(ride.getSeats())
                                .driverName(ride.getDriver().getName())
                                .build()).collect(Collectors.toList()));
        }
}
