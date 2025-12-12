package com.bl.mb.service;

import com.bl.mb.dto.*;
import com.bl.mb.jwt.JwtService;
import com.bl.mb.models.Role;
import com.bl.mb.models.User;
import com.bl.mb.repo.RoleRepository;
import com.bl.mb.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Fetch the default role; make sure it exists in the DB
        Role defaultRole = roleRepo.findByName("USER") // or "STUDENT"
                .orElseThrow(() -> new RuntimeException("Role missing in database"));

        // Create new user entity
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(encoder.encode(request.getPassword()))
                .roles(List.of(defaultRole))
                .build();

        // Save user to DB
        userRepo.save(user);

        // Build and return auth response
        return AuthResponse.builder()
                .accessToken(jwt.generateToken(user.getEmail()))
                .refreshToken(jwt.generateRefreshToken(user.getEmail()))
                .user(UserResponse.builder()
                        .id(user.getId().toString())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .build())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Fetch user by email or username
        User user = userRepo.findByEmail(request.getEmailOrUsername())
                .or(() -> userRepo.findByUsername(request.getEmailOrUsername()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check password
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Return tokens and user info
        return AuthResponse.builder()
                .accessToken(jwt.generateToken(user.getEmail()))
                .refreshToken(jwt.generateRefreshToken(user.getEmail()))
                .user(UserResponse.builder()
                        .id(user.getId().toString())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .build())
                .build();
    }
}
