package com.bl.mb.service;

import com.bl.mb.models.User;
import com.bl.mb.models.Book;
import java.util.List;
import java.util.UUID;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(UUID id);
    User updateUser(UUID id, User updatedUser);
    void deleteUser(UUID id);
    List<Book> getBorrowedBooks(UUID userId);
    List<Book> getReservedBooks(UUID userId);
}
