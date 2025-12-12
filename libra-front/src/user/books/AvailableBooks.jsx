import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AvailableBooks.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

export const AvailableBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`);
            // Add "loaded" property for each book to track image load
            setBooks(res.data.map(b => ({ ...b, loaded: false })));
        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError("Failed to load books. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReserveBook = async () => {
        if (!selectedBook) return;
        try {
            setError(null);
            await axios.post(`/api/user/reserve/${selectedBook.id}`);
            setSuccess("Book reserved successfully!");
            setShowModal(false);
            setSelectedBook(null);
            fetchBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to reserve book:", err);
            setError(err.response?.data?.message || "Failed to reserve book");
        }
    };

    const categories = ["all", ...new Set(books.map(b => b.category).filter(Boolean))];

    let filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || book.category === filterCategory;
        const isAvailable = book.available;
        return matchesSearch && matchesCategory && isAvailable;
    });

    filteredBooks = filteredBooks.sort((a, b) => {
        switch(sortBy) {
            case "newest":
                return new Date(b.publishedDate) - new Date(a.publishedDate);
            case "oldest":
                return new Date(a.publishedDate) - new Date(b.publishedDate);
            case "title-asc":
                return a.title.localeCompare(b.title);
            case "title-desc":
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short"
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Discovering amazing books...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex' }}>
                <UserSidebar />
                <main style={{ flex: 1, marginLeft: '280px' }}>
                    <Outlet />
                </main>
            </div>

            <div className={styles.header}>
                <h1 className={styles.title}>📚 Browse Our Library</h1>
                <p className={styles.subtitle}>Explore {filteredBooks.length} available books</p>
            </div>

            {success && (
                <div className={styles.successBanner}>
                    <span>✅</span>
                    <p>{success}</p>
                </div>
            )}

            {error && (
                <div className={styles.errorBanner}>
                    <span>⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            <div className={styles.controlsSection}>
                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by title, author, or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="title-asc">Title (A-Z)</option>
                            <option value="title-desc">Title (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>

            {filteredBooks.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🔍</span>
                    <h3>No books found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className={styles.booksGrid}>
                    {filteredBooks.map((book, index) => (
                        <div key={book.id} className={styles.bookCard}>
                            <div className={styles.bookImageWrapper}>
                                <img
                                    src={book.coverImageUrl}
                                    alt={book.title}
                                    className={styles.bookImage}
                                    style={{ display: book.loaded ? "block" : "none" }}
                                    onLoad={() => {
                                        const updatedBooks = [...books];
                                        const idx = books.findIndex(b => b.id === book.id);
                                        if (idx !== -1) updatedBooks[idx].loaded = true;
                                        setBooks(updatedBooks);
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.querySelector('.imagePlaceholder').style.display = 'flex';
                                    }}
                                />
                                <div className={styles.imagePlaceholder} style={{ display: book.loaded ? "none" : "flex" }}>📖</div>

                                <div className={styles.categoryBadge}>
                                    {book.category || "Uncategorized"}
                                </div>

                                <div className={styles.cardOverlay}>
                                    <button
                                        className={styles.reserveBtn}
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setShowModal(true);
                                        }}
                                    >
                                        🔖 Reserve Book
                                    </button>
                                </div>
                            </div>

                            <div className={styles.bookContent}>
                                <h3 className={styles.bookTitle}>{book.title}</h3>
                                <p className={styles.bookAuthor}>by {book.author}</p>
                                {book.description && (
                                    <p className={styles.bookDescription}>
                                        {book.description.length > 100
                                            ? `${book.description.substring(0, 100)}...`
                                            : book.description}
                                    </p>
                                )}
                                <div className={styles.bookMeta}>
                                    <span className={styles.metaItem}>
                                        📅 {formatDate(book.publishedDate)}
                                    </span>
                                    <span className={`${styles.metaItem} ${styles.available}`}>
                                        ✓ Available
                                    </span>
                                </div>
                                <button
                                    className={styles.quickReserveBtn}
                                    onClick={() => {
                                        setSelectedBook(book);
                                        setShowModal(true);
                                    }}
                                >
                                    Reserve Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && selectedBook && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        {/* Modal Content Same as Before */}
                    </div>
                </div>
            )}
        </div>
    );
};
