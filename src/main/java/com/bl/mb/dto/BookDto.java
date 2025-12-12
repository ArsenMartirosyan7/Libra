package com.bl.mb.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookDto {
    private UUID id;
    private String title;
    private String author;
    private String description;
    private String category;
    private Boolean available;
    private LocalDate publishedDate;
    private String coverImageUrl;
}
