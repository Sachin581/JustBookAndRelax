package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.RouteDto;
import com.justbookandrelax.backend.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ResponseEntity<List<RouteDto>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/active")
    public ResponseEntity<List<RouteDto>> getActiveRoutes() {
        return ResponseEntity.ok(routeService.getActiveRoutes());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteDto> createRoute(@Valid @RequestBody RouteDto routeDto) {
        return ResponseEntity.ok(routeService.createRoute(routeDto));
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteDto> toggleRoute(@PathVariable("id") Long id) {
        return ResponseEntity.ok(routeService.toggleRoute(id));
    }
}
