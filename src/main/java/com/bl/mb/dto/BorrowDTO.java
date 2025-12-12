package com.bl.mb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class BorrowDTO {
    private UUID borrowId;
    private UUID userId;
    private String userFullName;
    private UUID bookId;
    private String bookTitle;
    private LocalDate borrowedOn;
    private LocalDate dueDate;
    private LocalDate returnedOn;
}
