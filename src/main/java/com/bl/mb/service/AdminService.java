package com.bl.mb.service;

import com.bl.mb.models.Book;
import com.bl.mb.models.User;
import com.bl.mb.dto.BorrowDTO;

import java.util.List;
import java.util.UUID;

public interface AdminService {

    Book addBook(Book book);

    Book updateBook(UUID id, Book book);

    void deleteBook(UUID id);

    boolean checkBookAvailability(UUID id);

    List<User> getAllUsers();

    String borrowBook(UUID bookId, UUID userId);

    String returnBook(UUID bookId, UUID userId);

    String approveReservation(UUID reservationId);

    double calculateLateFees();

    List<BorrowDTO> getBorrowHistory();
}
