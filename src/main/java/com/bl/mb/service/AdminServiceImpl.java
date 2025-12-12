package com.bl.mb.service;

import com.bl.mb.models.Book;
import com.bl.mb.models.User;
import com.bl.mb.repo.BookRepository;
import com.bl.mb.repo.UserRepository;
import com.bl.mb.repo.BorrowRepository;
import com.bl.mb.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.bl.mb.models.Borrow;
import java.time.LocalDate;


import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowRepository borrowRepository;

    // --- BOOK MANAGEMENT ---
    @Override
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(UUID id, Book updated) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(updated.getTitle());
        book.setAuthor(updated.getAuthor());
        book.setCategory(updated.getCategory());
        book.setDescription(updated.getDescription());
        book.setCoverImageUrl(updated.getCoverImageUrl());
        book.setAvailable(updated.isAvailable());

        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(UUID id) {
        bookRepository.deleteById(id);
    }

    @Override
    public boolean checkBookAvailability(UUID id) {
        return bookRepository.findById(id)
                .map(Book::isAvailable)
                .orElse(false);
    }

    // --- USERS ---
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- BORROW / RETURN ---
    @Override
    public String borrowBook(UUID bookId, UUID userId) {

        var book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Boolean.TRUE.equals(book.isAvailable())) {
            return "Book is not available";
        }

        book.setAvailable(false);
        bookRepository.save(book);

        Borrow borrow = Borrow.builder()
                .book(book)
                .user(user)
                .borrowedOn(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(14))
                .build();

        borrowRepository.save(borrow);

        return "Book borrowed successfully";
    }




    @Override
    public String returnBook(UUID bookId, UUID userId) {

        var book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        var borrowList = borrowRepository.findByBookAndReturnedOnIsNull(book);

        if (borrowList.isEmpty()) {
            return "No active borrow record found";
        }

        Borrow borrow = borrowList.get(0);
        borrow.setReturnedOn(LocalDate.now());
        borrowRepository.save(borrow);

        book.setAvailable(true);
        bookRepository.save(book);

        return "Book returned successfully";
    }




    // --- RESERVATIONS ---
    @Override
    public String approveReservation(UUID reservationId) {
        return "Approve reservation logic";
    }

    @Override
    public double calculateLateFees() {
        double feePerDay = 100;

        return borrowRepository.findAll().stream()
                .filter(b -> b.getReturnedOn() != null)
                .mapToDouble(b -> {
                    long daysLate =
                            java.time.temporal.ChronoUnit.DAYS.between(
                                    b.getDueDate(), b.getReturnedOn());

                    return daysLate > 0 ? daysLate * feePerDay : 0;
                })
                .sum();
    }


    @Override
    public List<BorrowDTO> getBorrowHistory() {
        return borrowRepository.findAll().stream()
                .map(b -> new BorrowDTO(
                        b.getId(),
                        b.getUser().getId(),
                        b.getUser().getFullName(),
                        b.getBook().getId(),
                        b.getBook().getTitle(),
                        b.getBorrowedOn(),
                        b.getDueDate(),
                        b.getReturnedOn()
                ))
                .toList();
    }

}
