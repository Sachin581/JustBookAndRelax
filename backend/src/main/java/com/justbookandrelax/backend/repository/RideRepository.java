package com.justbookandrelax.backend.repository;

import com.justbookandrelax.backend.entity.Ride;
import com.justbookandrelax.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriver(User driver);

    List<Ride> findBySourceContainingAndDestinationContaining(String source, String destination);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Ride r LEFT JOIN FETCH r.pickupPoints LEFT JOIN FETCH r.dropPoints WHERE r.id = :id")
    java.util.Optional<Ride> findByIdWithDetails(@org.springframework.data.repository.query.Param("id") Long id);
}
