package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.dto.PointDto;
import com.justbookandrelax.backend.dto.RideRequest;
import com.justbookandrelax.backend.dto.RideResponse;
import com.justbookandrelax.backend.dto.RideDetailsResponseDTO;
import com.justbookandrelax.backend.entity.DropPoint;
import com.justbookandrelax.backend.entity.PickupPoint;
import com.justbookandrelax.backend.entity.Ride;
import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.exception.ResourceNotFoundException;
import com.justbookandrelax.backend.repository.RideRepository;
import com.justbookandrelax.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class RideService {

        private final RideRepository rideRepository;
        private final UserRepository userRepository;

        @Transactional
        public RideResponse createRide(RideRequest request, String userEmail) {
                log.info("Creating ride for user: {}", userEmail);
                log.info("Request payload: {}", request);

                User driver = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Ride ride = new Ride();
                ride.setSource(request.getSource());
                ride.setDestination(request.getDestination());
                ride.setDateTime(request.getDateTime());
                ride.setPricePerSeat(request.getPricePerSeat());
                ride.setTotalSeats(request.getTotalSeats());
                ride.setAvailableSeats(request.getTotalSeats());
                ride.setDriver(driver);

                // Map Pickup Points - Explicit Logic
                if (request.getPickupPoints() != null) {
                        log.info("Processing {} pickup points", request.getPickupPoints().size());
                        java.util.Set<PickupPoint> pickups = request.getPickupPoints().stream().map(p -> {
                                PickupPoint pickup = new PickupPoint();
                                pickup.setLocationName(p.getLocationName());
                                pickup.setAddress(p.getAddress());
                                pickup.setTime(p.getTime());
                                pickup.setRide(ride); // IMPORTANT: Set the ride
                                return pickup;
                        }).collect(Collectors.toSet());
                        ride.setPickupPoints(pickups);
                } else {
                        log.info("No pickup points in request");
                }

                // Map Drop Points - Explicit Logic
                if (request.getDropPoints() != null) {
                        log.info("Processing {} drop points", request.getDropPoints().size());
                        java.util.Set<DropPoint> drops = request.getDropPoints().stream().map(d -> {
                                DropPoint drop = new DropPoint();
                                drop.setLocationName(d.getLocationName());
                                drop.setAddress(d.getAddress());
                                drop.setTime(d.getTime());
                                drop.setRide(ride); // IMPORTANT: Set the ride
                                return drop;
                        }).collect(Collectors.toSet());
                        ride.setDropPoints(drops);
                } else {
                        log.info("No drop points in request");
                }

                Ride savedRide = rideRepository.save(ride);
                log.info("Ride saved with ID: {}", savedRide.getId());
                log.info("Saved Pickup points: {}", savedRide.getPickupPoints().size());
                log.info("Saved Drop points: {}", savedRide.getDropPoints().size());

                return mapToResponse(savedRide);
        }

        @Transactional(readOnly = true)
        public List<RideResponse> getMyOfferedRides(String userEmail) {
                User driver = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<Ride> rides = rideRepository.findByDriver(driver);
                return rides.stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<RideResponse> searchRides(String source, String destination) {
                if (source == null)
                        source = "";
                if (destination == null)
                        destination = "";

                List<Ride> rides = rideRepository.findBySourceContainingAndDestinationContaining(source, destination);
                return rides.stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public RideDetailsResponseDTO getRideById(Long id) {
                // Use eager fetch query to avoid LazyInitializationException and ensure points
                // are loaded
                Ride ride = rideRepository.findByIdWithDetails(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));
                return mapToDetailsResponse(ride);
        }

        private RideDetailsResponseDTO mapToDetailsResponse(Ride ride) {
                List<PointDto> pickups = ride.getPickupPoints() == null ? Collections.emptyList()
                                : ride.getPickupPoints().stream().map(this::mapPickupToDto)
                                                .collect(Collectors.toList());

                List<PointDto> drops = ride.getDropPoints() == null ? Collections.emptyList()
                                : ride.getDropPoints().stream().map(this::mapDropToDto).collect(Collectors.toList());

                return RideDetailsResponseDTO.builder()
                                .id(ride.getId())
                                .source(ride.getSource())
                                .destination(ride.getDestination())
                                .dateTime(ride.getDateTime())
                                .pricePerSeat(ride.getPricePerSeat())
                                .totalSeats(ride.getTotalSeats())
                                .availableSeats(ride.getAvailableSeats())
                                .driverName(ride.getDriver().getName())
                                .pickupPoints(pickups)
                                .dropPoints(drops)
                                .build();
        }

        @Transactional(readOnly = true)
        public List<RideResponse> getAllRides() {
                return rideRepository.findAll().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private RideResponse mapToResponse(Ride ride) {
                List<PointDto> pickups = ride.getPickupPoints() == null ? Collections.emptyList()
                                : ride.getPickupPoints().stream().map(this::mapPickupToDto)
                                                .collect(Collectors.toList());

                List<PointDto> drops = ride.getDropPoints() == null ? Collections.emptyList()
                                : ride.getDropPoints().stream().map(this::mapDropToDto).collect(Collectors.toList());

                return RideResponse.builder()
                                .id(ride.getId())
                                .source(ride.getSource())
                                .destination(ride.getDestination())
                                .dateTime(ride.getDateTime())
                                .pricePerSeat(ride.getPricePerSeat())
                                .totalSeats(ride.getTotalSeats())
                                .availableSeats(ride.getAvailableSeats())
                                .driverName(ride.getDriver().getName())
                                .pickupPoints(pickups)
                                .dropPoints(drops)
                                .build();
        }

        private PointDto mapPickupToDto(PickupPoint p) {
                return PointDto.builder()
                                .id(p.getId())
                                .locationName(p.getLocationName())
                                .address(p.getAddress())
                                .time(p.getTime())
                                .build();
        }

        private PointDto mapDropToDto(DropPoint d) {
                return PointDto.builder()
                                .id(d.getId())
                                .locationName(d.getLocationName())
                                .address(d.getAddress())
                                .time(d.getTime())
                                .build();
        }
}
