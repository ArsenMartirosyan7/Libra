package com.bl.mb.service;

import com.bl.mb.models.User;
import com.bl.mb.repo.UserRepository;
import com.bl.mb.models.Book;
import com.bl.mb.repo.BorrowRepository;
import com.bl.mb.service.UserService;
import com.bl.mb.repo.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BorrowRepository borrowRepo;
    private final ReservationRepository reservationRepo;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID " + id));
    }

    @Override
    public User updateUser(UUID id, User updatedUser) {
        User existing = getUserById(id);

        existing.setFullName(updatedUser.getFullName());
        existing.setEmail(updatedUser.getEmail());
        existing.setRoles(updatedUser.getRoles());

        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with ID " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<Book> getBorrowedBooks(UUID userId) {
        return reservationRepo.findBooksByUserId(userId);
    }

    @Override
    public List<Book> getReservedBooks(UUID userId) {
        return reservationRepo.findBooksByUserId(userId);
    }
}
