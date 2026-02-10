package com.justbookandrelax.backend.controller;

import com.justbookandrelax.backend.dto.RouteDto;
import com.justbookandrelax.backend.entity.Route;
import com.justbookandrelax.backend.repository.RouteRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteRepository routeRepository;

    @GetMapping
    public ResponseEntity<List<RouteDto>> getAllRoutes() {
        // Return all routes (can filter active for users in frontend service or
        // separate endpoint)
        List<Route> routes = routeRepository.findAll();
        return ResponseEntity.ok(routes.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<RouteDto>> getActiveRoutes() {
        List<Route> routes = routeRepository.findByActiveTrue();
        return ResponseEntity.ok(routes.stream().map(this::mapToDto).collect(Collectors.toList()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteDto> createRoute(@Valid @RequestBody RouteDto routeDto) {
        Route route = Route.builder()
                .fromCity(routeDto.getFromCity())
                .toCity(routeDto.getToCity())
                .active(true)
                .build();
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.ok(mapToDto(savedRoute));
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteDto> toggleRoute(@PathVariable Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        route.setActive(!route.isActive());
        Route savedRoute = routeRepository.save(route);
        return ResponseEntity.ok(mapToDto(savedRoute));
    }

    private RouteDto mapToDto(Route route) {
        return RouteDto.builder()
                .id(route.getId())
                .fromCity(route.getFromCity())
                .toCity(route.getToCity())
                .active(route.isActive())
                .build();
    }
}
