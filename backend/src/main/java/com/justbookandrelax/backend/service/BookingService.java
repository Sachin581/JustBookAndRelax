package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.dto.BookingDto;
import com.justbookandrelax.backend.entity.Booking;
import com.justbookandrelax.backend.entity.BookingStatus;
import com.justbookandrelax.backend.entity.Ride;
import com.justbookandrelax.backend.entity.User;
import com.justbookandrelax.backend.repository.BookingRepository;
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

    @Transactional
    public BookingDto createBooking(Long rideId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getSeats() <= 0) {
            throw new RuntimeException("Ride is full");
        }

        // Decrement seats
        ride.setSeats(ride.getSeats() - 1);
        rideRepository.save(ride);

        Booking booking = Booking.builder()
                .ride(ride)
                .passenger(user)
                .bookingTime(LocalDateTime.now())
                .status(BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDto(savedBooking);
    }

    public List<BookingDto> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> bookings = bookingRepository.findByPassenger(user);
        return bookings.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private BookingDto mapToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .rideId(booking.getRide().getId())
                .passengerName(booking.getPassenger().getName())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus())
                .fromCity(booking.getRide().getOrigin())
                .toCity(booking.getRide().getDestination())
                .departureTime(booking.getRide().getDepartureTime())
                .price(booking.getRide().getPrice())
                .build();
    }
}
