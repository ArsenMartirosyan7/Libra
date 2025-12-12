package com.bl.mb.controller;

import com.bl.mb.models.User;
import com.bl.mb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    // Existing endpoints
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/borrowed-books")
    public ResponseEntity<?> getBorrowedBooks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getBorrowedBooks(user.getId()));
    }

    @GetMapping("/reserved-books")
    public ResponseEntity<?> getReservedBooks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getReservedBooks(user.getId()));
    }

    // NEW: get all users
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}

