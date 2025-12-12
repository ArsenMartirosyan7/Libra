import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ReturnBooks.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

export const ReturnBooks = () => {
    const [returnHistory, setReturnHistory] = useState([]);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filterType, setFilterType] = useState("all"); // all, pending, completed
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // view, initiate

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [historyRes, borrowedRes] = await Promise.all([
                axios.get("/api/user/return-history"),
                axios.get("/api/user/borrowed-books")
            ]);
            setReturnHistory(historyRes.data);
            setBorrowedBooks(borrowedRes.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load return information");
        } finally {
            setLoading(false);
        }
    };

    const handleInitiateReturn = async (book) => {
        try {
            setError(null);
            await axios.post(`/api/user/return-request/${book.id}`);
            setSuccess("Return request initiated successfully! Visit any locker to complete the return.");
            fetchData();
            setShowModal(false);
            setSelectedReturn(null);
            setTimeout(() => setSuccess(null), 4000);
        } catch (err) {
            console.error("Failed to initiate return:", err);
            setError(err.response?.data?.message || "Failed to initiate return");
        }
    };

    const handleCompleteReturn = async () => {
        if (!selectedReturn) return;
        try {
            setError(null);
            await axios.post(`/api/user/returns/${selectedReturn.id}/complete`);
            setSuccess("Return completed successfully! Thank you for returning the book.");
            fetchData();
            setShowModal(false);
            setSelectedReturn(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to complete return:", err);
            setError(err.response?.data?.message || "Failed to complete return");
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

    const daysFromReturn = (returnDate) => {
        const today = new Date();
        const returned = new Date(returnDate);
        const diffTime = today - returned;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Filter returns
    let filteredReturns = returnHistory.filter(r => {
        const matchesSearch = r.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.book.author.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === "pending") {
            return matchesSearch && !r.completedDate;
        } else if (filterType === "completed") {
            return matchesSearch && r.completedDate;
        }
        return matchesSearch;
    });

    const pendingReturns = returnHistory.filter(r => !r.completedDate);
    const completedReturns = returnHistory.filter(r => r.completedDate);
    const activelyBorrowed = borrowedBooks.length;

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading return information...</p>
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
                <h1 className={styles.title}>↩️ Book Returns</h1>
                <p className={styles.subtitle}>Manage your book returns and return requests</p>
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
                        <p className={styles.statLabel}>Currently Borrowed</p>
                        <h2 className={styles.statValue}>{activelyBorrowed}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.pending}`}>⏳</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Pending Returns</p>
                        <h2 className={styles.statValue}>{pendingReturns.length}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.success}`}>✓</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Completed Returns</p>
                        <h2 className={styles.statValue}>{completedReturns.length}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.info}`}>📊</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Returns</p>
                        <h2 className={styles.statValue}>{returnHistory.length}</h2>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            {activelyBorrowed > 0 && (
                <div className={styles.infoBanner}>
                    <span className={styles.bannerIcon}>ℹ️</span>
                    <div className={styles.bannerContent}>
                        <p className={styles.bannerTitle}>You have {activelyBorrowed} book(s) to return</p>
                        <p className={styles.bannerText}>You can initiate a return request anytime, then drop off your books at any locker location.</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className={styles.tabsSection}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabBtn} ${filterType === "all" ? styles.active : ""}`}
                        onClick={() => setFilterType("all")}
                    >
                        All Returns ({returnHistory.length})
                    </button>
                    <button
                        className={`${styles.tabBtn} ${filterType === "pending" ? styles.active : ""}`}
                        onClick={() => setFilterType("pending")}
                    >
                        Pending ({pendingReturns.length})
                    </button>
                    <button
                        className={`${styles.tabBtn} ${filterType === "completed" ? styles.active : ""}`}
                        onClick={() => setFilterType("completed")}
                    >
                        Completed ({completedReturns.length})
                    </button>
                </div>

                {/* Search */}
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
            </div>

            {/* Content Sections */}
            {filterType === "all" || filterType === "pending" ? (
                <>
                    {/* Borrow Books - Initiate Return */}
                    {activelyBorrowed > 0 && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>📚 Currently Borrowed</h2>
                                <p className={styles.sectionSubtitle}>Books you can return</p>
                            </div>

                            {borrowedBooks.length === 0 ? (
                                <div className={styles.emptySection}>
                                    <p>No borrowed books at the moment</p>
                                </div>
                            ) : (
                                <div className={styles.booksGrid}>
                                    {borrowedBooks.map((book) => (
                                        <div key={book.id} className={styles.borrowCard}>
                                            <div className={styles.cardImage}>
                                                {book.coverImageUrl ? (
                                                    <img
                                                        src={book.coverImageUrl}
                                                        alt={book.title}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.querySelector('.imagePlaceholder').style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={styles.imagePlaceholder}>📖</div>
                                            </div>

                                            <div className={styles.cardInfo}>
                                                <h3 className={styles.cardTitle}>{book.title}</h3>
                                                <p className={styles.cardAuthor}>by {book.author}</p>

                                                <div className={styles.dueInfo}>
                                                    <span className={styles.dueLabel}>Due:</span>
                                                    <span className={styles.dueDate}>{formatDate(book.dueDate)}</span>
                                                </div>

                                                <button
                                                    className={styles.initiateBtn}
                                                    onClick={() => {
                                                        setSelectedReturn(book);
                                                        setModalMode("initiate");
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    ↩️ Return Book
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pending Returns */}
                    {pendingReturns.length > 0 && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>⏳ Pending Returns</h2>
                                <p className={styles.sectionSubtitle}>Drop off your books at any locker</p>
                            </div>

                            <div className={styles.returnsList}>
                                {pendingReturns.filter(r => searchTerm === "" ||
                                    r.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    r.book.author.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((returnItem) => (
                                    <div key={returnItem.id} className={styles.returnItem}>
                                        <div className={styles.itemImage}>
                                            {returnItem.book.coverImageUrl ? (
                                                <img
                                                    src={returnItem.book.coverImageUrl}
                                                    alt={returnItem.book.title}
                                                />
                                            ) : (
                                                <div className={styles.imagePlaceholder}>📖</div>
                                            )}
                                        </div>

                                        <div className={styles.itemContent}>
                                            <h3 className={styles.itemTitle}>{returnItem.book.title}</h3>
                                            <p className={styles.itemAuthor}>by {returnItem.book.author}</p>

                                            <div className={styles.itemDetails}>
                                                <div className={styles.detail}>
                                                    <span className={styles.icon}>📅</span>
                                                    <div>
                                                        <p>Return Requested</p>
                                                        <p>{formatDate(returnItem.requestedDate)}</p>
                                                    </div>
                                                </div>
                                                <div className={styles.detail}>
                                                    <span className={styles.icon}>⏰</span>
                                                    <div>
                                                        <p>Pending For</p>
                                                        <p>{daysFromReturn(returnItem.requestedDate)} day(s)</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                className={styles.completeBtn}
                                                onClick={() => {
                                                    setSelectedReturn(returnItem);
                                                    setModalMode("view");
                                                    setShowModal(true);
                                                }}
                                            >
                                                ✓ Complete Return
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : null}

            {/* Completed Returns */}
            {(filterType === "all" || filterType === "completed") && completedReturns.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>✓ Completed Returns</h2>
                        <p className={styles.sectionSubtitle}>Books you've successfully returned</p>
                    </div>

                    <div className={styles.completedGrid}>
                        {completedReturns.filter(r => searchTerm === "" ||
                            r.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.book.author.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((returnItem) => (
                            <div key={returnItem.id} className={styles.completedCard}>
                                <div className={styles.completedBadge}>✓ Returned</div>

                                <div className={styles.completedImage}>
                                    {returnItem.book.coverImageUrl ? (
                                        <img
                                            src={returnItem.book.coverImageUrl}
                                            alt={returnItem.book.title}
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>📖</div>
                                    )}
                                </div>

                                <div className={styles.completedInfo}>
                                    <h3 className={styles.completedTitle}>{returnItem.book.title}</h3>
                                    <p className={styles.completedAuthor}>by {returnItem.book.author}</p>

                                    <div className={styles.completedDates}>
                                        <div>
                                            <span className={styles.label}>Returned On</span>
                                            <p>{formatDate(returnItem.completedDate)}</p>
                                        </div>
                                    </div>

                                    <button
                                        className={styles.detailsBtn}
                                        onClick={() => {
                                            setSelectedReturn(returnItem);
                                            setModalMode("view");
                                            setShowModal(true);
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {filteredReturns.length === 0 && returnHistory.length === 0 && borrowedBooks.length === 0 && (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📭</span>
                    <h3>No returns yet</h3>
                    <p>Borrow books and manage your returns here</p>
                </div>
            )}

            {/* Modal */}
            {showModal && selectedReturn && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {modalMode === "initiate" && "↩️ Initiate Return"}
                                {modalMode === "view" && "📋 Return Details"}
                            </h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Book Preview */}
                            <div className={styles.bookPreview}>
                                {selectedReturn.book.coverImageUrl ? (
                                    <img
                                        src={selectedReturn.book.coverImageUrl}
                                        alt={selectedReturn.book.title}
                                        className={styles.previewImage}
                                    />
                                ) : (
                                    <div className={styles.previewPlaceholder}>📖</div>
                                )}
                                <div className={styles.previewInfo}>
                                    <h3>{selectedReturn.book.title}</h3>
                                    <p>by {selectedReturn.book.author}</p>
                                </div>
                            </div>

                            {/* Initiate Mode */}
                            {modalMode === "initiate" && (
                                <>
                                    <div className={styles.infoBox}>
                                        <p className={styles.infoTitle}>Ready to return?</p>
                                        <p>Once you confirm, you can drop off this book at any locker location.</p>
                                    </div>

                                    <div className={styles.returnSteps}>
                                        <h4>Return Process:</h4>
                                        <ol>
                                            <li>Confirm the return request</li>
                                            <li>Visit any locker location</li>
                                            <li>Enter the book in the locker</li>
                                            <li>Complete the return here</li>
                                        </ol>
                                    </div>
                                </>
                            )}

                            {/* View Mode */}
                            {modalMode === "view" && selectedReturn.completedDate && (
                                <div className={styles.detailsList}>
                                    <div className={styles.detailRow}>
                                        <span>📅 Borrowed Date</span>
                                        <p>{formatDate(selectedReturn.borrowedDate || selectedReturn.requestedDate)}</p>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>📋 Return Requested</span>
                                        <p>{formatDate(selectedReturn.requestedDate)}</p>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <span>✓ Returned On</span>
                                        <p>{formatDate(selectedReturn.completedDate)}</p>
                                    </div>
                                </div>
                            )}

                            {modalMode === "view" && !selectedReturn.completedDate && (
                                <div className={styles.pendingInfo}>
                                    <div className={styles.infoBox}>
                                        <p className={styles.infoTitle}>Your return is pending</p>
                                        <p>You initiated the return on <strong>{formatDate(selectedReturn.requestedDate)}</strong></p>
                                    </div>

                                    <div className={styles.completeGuide}>
                                        <h4>To complete the return:</h4>
                                        <ol>
                                            <li>Go to any locker location</li>
                                            <li>Place your book in the locker</li>
                                            <li>Click "Complete Return" button</li>
                                        </ol>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className={styles.modalFooter}>
                            {modalMode === "initiate" && (
                                <>
                                    <button
                                        className={styles.confirmBtn}
                                        onClick={() => handleInitiateReturn(selectedReturn)}
                                    >
                                        ✓ Confirm Return Request
                                    </button>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                            {modalMode === "view" && !selectedReturn.completedDate && (
                                <>
                                    <button
                                        className={styles.confirmBtn}
                                        onClick={handleCompleteReturn}
                                    >
                                        ✓ Complete Return
                                    </button>
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </>
                            )}

                            {modalMode === "view" && selectedReturn.completedDate && (
                                <button
                                    className={styles.closeModalBtn}
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};