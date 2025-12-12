package com.bl.mb.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "borrows", schema = "library")
public class Borrow {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    @Column(name = "borrow_id", nullable = false, updatable = false)
    private UUID id;

    // FK to User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // FK to Book
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "borrowed_on", nullable = false)
    private LocalDate borrowedOn;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;        // return deadline

    @Column(name = "returned_on")
    private LocalDate returnedOn;     // null = still borrowed

    // Optional helper method
    public boolean isReturned() {
        return returnedOn != null;
    }
}
