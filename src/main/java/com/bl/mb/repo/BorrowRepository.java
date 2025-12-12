package com.bl.mb.repo;

import com.bl.mb.models.Borrow;
import com.bl.mb.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    // Active borrows for a book
    List<Borrow> findByBookAndReturnedOnIsNull(Book book);

    // All borrows for a user
    List<Borrow> findByUserId(UUID userId);

    // Only active borrows for a user
    List<Borrow> findByUserIdAndReturnedOnIsNull(UUID userId);
}
