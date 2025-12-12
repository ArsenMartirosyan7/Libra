import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ReserveBooks.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';


export const ReserveBooks = () => {
    const [reservations, setReservations] = useState([]);
    const [lockers, setLockers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // view, cancel, pickup

    useEffect(() => {
        fetchReservations();
        fetchLockers();
    }, []);

    const fetchReservations = async () => {
        try {
            const res = await axios.get("/api/user/reserved-books");
            setReservations(res.data);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            setError("Failed to load reservations");
        } finally {
            setLoading(false);
        }
    };

    const fetchLockers = async () => {
        try {
            const res = await axios.get("/api/lockers");
            setLockers(res.data);
        } catch (err) {
            console.error("Failed to fetch lockers:", err);
        }
    };

    const handleCancelReservation = async () => {
        if (!selectedReservation) return;
        try {
            setError(null);
            await axios.delete(`/api/user/reservations/${selectedReservation.id}`);
            setSuccess("Reservation cancelled successfully!");
            fetchReservations();
            setShowModal(false);
            setSelectedReservation(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to cancel reservation:", err);
            setError(err.response?.data?.message || "Failed to cancel reservation");
        }
    };

    const handlePickupConfirm = async () => {
        if (!selectedReservation) return;
        try {
            setError(null);
            await axios.post(`/api/user/reservations/${selectedReservation.id}/pickup`);
            setSuccess("Pickup confirmed! Book is now in your account.");
            fetchReservations();
            setShowModal(false);
            setSelectedReservation(null);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to confirm pickup:", err);
            setError(err.response?.data?.message || "Failed to confirm pickup");
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

    const getStatusColor = (status) => {
        switch(status) {
            case "PENDING": return "pending";
            case "READY_FOR_PICKUP": return "ready";
            case "PICKED_UP": return "picked";
            case "CANCELLED": return "cancelled";
            default: return "pending";
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            PENDING: "⏳ Pending",
            READY_FOR_PICKUP: "📦 Ready for Pickup",
            PICKED_UP: "✅ Picked Up",
            CANCELLED: "❌ Cancelled"
        };
        return labels[status] || status;
    };

    // Filter reservations
    let filteredReservations = reservations.filter(r => {
        const matchesSearch = r.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "all" || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading your reservations...</p>
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
                <h1 className={styles.title}>🔖 My Reservations</h1>
                <p className={styles.subtitle}>Track and manage your book reservations</p>
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
                    <div className={styles.statIcon}>📦</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Total Reservations</p>
                        <h2 className={styles.statValue}>{reservations.length}</h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon}>⏳</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Pending</p>
                        <h2 className={styles.statValue}>
                            {reservations.filter(r => r.status === "PENDING").length}
                        </h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.ready}`}>🎯</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Ready for Pickup</p>
                        <h2 className={styles.statValue}>
                            {reservations.filter(r => r.status === "READY_FOR_PICKUP").length}
                        </h2>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.success}`}>✓</div>
                    <div className={styles.statInfo}>
                        <p className={styles.statLabel}>Picked Up</p>
                        <h2 className={styles.statValue}>
                            {reservations.filter(r => r.status === "PICKED_UP").length}
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
                        All ({reservations.length})
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "PENDING" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("PENDING")}
                    >
                        Pending
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "READY_FOR_PICKUP" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("READY_FOR_PICKUP")}
                    >
                        Ready 📦
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filterStatus === "PICKED_UP" ? styles.active : ""}`}
                        onClick={() => setFilterStatus("PICKED_UP")}
                    >
                        Picked Up ✓
                    </button>
                </div>
            </div>

            {/* Reservations List */}
            {filteredReservations.length === 0 ? (
                <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>📭</span>
                    <h3>No reservations found</h3>
                    <p>{reservations.length === 0 ? "You haven't reserved any books yet." : "Try adjusting your filters"}</p>
                </div>
            ) : (
                <div className={styles.reservationsGrid}>
                    {filteredReservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className={`${styles.reservationCard} ${styles[getStatusColor(reservation.status)]}`}
                        >
                            {/* Card Header */}
                            <div className={styles.cardHeader}>
                                <div className={styles.bookPreview}>
                                    {reservation.book.coverImageUrl ? (
                                        <img
                                            src={reservation.book.coverImageUrl}
                                            alt={reservation.book.title}
                                            className={styles.coverImage}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.querySelector('.imagePlaceholder').style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={styles.imagePlaceholder}>📖</div>
                                </div>

                                <div className={styles.headerInfo}>
                                    <h3 className={styles.bookTitle}>{reservation.book.title}</h3>
                                    <p className={styles.bookAuthor}>by {reservation.book.author}</p>
                                    <span className={`${styles.statusBadge} ${styles[getStatusColor(reservation.status)]}`}>
                                        {getStatusLabel(reservation.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className={styles.cardContent}>
                                {/* Reservation Details */}
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>📅</span>
                                        <div>
                                            <p className={styles.detailLabel}>Reserved Date</p>
                                            <p className={styles.detailValue}>{formatDate(reservation.reservedDate)}</p>
                                        </div>
                                    </div>

                                    <div className={styles.detailItem}>
                                        <span className={styles.detailIcon}>⏰</span>
                                        <div>
                                            <p className={styles.detailLabel}>Valid Until</p>
                                            <p className={styles.detailValue}>{formatDate(reservation.pickupDeadline)}</p>
                                        </div>
                                    </div>

                                    {reservation.status === "READY_FOR_PICKUP" && reservation.lockerId && (
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailIcon}>🔐</span>
                                            <div>
                                                <p className={styles.detailLabel}>Pickup Locker</p>
                                                <p className={styles.detailValue}>{reservation.locker?.name || `Locker ${reservation.lockerId}`}</p>
                                            </div>
                                        </div>
                                    )}

                                    {reservation.status === "READY_FOR_PICKUP" && reservation.locker && (
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailIcon}>📍</span>
                                            <div>
                                                <p className={styles.detailLabel}>Location</p>
                                                <p className={styles.detailValue}>{reservation.locker.location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {reservation.status === "PICKED_UP" && reservation.pickedUpDate && (
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailIcon}>✓</span>
                                            <div>
                                                <p className={styles.detailLabel}>Picked Up On</p>
                                                <p className={styles.detailValue}>{formatDate(reservation.pickedUpDate)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Info */}
                                {reservation.status === "PENDING" && (
                                    <div className={styles.infoBox}>
                                        <p>⏳ Your reservation is pending. You'll be notified when the book is ready for pickup at your preferred locker.</p>
                                    </div>
                                )}

                                {reservation.status === "READY_FOR_PICKUP" && (
                                    <div className={styles.infoBox}>
                                        <p>🎉 Your book is ready! Head to the locker and use your reservation code to pick it up.</p>
                                    </div>
                                )}

                                {reservation.status === "PICKED_UP" && (
                                    <div className={styles.infoBox}>
                                        <p>✓ Book successfully picked up. Enjoy your reading!</p>
                                    </div>
                                )}

                                {reservation.status === "CANCELLED" && (
                                    <div className={styles.infoBox}>
                                        <p>❌ This reservation has been cancelled.</p>
                                    </div>
                                )}
                            </div>

                            {/* Card Footer */}
                            <div className={styles.cardFooter}>
                                <button
                                    className={styles.detailsBtn}
                                    onClick={() => {
                                        setSelectedReservation(reservation);
                                        setModalMode("view");
                                        setShowModal(true);
                                    }}
                                >
                                    View Details
                                </button>

                                {reservation.status === "READY_FOR_PICKUP" && (
                                    <button
                                        className={styles.pickupBtn}
                                        onClick={() => {
                                            setSelectedReservation(reservation);
                                            setModalMode("pickup");
                                            setShowModal(true);
                                        }}
                                    >
                                        📍 Confirm Pickup
                                    </button>
                                )}

                                {(reservation.status === "PENDING" || reservation.status === "READY_FOR_PICKUP") && (
                                    <button
                                        className={styles.cancelBtn}
                                        onClick={() => {
                                            setSelectedReservation(reservation);
                                            setModalMode("cancel");
                                            setShowModal(true);
                                        }}
                                    >
                                        ✕ Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && selectedReservation && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {modalMode === "view" && "📖 Reservation Details"}
                                {modalMode === "pickup" && "📍 Confirm Pickup"}
                                {modalMode === "cancel" && "❌ Cancel Reservation"}
                            </h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* View Mode */}
                            {modalMode === "view" && (
                                <>
                                    <div className={styles.bookPreviewLarge}>
                                        {selectedReservation.book.coverImageUrl ? (
                                            <img
                                                src={selectedReservation.book.coverImageUrl}
                                                alt={selectedReservation.book.title}
                                                className={styles.previewImage}
                                            />
                                        ) : (
                                            <div className={styles.previewPlaceholder}>📖</div>
                                        )}
                                        <div className={styles.previewInfo}>
                                            <h3>{selectedReservation.book.title}</h3>
                                            <p>by {selectedReservation.book.author}</p>
                                            <span className={`${styles.statusBadgeLarge} ${styles[getStatusColor(selectedReservation.status)]}`}>
                                                {getStatusLabel(selectedReservation.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.detailsList}>
                                        <div className={styles.detail}>
                                            <span>📅 Reserved Date</span>
                                            <p>{formatDate(selectedReservation.reservedDate)}</p>
                                        </div>
                                        <div className={styles.detail}>
                                            <span>⏰ Valid Until</span>
                                            <p>{formatDate(selectedReservation.pickupDeadline)}</p>
                                        </div>
                                        {selectedReservation.lockerId && (
                                            <div className={styles.detail}>
                                                <span>🔐 Assigned Locker</span>
                                                <p>{selectedReservation.locker?.name || `Locker ${selectedReservation.lockerId}`}</p>
                                            </div>
                                        )}
                                        {selectedReservation.locker && (
                                            <div className={styles.detail}>
                                                <span>📍 Location</span>
                                                <p>{selectedReservation.locker.location}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Pickup Mode */}
                            {modalMode === "pickup" && (
                                <>
                                    <div className={styles.confirmBox}>
                                        <p className={styles.confirmTitle}>Ready to pick up?</p>
                                        <p>Your book is waiting at <strong>{selectedReservation.locker?.name}</strong></p>
                                        <p className={styles.smallText}>Location: {selectedReservation.locker?.location}</p>
                                    </div>

                                    <div className={styles.pickupGuide}>
                                        <h4>Steps to Pickup:</h4>
                                        <ol>
                                            <li>Go to the locker location</li>
                                            <li>Find locker <strong>{selectedReservation.locker?.name}</strong></li>
                                            <li>Enter your reservation code</li>
                                            <li>Open the locker and grab your book</li>
                                            <li>Confirm pickup here</li>
                                        </ol>
                                    </div>
                                </>
                            )}

                            {/* Cancel Mode */}
                            {modalMode === "cancel" && (
                                <div className={styles.cancelWarning}>
                                    <p className={styles.cancelTitle}>Cancel this reservation?</p>
                                    <p>Book: <strong>{selectedReservation.book.title}</strong></p>
                                    <p className={styles.warningText}>
                                        This action cannot be undone. Your reservation will be cancelled immediately.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className={styles.modalFooter}>
                            {modalMode === "view" && (
                                <button className={styles.closeModalBtn} onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            )}

                            {modalMode === "pickup" && (
                                <>
                                    <button className={styles.confirmPickupBtn} onClick={handlePickupConfirm}>
                                        ✓ Confirm Pickup
                                    </button>
                                    <button className={styles.cancelModalBtn} onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                </>
                            )}

                            {modalMode === "cancel" && (
                                <>
                                    <button className={styles.confirmCancelBtn} onClick={handleCancelReservation}>
                                        ✓ Yes, Cancel Reservation
                                    </button>
                                    <button className={styles.cancelModalBtn} onClick={() => setShowModal(false)}>
                                        ✕ Keep Reservation
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};