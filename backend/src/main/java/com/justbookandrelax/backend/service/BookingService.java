package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.dto.BookingRequest;
import com.justbookandrelax.backend.dto.BookingResponse;
import com.justbookandrelax.backend.dto.PointDto;
import com.justbookandrelax.backend.entity.*;
import com.justbookandrelax.backend.exception.ResourceNotFoundException;
import com.justbookandrelax.backend.repository.BookingRepository;
import com.justbookandrelax.backend.repository.DropPointRepository;
import com.justbookandrelax.backend.repository.PickupPointRepository;
import com.justbookandrelax.backend.repository.RideRepository;
import com.justbookandrelax.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final PickupPointRepository pickupPointRepository;
    private final DropPointRepository dropPointRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found"));

        // Validate Points
        PickupPoint pickup = pickupPointRepository.findById(request.getPickupPointId())
                .orElseThrow(() -> new ResourceNotFoundException("Pickup point not found"));
        DropPoint drop = dropPointRepository.findById(request.getDropPointId())
                .orElseThrow(() -> new ResourceNotFoundException("Drop point not found"));

        if (!pickup.getRide().getId().equals(ride.getId()) || !drop.getRide().getId().equals(ride.getId())) {
            throw new RuntimeException("Selected points do not belong to this ride");
        }

        if (ride.getAvailableSeats() < request.getSeats()) {
            throw new RuntimeException("Not enough seats available");
        }

        // Decrement available seats
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeats());
        rideRepository.save(ride);

        Booking booking = Booking.builder()
                .ride(ride)
                .passenger(user)
                .pickupPoint(pickup)
                .dropPoint(drop)
                .bookingTime(LocalDateTime.now())
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToResponse(savedBooking);
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Booking> bookings = bookingRepository.findByPassenger(user);
        return bookings.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        PointDto pickupDto = PointDto.builder()
                .id(booking.getPickupPoint().getId())
                .locationName(booking.getPickupPoint().getLocationName())
                .address(booking.getPickupPoint().getAddress())
                .time(booking.getPickupPoint().getTime())
                .build();

        PointDto dropDto = PointDto.builder()
                .id(booking.getDropPoint().getId())
                .locationName(booking.getDropPoint().getLocationName())
                .address(booking.getDropPoint().getAddress())
                .time(booking.getDropPoint().getTime())
                .build();

        return BookingResponse.builder()
                .id(booking.getId())
                .rideId(booking.getRide().getId())
                .passengerName(booking.getPassenger().getName())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .source(booking.getRide().getSource())
                .destination(booking.getRide().getDestination())
                .departureTime(booking.getRide().getDateTime())
                .price(booking.getRide().getPricePerSeat())
                .pickupPoint(pickupDto)
                .dropPoint(dropDto)
                .build();
    }
}
