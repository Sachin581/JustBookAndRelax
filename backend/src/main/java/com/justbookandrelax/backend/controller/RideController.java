package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.RideDto;
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
        public ResponseEntity<RideDto> createRide(@RequestBody RideDto request,
                        @AuthenticationPrincipal UserDetails userDetails) {
                return ResponseEntity.ok(rideService.createRide(request, userDetails.getUsername()));
        }

        @GetMapping("/my-offers")
        public ResponseEntity<List<RideDto>> getMyOfferedRides(@AuthenticationPrincipal UserDetails userDetails) {
                return ResponseEntity.ok(rideService.getMyOfferedRides(userDetails.getUsername()));
        }

        @GetMapping("/search")
        public ResponseEntity<List<RideDto>> searchRides(@RequestParam("origin") String origin,
                        @RequestParam("destination") String destination) {
                return ResponseEntity.ok(rideService.searchRides(origin, destination));
        }
}
