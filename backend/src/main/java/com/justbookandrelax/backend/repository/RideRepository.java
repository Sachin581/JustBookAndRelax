package com.justbookandrelax.backend.repository;

import com.justbookandrelax.backend.entity.Ride;
import com.justbookandrelax.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriver(User driver);

    List<Ride> findByOriginContainingAndDestinationContaining(String origin, String destination);
}
