package com.justbookandrelax.backend.repository;

import com.justbookandrelax.backend.entity.Booking;
import com.justbookandrelax.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPassenger(User passenger);
}
