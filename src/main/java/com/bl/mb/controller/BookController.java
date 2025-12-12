package com.bl.mb.controller;

import com.bl.mb.dto.BookDto;
import com.bl.mb.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    // PUBLIC
    @GetMapping
    public List<BookDto> getAll() {
        return bookService.getAllBooks();
    }

    // PUBLIC
    @GetMapping("/{id}")
    public BookDto getById(@PathVariable UUID id) {
        return bookService.getById(id);
    }

    // ADMIN ONLY
    @PostMapping
    public BookDto create(@RequestBody BookDto dto) {
        return bookService.createBook(dto);
    }

    // ADMIN ONLY
    @PutMapping("/{id}")
    public BookDto update(
            @PathVariable UUID id,
            @RequestBody BookDto dto
    ) {
        return bookService.updateBook(id, dto);
    }

    // ADMIN ONLY
    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        bookService.deleteBook(id);
    }
}
