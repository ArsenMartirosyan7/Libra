package com.bl.mb.service;

import com.bl.mb.dto.BookDto;

import java.util.List;
import java.util.UUID;

public interface BookService {

    List<BookDto> getAllBooks();

    BookDto getById(UUID id);

    BookDto createBook(BookDto dto);

    BookDto updateBook(UUID id, BookDto dto);

    void deleteBook(UUID id);
}
