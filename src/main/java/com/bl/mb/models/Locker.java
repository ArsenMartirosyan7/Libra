package com.bl.mb.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "lockers", schema = "library")
public class Locker {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(name = "locker_number", nullable = false, unique = true)
    private String lockerNumber;

    @Column(name = "is_available")
    private boolean available;

    // ✅ ADD THIS
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
