import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BorrowHistory.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

export const BorrowHistory = () => {
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState("all"); // all, active, returned, overdue
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("recent"); // recent, oldest, title

    useEffect(() => {
        fetchBorrowHistory();
    }, []);

    const fetchBorrowHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("/api/user/borrow-history");
            setBorrowHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch borrow history:", err);
            setError("Failed to load borrow history");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const isOverdue = (dueDate, returnedOn) => {
        if (returnedOn) return false;
        return new Date(dueDate) < new Date();
    };

    const daysOverdue = (dueDate, returnedOn) => {
        if (returnedOn) return 0;
        const today = new Date();
        const due = new Date(dueDate);
        if (due >= today) return 0;
        const diffTime = today - due;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getStatus = (item) => {
        if (item.returnedOn) return "returned";
        if (isOverdue(item.dueDate, item.returnedOn)) return "overdue";
        return "active";
    };

    // Filter history
    let filteredHistory = borrowHistory.filter(item => {
        const matchesSearch = item.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const status = getStatus(item);

        if (filterType === "active") {
            return matchesSearch && status === "active";
        } else if (filterType === "returned") {
            return matchesSearch && status === "returned";
        } else if (filterType === "overdue") {
            return matchesSearch && status === "overdue";
        }
        return matchesSearch;
    });

    // Sort history
    filteredHistory = filteredHistory.sort((a, b) => {
        switch(sortBy) {
            case "recent":
                return new Date(b.borrowedOn) - new Date(a.borrowedOn);
            case "oldest":
                return new Date(a.borrowedOn) - new Date(b.borrowedOn);
            case "title":
                return a.book.title.localeCompare(b.book.title);
            default:
                return 0;
        }
    });

    const stats = {
        total: borrowHistory.length,
        active: borrowHistory.filter(item => getStatus(item) === "active").length,
        returned: borrowHistory.filter(item => getStatus(item) === "returned").length,
        overdue: borrowHistory.filter(item => getStatus(item) === "overdue").length
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading your borrow history...</p>
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
                <h1 className={styles.title}>📖 Borrow History</h1>
                <p className={styles.subtitle}>Track all your borrowed books</p>
            </div>

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
                        <p className={styles.statLabel}>Total Books</p>
                        <h2 className={styles.statValue}>{stats.total}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.active}`}>📍</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Currently Borrowed</p>
                        <h2 className={styles.statValue}>{stats.active}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.returned}`}>✓</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Returned</p>
                        <h2 className={styles.statValue}>{stats.returned}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.overdue}`}>⚠️</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Overdue</p>
                        <h2 className={styles.statValue}>{stats.overdue}</h2>
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

                <div className={styles.filterSort}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className={styles.selectControl}
                    >
                        <option value="all">All ({stats.total})</option>
                        <option value="active">Active ({stats.active})</option>
                        <option value="returned">Returned ({stats.returned})</option>
                        <option value="overdue">Overdue ({stats.overdue})</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.selectControl}
                    >
                        <option value="recent">Recent First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title">Title (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* History List */}
            {filteredHistory.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📭</span>
                    <h3>No borrow history found</h3>
                    <p>{borrowHistory.length === 0 ? "You haven't borrowed any books yet." : "Try adjusting your filters"}</p>
                </div>
            ) : (
                <div className={styles.historyList}>
                    {filteredHistory.map((item) => {
                        const status = getStatus(item);
                        const daysOver = daysOverdue(item.dueDate, item.returnedOn);

                        return (
                            <div
                                key={item.id}
                                className={`${styles.historyItem} ${styles[status]}`}
                            >
                                {/* Item Image */}
                                <div className={styles.itemImage}>
                                    {item.book.coverImageUrl ? (
                                        <img
                                            src={item.book.coverImageUrl}
                                            alt={item.book.title}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.querySelector('.imagePlaceholder').style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={styles.imagePlaceholder}>📖</div>
                                </div>

                                {/* Item Content */}
                                <div className={styles.itemContent}>
                                    <div className={styles.itemHeader}>
                                        <div className={styles.bookInfo}>
                                            <h3 className={styles.bookTitle}>{item.book.title}</h3>
                                            <p className={styles.bookAuthor}>by {item.book.author}</p>
                                        </div>
                                        <div className={`${styles.statusBadge} ${styles[status]}`}>
                                            {status === "returned" && "✓ Returned"}
                                            {status === "active" && "📍 Active"}
                                            {status === "overdue" && `⚠️ ${daysOver}d Overdue`}
                                        </div>
                                    </div>

                                    {/* Dates Info */}
                                    <div className={styles.datesGrid}>
                                        <div className={styles.dateItem}>
                                            <span className={styles.dateIcon}>📅</span>
                                            <div>
                                                <p className={styles.dateLabel}>Borrowed</p>
                                                <p className={styles.dateValue}>{formatDate(item.borrowedOn)}</p>
                                            </div>
                                        </div>

                                        <div className={`${styles.dateItem} ${status === "overdue" ? styles.error : ""}`}>
                                            <span className={styles.dateIcon}>⏱️</span>
                                            <div>
                                                <p className={styles.dateLabel}>Due Date</p>
                                                <p className={styles.dateValue}>
                                                    {formatDate(item.dueDate)}
                                                    {status === "overdue" && <span className={styles.overdueTag}>(OVERDUE)</span>}
                                                </p>
                                            </div>
                                        </div>

                                        {item.returnedOn && (
                                            <div className={styles.dateItem}>
                                                <span className={styles.dateIcon}>✓</span>
                                                <div>
                                                    <p className={styles.dateLabel}>Returned</p>
                                                    <p className={styles.dateValue}>{formatDate(item.returnedOn)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Duration Info */}
                                    <div className={styles.durationInfo}>
                                        {item.returnedOn ? (
                                            <div>
                                                <span className={styles.durationLabel}>Duration:</span>
                                                <span className={styles.durationValue}>
                                                    {Math.floor((new Date(item.returnedOn) - new Date(item.borrowedOn)) / (1000 * 60 * 60 * 24))} days
                                                </span>
                                            </div>
                                        ) : (
                                            <div className={status === "overdue" ? styles.errorText : ""}>
                                                <span className={styles.durationLabel}>Days Borrowed:</span>
                                                <span className={styles.durationValue}>
                                                    {Math.floor((new Date() - new Date(item.borrowedOn)) / (1000 * 60 * 60 * 24))} days
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Timeline Summary */}
            {borrowHistory.length > 0 && (
                <div className={styles.summarySection}>
                    <h2 className={styles.summaryTitle}>📊 Your Reading Statistics</h2>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>📚</div>
                            <p className={styles.summaryLabel}>Books Ever Borrowed</p>
                            <p className={styles.summaryValue}>{stats.total}</p>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>⏱️</div>
                            <p className={styles.summaryLabel}>Average Duration</p>
                            <p className={styles.summaryValue}>
                                {Math.round(
                                    borrowHistory.filter(b => b.returnedOn).reduce((acc, b) => {
                                        return acc + (new Date(b.returnedOn) - new Date(b.borrowedOn)) / (1000 * 60 * 60 * 24);
                                    }, 0) / (borrowHistory.filter(b => b.returnedOn).length || 1)
                                ) || 0} days
                            </p>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>✓</div>
                            <p className={styles.summaryLabel}>On-Time Returns</p>
                            <p className={styles.summaryValue}>
                                {Math.round((borrowHistory.filter(b =>
                                    b.returnedOn && new Date(b.returnedOn) <= new Date(b.dueDate)
                                ).length / Math.max(borrowHistory.filter(b => b.returnedOn).length, 1)) * 100)}%
                            </p>
                        </div>

                        <div className={styles.summaryCard}>
                            <div className={styles.summaryIcon}>📖</div>
                            <p className={styles.summaryLabel}>Active Books</p>
                            <p className={styles.summaryValue}>{stats.active}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};