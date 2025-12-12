import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LockerReservationUser.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

export const LockerReservationUser = () => {
    const [books, setBooks] = useState([]);
    const [lockers, setLockers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [selectedBook, setSelectedBook] = useState(null);
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [selectedLocker, setSelectedLocker] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lockerLoading, setLockerLoading] = useState(false);
    const [lockerError, setLockerError] = useState(null);
    const [lockerSuccess, setLockerSuccess] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [booksRes, lockersRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/books`),
                axios.get(`${process.env.REACT_APP_API_URL}/api/lockers`)
            ]);
            setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
            setLockers(Array.isArray(lockersRes.data) ? lockersRes.data : []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load books or lockers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReserveBook = async () => {
        if (!selectedBook || !selectedLocker) {
            setError("Please select both a book and a locker");
            return;
        }

        try {
            setError(null);
            setIsSubmitting(true);
            await axios.post(`${process.env.REACT_APP_API_URL}/api/user/reserve`, {
                bookId: selectedBook.id,
                lockerId: selectedLocker
            });
            setSuccess("Book reserved successfully! You'll be notified when it arrives at your locker.");
            setShowReservationModal(false);
            setSelectedBook(null);
            setSelectedLocker("");
            fetchData();
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            console.error("Failed to reserve book:", err);
            setError(err.response?.data?.message || "Failed to reserve book. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ["all", ...new Set(books.map(b => b.category).filter(Boolean))];

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || book.category === filterCategory;
        return matchesSearch && matchesCategory && book.available;
    });

    const handleOpenLocker = async (lockerId) => {
        try {
            setLockerLoading(true);
            setLockerError(null);
            setLockerSuccess(null);

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/lockers/open`);
            setLockerSuccess(res.data); // "Locker opened!"
            setTimeout(() => setLockerSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to open locker:", err);
            setLockerError(err.response?.data || "Failed to open locker");
            setTimeout(() => setLockerError(null), 3000);
        } finally {
            setLockerLoading(false);
        }
    };


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
                    <p>Loading available books...</p>
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
                <h1 className={styles.title}>📦 Reserve & Order to Locker</h1>
                <p className={styles.subtitle}>Reserve books and pick them up at your nearest locker</p>
            </div>

            {/* Success & Error Messages */}
            {success && <div className={styles.successBanner}><span>✅</span><p>{success}</p></div>}
            {error && <div className={styles.errorBanner}><span>⚠️</span><p>{error}</p></div>}

            {/* Features Section */}
            <div className={styles.featuresSection}>
                {[
                    { icon: "📚", title: "Browse & Reserve", desc: "Explore thousands of available books in our library" },
                    { icon: "📍", title: "Choose Locker", desc: "Select a convenient locker location near you" },
                    { icon: "🔔", title: "Get Notified", desc: "We'll notify you when your book is ready for pickup" },
                    { icon: "🚀", title: "Quick Pickup", desc: "Pick up your book 24/7 at your chosen locker" },
                ].map((f, idx) => (
                    <div key={idx} className={styles.featureCard}>
                        <div className={styles.featureIcon}>{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* Info Banner */}
            <div className={styles.infoBanner}>
                <span>ℹ️</span>
                <div>
                    <p className={styles.infoTitle}>How it works</p>
                    <p>Books are typically prepared and placed in your chosen locker within 24-48 hours. You can pick them up anytime using your reservation code.</p>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controlsSection}>
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
                            <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleOpenLocker}
                    disabled={loading}
                    className={styles.submitBtn}
                >Open The Locker</button>
            </div>


            {/* Books Grid */}
            {filteredBooks.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>🔍</span>
                    <h3>No available books found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Available Books ({filteredBooks.length})</h2>
                        <p className={styles.sectionSubtitle}>Select a book and choose your pickup locker</p>
                    </div>

                    <div className={styles.booksGrid}>
                        {filteredBooks.map(book => (
                            <div key={book.id} className={styles.bookCard}>
                                <div className={styles.bookImageWrapper}>
                                    {book.coverImageUrl ? (
                                        <img
                                            src={book.coverImageUrl}
                                            alt={book.title}
                                            className={styles.bookImage}
                                            onLoad={(e) => {
                                                e.target.style.display = 'block';
                                                const placeholder = e.target.parentElement.querySelector(`.${styles.imagePlaceholder}`);
                                                if (placeholder) placeholder.style.display = 'none';
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const placeholder = e.target.parentElement.querySelector(`.${styles.imagePlaceholder}`);
                                                if (placeholder) placeholder.style.display = 'flex';
                                            }}
                                            style={{ display: 'none' }} // start hidden until loaded
                                        />
                                    ) : null}
                                    <div className={styles.imagePlaceholder} style={{ display: 'flex' }}>📖</div>
                                </div>


                                <div className={styles.bookContent}>
                                    <h3 className={styles.bookTitle}>{book.title}</h3>
                                    <p className={styles.bookAuthor}>by {book.author}</p>
                                    {book.description && (
                                        <p className={styles.bookDescription}>
                                            {book.description.length > 80 ? `${book.description.substring(0, 80)}...` : book.description}
                                        </p>
                                    )}

                                    <div className={styles.bookMeta}>
                                        <span className={styles.metaItem}>📅 {formatDate(book.publishedDate)}</span>
                                        <span className={`${styles.metaItem} ${styles.available}`}>✓ In Stock</span>
                                    </div>

                                    <button
                                        className={styles.quickReserveBtn}
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setSelectedLocker("");
                                            setShowReservationModal(true);
                                        }}
                                    >
                                        📦 Reserve for Locker
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reservation Modal */}
            {showReservationModal && selectedBook && (
                <div className={styles.modalOverlay} onClick={() => setShowReservationModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>📦 Complete Your Reservation</h2>
                            <button className={styles.closeBtn} onClick={() => setShowReservationModal(false)}>✕</button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Book Preview */}
                            <div className={styles.bookPreview}>
                                {selectedBook.coverImageUrl ? (
                                    <img src={selectedBook.coverImageUrl} alt={selectedBook.title} className={styles.previewImage} />
                                ) : (
                                    <div className={styles.previewPlaceholder}>📖</div>
                                )}
                                <div className={styles.previewInfo}>
                                    <h3 className={styles.previewTitle}>{selectedBook.title}</h3>
                                    <p className={styles.previewAuthor}>by {selectedBook.author}</p>
                                    <p className={styles.previewCategory}>{selectedBook.category}</p>
                                </div>
                            </div>

                            {/* Locker Selection */}
                            <div className={styles.lockerSection}>
                                <h3 className={styles.lockerTitle}>🔐 Select Your Pickup Locker</h3>
                                <p className={styles.lockerSubtitle}>Choose a convenient location near you</p>

                                {lockers.length === 0 ? (
                                    <p className={styles.noLockers}>No lockers available at the moment</p>
                                ) : (
                                    <div className={styles.lockersGrid}>
                                        {lockers.map(locker => (
                                            <div
                                                key={locker.id}
                                                className={`${styles.lockerOption} ${selectedLocker === locker.id ? styles.selected : ""}`}
                                                onClick={() => setSelectedLocker(locker.id)}
                                            >
                                                <div className={styles.lockerOptionHeader}>
                                                    <p className={styles.lockerName}><span className={styles.lockerIcon}>🔐</span>{locker.name}</p>
                                                    <span className={`${styles.lockerStatus} ${locker.available ? styles.available : styles.full}`}>
                                                        {locker.available ? "✓ Available" : "❌ Full"}
                                                    </span>
                                                </div>
                                                <p className={styles.lockerLocation}><span className={styles.locationIcon}>📍</span>{locker.location}</p>
                                                <div className={styles.lockerDetails}>
                                                    <span>⏰ Open 24/7</span>
                                                    <span>📦 {locker.capacity} slots</span>
                                                </div>
                                                {selectedLocker === locker.id && <div className={styles.selectedCheckmark}>✓</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reservation Info */}
                            <div className={styles.reservationInfo}>
                                {[
                                    { icon: "📅", label: "Preparation Time", value: "24-48 hours" },
                                    { icon: "💳", label: "Cost", value: "Free" },
                                    { icon: "⏱️", label: "Validity", value: "7 days to pickup" },
                                ].map((info, idx) => (
                                    <div key={idx} className={styles.infoItem}>
                                        <span className={styles.infoIcon}>{info.icon}</span>
                                        <div>
                                            <p className={styles.infoLabel}>{info.label}</p>
                                            <p className={styles.infoValue}>{info.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Terms */}
                            <div className={styles.terms}>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" defaultChecked={true} />
                                    <span>I agree to the reservation terms and conditions</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.confirmBtn}
                                    onClick={handleReserveBook}
                                    disabled={!selectedLocker || isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : "✓ Confirm Reservation"}
                                </button>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={() => setShowReservationModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
