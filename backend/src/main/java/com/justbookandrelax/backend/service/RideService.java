package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.dto.RideDto;
import com.justbookandrelax.backend.entity.Ride;
import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.repository.RideRepository;
import com.justbookandrelax.backend.repository.RouteRepository;
import com.justbookandrelax.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final RouteRepository routeRepository;

    @Transactional
    public RideDto createRide(RideDto request, String userEmail) {
        User driver = userRepository.findByEmail(userEmail)
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

        Ride savedRide = rideRepository.save(ride);
        return mapToDto(savedRide);
    }

    public List<RideDto> getMyOfferedRides(String userEmail) {
        User driver = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Ride> rides = rideRepository.findByDriver(driver);
        return rides.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<RideDto> searchRides(String origin, String destination) {
        List<Ride> rides = rideRepository.findByOriginContainingAndDestinationContaining(origin, destination);
        return rides.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private RideDto mapToDto(Ride ride) {
        return RideDto.builder()
                .id(ride.getId())
                .origin(ride.getOrigin())
                .destination(ride.getDestination())
                .departureTime(ride.getDepartureTime())
                .price(ride.getPrice())
                .seats(ride.getSeats())
                .driverName(ride.getDriver().getName())
                .build();
    }
}
