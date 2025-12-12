package com.bl.mb.controller;

import com.bl.mb.service.AdminService;
import com.bl.mb.dto.*;
import com.bl.mb.models.Book;
import com.bl.mb.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")

public class AdminController {

    private final AdminService adminService;

    // --- BOOK MANAGEMENT ---
    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        return adminService.addBook(book);
    }

    @PutMapping("/books/{id}")
    public Book updateBook(@PathVariable UUID id, @RequestBody Book book) {
        return adminService.updateBook(id, book);
    }

    @DeleteMapping("/books/{id}")
    public void deleteBook(@PathVariable UUID id) {
        adminService.deleteBook(id);
    }

    @GetMapping("/books/{id}/availability")
    public boolean checkAvailability(@PathVariable UUID id) {
        return adminService.checkBookAvailability(id);
    }

    // --- USERS ---
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    // --- BORROW / RETURN ---
    @PostMapping("/borrow/{bookId}/user/{userId}")
    public String borrowBook(@PathVariable UUID bookId, @PathVariable UUID userId) {
        return adminService.borrowBook(bookId, userId);
    }

    @PostMapping("/return/{bookId}/user/{userId}")
    public String returnBook(@PathVariable UUID bookId, @PathVariable UUID userId) {
        return adminService.returnBook(bookId, userId);
    }

    // --- RESERVATIONS ---
    @PostMapping("/reservations/{resId}/approve")
    public String approveReservation(@PathVariable UUID resId) {
        return adminService.approveReservation(resId);
    }

    // --- LATE FEES ---
    @GetMapping("/late-fees")
    public double calculateLateFees() {
        return adminService.calculateLateFees();
    }

    // --- BORROW HISTORY ---
    @GetMapping("/borrow-history")
    public List<BorrowDTO> borrowHistory() {
        return adminService.getBorrowHistory();
    }

}
