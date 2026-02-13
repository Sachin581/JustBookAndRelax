package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.BookingRequest;
import com.justbookandrelax.backend.dto.BookingResponse;
import com.justbookandrelax.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

        private final BookingService bookingService;

        @PostMapping
        public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request,
                        @AuthenticationPrincipal UserDetails userDetails) {
                return ResponseEntity.ok(bookingService.createBooking(request, userDetails.getUsername()));
        }

        @GetMapping("/me")
        public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
                return ResponseEntity.ok(bookingService.getMyBookings(userDetails.getUsername()));
        }
}
