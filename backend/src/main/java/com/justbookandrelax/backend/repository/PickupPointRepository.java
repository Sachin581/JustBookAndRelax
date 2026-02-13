package com.justbookandrelax.backend.repository;

import com.justbookandrelax.backend.entity.PickupPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupPointRepository extends JpaRepository<PickupPoint, Long> {
}
