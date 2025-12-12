package com.bl.mb.repo;

import com.bl.mb.models.Book;
import com.bl.mb.models.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    @Query("SELECT r.book FROM Reservation r WHERE r.user.id = :userId")
    List<Book> findBooksByUserId(UUID userId);
}
