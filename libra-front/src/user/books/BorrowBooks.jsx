import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BorrowBooks.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

export const BorrowBooks = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBook, setSelectedBook] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);

    useEffect(() => {
        fetchBorrowedBooks();
    }, []);

    const fetchBorrowedBooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/borrowed-books`);

            // Defensive: ensure it's an array
            setBorrowedBooks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch borrowed books:", err);
            setError("Failed to load borrowed books. Please try again.");
            setBorrowedBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReturnBook = async () => {
        if (!selectedBook) return;
        try {
            setError(null);
            await axios.post(`/api/user/return-request/${selectedBook.id}`);
            setSuccess("Return request submitted successfully!");
            setShowReturnModal(false);
            setSelectedBook(null);
            fetchBorrowedBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to request return:", err);
            setError(err.response?.data?.message || "Failed to request return");
        }
    };

    const handleRenewBook = async (bookId) => {
        try {
            setError(null);
            await axios.post(`/api/user/renew/${bookId}`);
            setSuccess("Book renewed successfully!");
            fetchBorrowedBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to renew book:", err);
            setError(err.response?.data?.message || "Failed to renew book");
        }
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    const daysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // Filter books
    let filteredBooks = borrowedBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === "overdue") {
            return matchesSearch && isOverdue(book.dueDate);
        } else if (filterStatus === "due-soon") {
            const days = daysUntilDue(book.dueDate);
            return matchesSearch && days <= 3 && days > 0;
        } else if (filterStatus === "active") {
            return matchesSearch && !isOverdue(book.dueDate) && daysUntilDue(book.dueDate) > 3;
        }
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading your borrowed books...</p>
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

            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>📚 My Borrowed Books</h1>
                <p className={styles.subtitle}>Manage your borrowed books and due dates</p>
            </div>

            {/* Success Message */}
            {success && (
                <div className={styles.successBanner}>
                    <span>✅</span>
                    <p>{success}</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className={styles.errorBanner}>
                    <span>⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📚</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Borrowed</p>
                        <h2 className={styles.statValue}>{borrowedBooks.length}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Due Soon (3 days)</p>
                        <h2 className={styles.statValue}>
                            {borrowedBooks.filter(b => {
                                const days = daysUntilDue(b.dueDate);
                                return days <= 3 && days > 0;
                            }).length}
                        </h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.danger}`}>⚠️</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Overdue</p>
                        <h2 className={styles.statValue}>
                            {borrowedBooks.filter(b => isOverdue(b.dueDate)).length}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controlsSection}>
                <div className={styles.searchBox}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterButtons}>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "all" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("all")}
                    >
                        All ({borrowedBooks.length})
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "active" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("active")}
                    >
                        Active
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "due-soon" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("due-soon")}
                    >
                        Due Soon ⏰
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "overdue" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("overdue")}
                    >
                        Overdue ⚠️
                    </button>
                </div>
            </div>

            {/* Books List */}
            {filteredBooks.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📭</span>
                    <h3>No borrowed books found</h3>
                    <p>{borrowedBooks.length === 0 ? "You haven't borrowed any books yet." : "Try adjusting your filters"}</p>
                </div>
            ) : (
                <div className={styles.booksContainer}>
                    {filteredBooks.map((book) => {
                        const overdue = isOverdue(book.dueDate);
                        const daysLeft = daysUntilDue(book.dueDate);
                        const dueSoon = daysLeft <= 3 && daysLeft > 0;

                        return (
                            <div
                                key={book.id}
                                className={`${styles.bookItem} ${overdue ? styles.overdue : ""} ${dueSoon ? styles.dueSoon : ""}`}
                            >
                                {/* Book Image */}
                                <div className={styles.bookImageWrapper}>
                                    {book.coverImageUrl ? (
                                        <img
                                            src={book.coverImageUrl}
                                            alt={book.title}
                                            className={styles.bookImage}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.querySelector('.imagePlaceholder').style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={styles.imagePlaceholder}>📖</div>

                                    {/* Status Badge */}
                                    <div className={`${styles.statusBadge} ${overdue ? styles.overdueBadge : dueSoon ? styles.dueSoonBadge : styles.activeBadge}`}>
                                        {overdue ? (
                                            <>⚠️ Overdue</>
                                        ) : dueSoon ? (
                                            <>⏰ Due Soon ({daysLeft}d)</>
                                        ) : (
                                            <>✓ Active</>
                                        )}
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className={styles.bookInfo}>
                                    <h3 className={styles.bookTitle}>{book.title}</h3>
                                    <p className={styles.bookAuthor}>by {book.author}</p>

                                    {/* Dates */}
                                    <div className={styles.datesSection}>
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateIcon}>📅</span>
                                            <div>
                                                <p className={styles.dateLabel}>Borrowed</p>
                                                <p className={styles.dateValue}>{formatDate(book.borrowedOn)}</p>
                                            </div>
                                        </div>
                                        <div className={`${styles.dateItem} ${overdue ? styles.error : dueSoon ? styles.warning : ""}`}>
                                            <span className={styles.dateIcon}>⏱️</span>
                                            <div>
                                                <p className={styles.dateLabel}>Due Date</p>
                                                <p className={styles.dateValue}>
                                                    {formatDate(book.dueDate)}
                                                    {!overdue && daysLeft >= 0 && <span className={styles.daysLeft}>({daysLeft} days)</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className={styles.progressWrapper}>
                                        <div className={`${styles.progressBar} ${overdue ? styles.progressError : dueSoon ? styles.progressWarning : styles.progressSuccess}`}>
                                            <div
                                                className={styles.progress}
                                                style={{
                                                    width: `${Math.min(100, Math.max(0, ((new Date() - new Date(book.borrowedOn)) / (new Date(book.dueDate) - new Date(book.borrowedOn))) * 100))}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.renewBtn}
                                            onClick={() => handleRenewBook(book.id)}
                                        >
                                            🔄 Renew
                                        </button>
                                        <button
                                            className={styles.returnBtn}
                                            onClick={() => {
                                                setSelectedBook(book);
                                                setShowReturnModal(true);
                                            }}
                                        >
                                            ↩️ Return
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Return Modal */}
            {showReturnModal && selectedBook && (
                <div className={styles.modalOverlay} onClick={() => setShowReturnModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>↩️ Return Book</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowReturnModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Book Info */}
                            <div className={styles.bookPreview}>
                                {selectedBook.coverImageUrl ? (
                                    <img
                                        src={selectedBook.coverImageUrl}
                                        alt={selectedBook.title}
                                        className={styles.previewImage}
                                    />
                                ) : (
                                    <div className={styles.previewPlaceholder}>📖</div>
                                )}
                                <div className={styles.previewInfo}>
                                    <h3 className={styles.previewTitle}>{selectedBook.title}</h3>
                                    <p className={styles.previewAuthor}>by {selectedBook.author}</p>
                                </div>
                            </div>

                            {/* Return Info */}
                            <div className={styles.returnInfo}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoIcon}>📅</span>
                                    <div>
                                        <p className={styles.infoLabel}>Borrowed On</p>
                                        <p className={styles.infoValue}>{formatDate(selectedBook.borrowedOn)}</p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <span className={styles.infoIcon}>⏱️</span>
                                    <div>
                                        <p className={styles.infoLabel}>Due Date</p>
                                        <p className={`${styles.infoValue} ${isOverdue(selectedBook.dueDate) ? styles.overdueDue : ""}`}>
                                            {formatDate(selectedBook.dueDate)}
                                            {isOverdue(selectedBook.dueDate) && <span className={styles.overdueTag}> (OVERDUE)</span>}
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.infoItem}>
                                    <span className={styles.infoIcon}>📍</span>
                                    <div>
                                        <p className={styles.infoLabel}>Return Location</p>
                                        <p className={styles.infoValue}>Return to any locker near you</p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Message */}
                            {isOverdue(selectedBook.dueDate) && (
                                <div className={styles.warningBox}>
                                    <p className={styles.warningText}>
                                        ⚠️ This book is overdue. Late fees may apply. Please return it as soon as possible.
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={handleReturnBook}
                                >
                                    ✓ Confirm Return
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowReturnModal(false)}
                                >
                                    ✕ Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};