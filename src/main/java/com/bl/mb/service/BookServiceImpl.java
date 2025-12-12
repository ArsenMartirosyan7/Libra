package com.bl.mb.service;

import com.bl.mb.dto.BookDto;
import com.bl.mb.models.Book;
import com.bl.mb.repo.BookRepository;
import com.bl.mb.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    private BookDto mapToDto(Book book) {
        return BookDto.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .category(book.getCategory())
                .available(book.isAvailable())
                .publishedDate(book.getPublishedDate())
                .coverImageUrl(book.getCoverImageUrl())
                .build();
    }

    private Book mapToEntity(BookDto dto) {
        return Book.builder()
                .title(dto.getTitle())
                .author(dto.getAuthor())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .available(dto.getAvailable())
                .publishedDate(dto.getPublishedDate())
                .coverImageUrl(dto.getCoverImageUrl())
                .build();
    }

    @Override
    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream().map(this::mapToDto).toList();
    }

    @Override
    public BookDto getById(UUID id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return mapToDto(book);
    }

    @Override
    public BookDto createBook(BookDto dto) {
        Book book = mapToEntity(dto);
        book.setCreatedOn(Timestamp.from(Instant.now()));
        book.setUpdatedOn(Timestamp.from(Instant.now()));
        return mapToDto(bookRepository.save(book));
    }

    @Override
    public BookDto updateBook(UUID id, BookDto dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setDescription(dto.getDescription());
        book.setCategory(dto.getCategory());
        book.setAvailable(dto.getAvailable());
        book.setPublishedDate(dto.getPublishedDate());
        book.setCoverImageUrl(dto.getCoverImageUrl());
        book.setUpdatedOn(Timestamp.from(Instant.now()));

        return mapToDto(bookRepository.save(book));
    }

    @Override
    public void deleteBook(UUID id) {
        bookRepository.deleteById(id);
    }
}
