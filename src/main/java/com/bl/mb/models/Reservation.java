package com.bl.mb.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservations", schema = "library")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // FK to Book
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private LocalDate reservedOn;   // when the reservation was made

    private boolean fulfilled;      // true if the book has been picked up

}
