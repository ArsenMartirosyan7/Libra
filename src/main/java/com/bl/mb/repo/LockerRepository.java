package com.bl.mb.repo;

import com.bl.mb.models.Locker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LockerRepository extends JpaRepository<Locker, UUID> {

    Optional<Locker> findByLockerNumber(String lockerNumber);

    Optional<Locker> findByUserId(UUID userId);
}
