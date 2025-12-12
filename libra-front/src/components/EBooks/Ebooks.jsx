// Ebooks.jsx
import { useEffect, useState } from "react";
import styles from "./Ebooks.module.scss";

const Ebooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);

    const fetchBooks = async (pageNum = 1, search = "") => {
        setLoading(true);
        const res = await fetch(
            `https://gutendex.com/books/?page=${pageNum}&search=${search}`
        );
        const data = await res.json();
        setBooks(data.results);
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks(page, query);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBooks(1, query);
    };

    return (
        <div className={styles.ebooksPage}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h2 className={styles.title}>E-Books Collection</h2>
                    <p className={styles.subtitle}>Browse thousands of free public-domain digital books</p>

                    {/* Search Form */}
                    <form className={styles.searchForm} onSubmit={handleSearch}>
                        <div className={styles.searchWrapper}>
                            <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by title, author, or subject..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                            <button type="submit" className={styles.searchBtn}>
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p className={styles.loadingText}>Loading eBooks...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className={styles.emptyState}>
                        <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
                        </svg>
                        <h3>No books found</h3>
                        <p>Try adjusting your search query</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.booksGrid}>
                            {books.map((book) => (
                                <div key={book.id} className={styles.bookCard}>
                                    <div className={styles.bookCoverWrapper}>
                                        <img
                                            src={book.formats["image/jpeg"]}
                                            alt={book.title}
                                            className={styles.bookCover}
                                            onError={(e) => {
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect fill='%23e2e8f0' width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3ENo Cover%3C/text%3E%3C/svg%3E";
                                            }}
                                        />
                                        <div className={styles.bookOverlay}>
                                            <span className={styles.viewDetails}>View Details</span>
                                        </div>
                                    </div>

                                    <div className={styles.bookContent}>
                                        <h3 className={styles.bookTitle}>{book.title}</h3>

                                        <p className={styles.bookAuthor}>
                                            {book.authors.length > 0
                                                ? book.authors.map((a) => a.name).join(", ")
                                                : "Unknown Author"}
                                        </p>

                                        <div className={styles.bookMeta}>
                                            {book.subjects && book.subjects.length > 0 && (
                                                <span className={styles.bookGenre}>
                                                    {book.subjects[0].split("--")[0]}
                                                </span>
                                            )}
                                            <span className={styles.bookId}>ID: {book.id}</span>
                                        </div>

                                        <div className={styles.bookActions}>
                                            {book.formats["application/pdf"] && (
                                                <a
                                                    href={book.formats["application/pdf"]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.bookBtn}
                                                >
                                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    PDF
                                                </a>
                                            )}

                                            {book.formats["text/html"] && (
                                                <a
                                                    href={book.formats["text/html"]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${styles.bookBtn} ${styles.bookBtnSecondary}`}
                                                >
                                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    Read
                                                </a>
                                            )}

                                            {book.formats["application/epub+zip"] && (
                                                <a
                                                    href={book.formats["application/epub+zip"]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${styles.bookBtn} ${styles.bookBtnSecondary}`}
                                                >
                                                    <svg className={styles.btnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    EPUB
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className={styles.pagination}>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className={styles.paginationBtn}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>

                            <div className={styles.pageIndicator}>
                                <span className={styles.pageNumber}>{page}</span>
                                <span className={styles.pageLabel}>of many</span>
                            </div>

                            <button
                                onClick={() => setPage(page + 1)}
                                className={styles.paginationBtn}
                            >
                                Next
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Ebooks;