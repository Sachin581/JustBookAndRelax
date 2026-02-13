package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.RideRequest;
import com.justbookandrelax.backend.dto.RideResponse;
import com.justbookandrelax.backend.dto.RideDetailsResponseDTO;
import com.justbookandrelax.backend.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

        private final RideService rideService;

        @PostMapping
        public ResponseEntity<RideResponse> createRide(@RequestBody RideRequest request,
                        @AuthenticationPrincipal UserDetails userDetails) {
                return ResponseEntity.ok(rideService.createRide(request, userDetails.getUsername()));
        }

        @GetMapping("/my-offers")
        public ResponseEntity<List<RideResponse>> getMyOfferedRides(@AuthenticationPrincipal UserDetails userDetails) {
                return ResponseEntity.ok(rideService.getMyOfferedRides(userDetails.getUsername()));
        }

        @GetMapping("/search")
        public ResponseEntity<List<RideResponse>> searchRides(
                        @RequestParam(value = "source", required = false) String source,
                        @RequestParam(value = "destination", required = false) String destination) {
                return ResponseEntity.ok(rideService.searchRides(source, destination));
        }

        @GetMapping("/{id}")
        public ResponseEntity<RideDetailsResponseDTO> getRideById(@PathVariable Long id) {
                return ResponseEntity.ok(rideService.getRideById(id));
        }

        @GetMapping
        public ResponseEntity<List<RideResponse>> getAllRides() {
                return ResponseEntity.ok(rideService.getAllRides());
        }
}
