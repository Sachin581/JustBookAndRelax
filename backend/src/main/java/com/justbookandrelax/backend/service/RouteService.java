package com.justbookandrelax.backend.service;

import com.justbookandrelax.backend.dto.RouteDto;
import com.justbookandrelax.backend.entity.Route;
import com.justbookandrelax.backend.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;

    public List<RouteDto> getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return routes.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<RouteDto> getActiveRoutes() {
        List<Route> routes = routeRepository.findByActiveTrue();
        return routes.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public RouteDto createRoute(RouteDto routeDto) {
        Route route = Route.builder()
                .fromCity(routeDto.getFromCity())
                .toCity(routeDto.getToCity())
                .active(true)
                .build();
        Route savedRoute = routeRepository.save(route);
        return mapToDto(savedRoute);
    }

    @Transactional
    public RouteDto toggleRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
        route.setActive(!route.isActive());
        Route savedRoute = routeRepository.save(route);
        return mapToDto(savedRoute);
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
