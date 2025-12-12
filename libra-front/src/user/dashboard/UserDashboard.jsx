import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserDashboard.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';


export const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch user profile
            const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            // Fetch borrowed books
            const borrowRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/borrowed-books`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            // Fetch reserved books
            const reserveRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/reserved-books`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            // Save to state
            setUser(userRes.data);
            setBorrowedBooks(borrowRes.data);
            setReservedBooks(reserveRes.data);

        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };


    const handleReturnBook = async (bookId) => {
        if (!window.confirm("Request to return this book?")) return;
        try {
            await axios.post(`/api/user/return-request/${bookId}`);
            fetchUserData();
        } catch (err) {
            console.error("Failed to request return:", err);
        }
    };

    const handleCancelReservation = async (reservationId) => {
        if (!window.confirm("Cancel this reservation?")) return;
        try {
            await axios.delete(`/api/user/reservations/${reservationId}`);
            fetchUserData();
        } catch (err) {
            console.error("Failed to cancel reservation:", err);
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

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchUserData} className={styles.retryBtn}>
                        Try Again
                    </button>
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
            {/* Header with Profile */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.profileSection}>
                        <div className={styles.avatar}>
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.profileInfo}>
                            <h1 className={styles.greeting}>Welcome back, {user?.fullName}! 👋</h1>
                            <p className={styles.email}>{user?.email}</p>
                        </div>
                    </div>
                    <button className={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📚</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Borrowed Books</p>
                        <h2 className={styles.statValue}>{borrowedBooks.length}</h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🔖</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Reserved Books</p>
                        <h2 className={styles.statValue}>{reservedBooks.length}</h2>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📍</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Available Lockers</p>
                        <h2 className={styles.statValue}>12</h2>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === "overview" ? styles.active : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === "borrowed" ? styles.active : ""}`}
                        onClick={() => setActiveTab("borrowed")}
                    >
                        📚 Borrowed ({borrowedBooks.length})
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === "reserved" ? styles.active : ""}`}
                        onClick={() => setActiveTab("reserved")}
                    >
                        🔖 Reserved ({reservedBooks.length})
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className={styles.tabContent}>
                        <div className={styles.overviewGrid}>
                            {/* Recent Activity */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>📖 Your Activity</h2>
                                {borrowedBooks.length > 0 || reservedBooks.length > 0 ? (
                                    <div className={styles.activityList}>
                                        {borrowedBooks.slice(0, 3).map((book) => (
                                            <div key={book.id} className={styles.activityItem}>
                                                <div className={styles.activityIcon}>📚</div>
                                                <div className={styles.activityContent}>
                                                    <p className={styles.activityTitle}>Borrowed: {book.title}</p>
                                                    <p className={styles.activityTime}>
                                                        Due: {formatDate(book.dueDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {reservedBooks.slice(0, 2).map((reservation) => (
                                            <div key={reservation.id} className={styles.activityItem}>
                                                <div className={styles.activityIcon}>🔖</div>
                                                <div className={styles.activityContent}>
                                                    <p className={styles.activityTitle}>Reserved: {reservation.book.title}</p>
                                                    <p className={styles.activityTime}>
                                                        Status: {reservation.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyMessage}>No borrowed or reserved books yet</p>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className={styles.section}>
                                <h2 className={styles.sectionTitle}>⚡ Quick Actions</h2>
                                <div className={styles.actionGrid}>
                                    <button className={styles.actionCard}>
                                        <span className={styles.actionIcon}>📚</span>
                                        <span className={styles.actionLabel}>Browse Books</span>
                                    </button>
                                    <button className={styles.actionCard}>
                                        <span className={styles.actionIcon}>🔖</span>
                                        <span className={styles.actionLabel}>My Reservations</span>
                                    </button>
                                    <button className={styles.actionCard}>
                                        <span className={styles.actionIcon}>⚙️</span>
                                        <span className={styles.actionLabel}>Settings</span>
                                    </button>
                                    <button className={styles.actionCard}>
                                        <span className={styles.actionIcon}>❓</span>
                                        <span className={styles.actionLabel}>Help & Support</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Borrowed Books Tab */}
                {activeTab === "borrowed" && (
                    <div className={styles.tabContent}>
                        {borrowedBooks.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📭</span>
                                <h3>No borrowed books</h3>
                                <p>Start exploring our library!</p>
                            </div>
                        ) : (
                            <div className={styles.booksGrid}>
                                {borrowedBooks.map((book) => (
                                    <div key={book.id} className={styles.bookCard}>
                                        <div className={styles.bookImage}>
                                            {book.coverImageUrl ? (
                                                <img src={book.coverImageUrl} alt={book.title} />
                                            ) : (
                                                <div className={styles.imagePlaceholder}>📖</div>
                                            )}
                                        </div>
                                        <div className={styles.bookInfo}>
                                            <h3 className={styles.bookTitle}>{book.title}</h3>
                                            <p className={styles.bookAuthor}>by {book.author}</p>
                                            <div className={styles.bookDates}>
                                                <p><span>Borrowed:</span> {formatDate(book.borrowedOn)}</p>
                                                <p><span>Due:</span> {formatDate(book.dueDate)}</p>
                                            </div>
                                            <button
                                                className={styles.returnBtn}
                                                onClick={() => handleReturnBook(book.id)}
                                            >
                                                Return Book
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Reserved Books Tab */}
                {activeTab === "reserved" && (
                    <div className={styles.tabContent}>
                        {reservedBooks.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📭</span>
                                <h3>No reserved books</h3>
                                <p>Reserve a book to see it here!</p>
                            </div>
                        ) : (
                            <div className={styles.reservationsGrid}>
                                {reservedBooks.map((reservation) => (
                                    <div key={reservation.id} className={styles.reservationCard}>
                                        <div className={styles.resHeader}>
                                            <h3 className={styles.resTitle}>{reservation.book.title}</h3>
                                            <span className={`${styles.statusBadge} ${styles[reservation.status.toLowerCase()]}`}>
                                                {reservation.status}
                                            </span>
                                        </div>
                                        <p className={styles.resAuthor}>by {reservation.book.author}</p>

                                        <div className={styles.resDetails}>
                                            <div className={styles.resDetail}>
                                                <span className={styles.resIcon}>📅</span>
                                                <div>
                                                    <p>Reserved Date</p>
                                                    <p>{formatDate(reservation.reservedDate)}</p>
                                                </div>
                                            </div>
                                            {reservation.lockerId && (
                                                <div className={styles.resDetail}>
                                                    <span className={styles.resIcon}>🔐</span>
                                                    <div>
                                                        <p>Pickup Locker</p>
                                                        <p>{reservation.locker?.name || `Locker ${reservation.lockerId}`}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {reservation.status === "READY_FOR_PICKUP" && (
                                            <button className={styles.pickupBtn}>
                                                📍 Go to Locker
                                            </button>
                                        )}
                                        {(reservation.status === "PENDING" || reservation.status === "READY_FOR_PICKUP") && (
                                            <button
                                                className={styles.cancelResBtn}
                                                onClick={() => handleCancelReservation(reservation.id)}
                                            >
                                                ✕ Cancel Reservation
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};