import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./LockerReservation.module.scss";

export const LockerReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [lockers, setLockers] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedLocker, setSelectedLocker] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Fetch reservations and lockers
    const fetchReservations = async () => {
        try {
            const res = await axios.get("/api/admin/reservations");
            setReservations(res.data);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);
            setError("Failed to fetch reservations");
        }
    };

    const fetchLockers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/lockers`);
            setLockers(res.data);
        } catch (err) {
            console.error("Failed to fetch lockers:", err);
            setError("Failed to fetch lockers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            await Promise.all([fetchReservations(), fetchLockers()]);
        };
        fetchAll();
    }, []);

    // Assign to locker
    const handleAssignLocker = async () => {
        if (!selectedReservation || !selectedLocker) {
            setError("Please select a locker");
            return;
        }
        try {
            setError(null);
            await axios.put(`/api/admin/reservations/${selectedReservation.id}`, {
                ...selectedReservation,
                lockerId: selectedLocker,
                status: "READY_FOR_PICKUP"
            });
            setSuccess("Reservation assigned to locker successfully!");
            fetchReservations();
            setShowModal(false);
            setSelectedReservation(null);
            setSelectedLocker("");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to assign locker");
        }
    };

    // Mark as picked up
    const handlePickup = async (id) => {
        if (!window.confirm("Mark this reservation as picked up?")) return;
        try {
            setError(null);
            await axios.put(`/api/admin/reservations/${id}`, {
                status: "PICKED_UP"
            });
            setSuccess("Reservation marked as picked up!");
            fetchReservations();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to update reservation");
        }
    };

    // Cancel reservation
    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this reservation? This action cannot be undone.")) return;
        try {
            setError(null);
            await axios.delete(`/api/admin/reservations/${id}`);
            setSuccess("Reservation cancelled successfully!");
            fetchReservations();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to cancel reservation");
        }
    };

    // Filter reservations
    const filteredReservations = reservations.filter(r => {
        const matchesStatus = filterStatus === "all" || r.status === filterStatus;
        const matchesSearch = r.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.book.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Get status color
    const getStatusColor = (status) => {
        switch(status) {
            case "PENDING":
                return "pending";
            case "READY_FOR_PICKUP":
                return "ready";
            case "PICKED_UP":
                return "picked";
            case "CANCELLED":
                return "cancelled";
            default:
                return "pending";
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
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

    const quickLinks = [
        { label: "Dashboard", href: "/admin/dashboard", icon: "📊", color: "blue" },
        { label: "Books", href: "/admin/book", icon: "📚", color: "blue" },
        { label: "Users", href: "/admin/user", icon: "👥", color: "purple" },
        { label: "Borrow / Return", href: "/admin/borrow", icon: "🔄", color: "green" },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>🔖 Reservations Management</h1>
                <p className={styles.subtitle}>Manage book reservations and locker assignments</p>
            </div>

            <div className={styles.quickLinksSection}>
                <div className={styles.sectionHeader}>
                </div>

                <div className={styles.linksGrid}>
                    {quickLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className={`${styles.linkCard} ${styles[link.color]}`}
                        >
                            <div className={styles.linkIcon}>{link.icon}</div>
                            <span className={styles.linkLabel}>{link.label}</span>
                            <div className={styles.linkArrow}>→</div>
                        </a>
                    ))}
                </div>
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

            {/* Loading State */}
            {loading ? (
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p>Loading data...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.pending}`}>⏳</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Pending</p>
                                <h2 className={styles.statValue}>
                                    {reservations.filter(r => r.status === "PENDING").length}
                                </h2>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.ready}`}>📦</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Ready for Pickup</p>
                                <h2 className={styles.statValue}>
                                    {reservations.filter(r => r.status === "READY_FOR_PICKUP").length}
                                </h2>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.picked}`}>✅</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Picked Up</p>
                                <h2 className={styles.statValue}>
                                    {reservations.filter(r => r.status === "PICKED_UP").length}
                                </h2>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.cancelled}`}>❌</div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Cancelled</p>
                                <h2 className={styles.statValue}>
                                    {reservations.filter(r => r.status === "CANCELLED").length}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Reservations Section */}
                    <div className={styles.reservationsSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>All Reservations</h2>
                            <p className={styles.sectionSubtitle}>{filteredReservations.length} order(s)</p>
                        </div>

                        {/* Search and Filter */}
                        <div className={styles.controls}>
                            <div className={styles.searchBox}>
                                <span className={styles.searchIcon}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by user or book title..."
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
                                    Pending ({reservations.filter(r => r.status === "PENDING").length})
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filterStatus === "READY_FOR_PICKUP" ? styles.active : ""}`}
                                    onClick={() => setFilterStatus("READY_FOR_PICKUP")}
                                >
                                    Ready ({reservations.filter(r => r.status === "READY_FOR_PICKUP").length})
                                </button>
                                <button
                                    className={`${styles.filterBtn} ${filterStatus === "PICKED_UP" ? styles.active : ""}`}
                                    onClick={() => setFilterStatus("PICKED_UP")}
                                >
                                    Picked ({reservations.filter(r => r.status === "PICKED_UP").length})
                                </button>
                            </div>
                        </div>

                        {/* Reservations Grid */}
                        {filteredReservations.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>📭</span>
                                <h3>No reservations found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className={styles.reservationsGrid}>
                                {filteredReservations.map((reservation) => (
                                    <div key={reservation.id} className={`${styles.reservationCard} ${styles[getStatusColor(reservation.status)]}`}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.bookInfo}>
                                                <h3 className={styles.bookTitle}>📖 {reservation.book.title}</h3>
                                                <p className={styles.bookAuthor}>by {reservation.book.author}</p>
                                            </div>
                                            <span className={`${styles.statusBadge} ${styles[getStatusColor(reservation.status)]}`}>
                                                {getStatusLabel(reservation.status)}
                                            </span>
                                        </div>

                                        <div className={styles.userDetails}>
                                            <div className={styles.userDetail}>
                                                <span className={styles.detailIcon}>👤</span>
                                                <div>
                                                    <p className={styles.detailLabel}>User</p>
                                                    <p className={styles.detailValue}>{reservation.user.fullName}</p>
                                                </div>
                                            </div>
                                            <div className={styles.userDetail}>
                                                <span className={styles.detailIcon}>📧</span>
                                                <div>
                                                    <p className={styles.detailLabel}>Email</p>
                                                    <p className={styles.detailValue}>{reservation.user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {reservation.lockerId && (
                                            <div className={styles.lockerInfo}>
                                                <span className={styles.lockerIcon}>🔐</span>
                                                <div>
                                                    <p className={styles.lockerLabel}>Assigned Locker</p>
                                                    <p className={styles.lockerValue}>{reservation.locker?.name || `Locker ${reservation.lockerId}`}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className={styles.dateInfo}>
                                            <div className={styles.dateItem}>
                                                <span className={styles.dateLabel}>Reserved</span>
                                                <span className={styles.dateValue}>{formatDate(reservation.reservedDate)}</span>
                                            </div>
                                            {reservation.pickupDeadline && (
                                                <div className={styles.dateItem}>
                                                    <span className={styles.dateLabel}>Pickup By</span>
                                                    <span className={styles.dateValue}>{formatDate(reservation.pickupDeadline)}</span>
                                                </div>
                                            )}
                                            {reservation.pickedUpDate && (
                                                <div className={styles.dateItem}>
                                                    <span className={styles.dateLabel}>Picked Up</span>
                                                    <span className={styles.dateValue}>{formatDate(reservation.pickedUpDate)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.actions}>
                                            {reservation.status === "PENDING" && (
                                                <button
                                                    className={styles.assignBtn}
                                                    onClick={() => {
                                                        setSelectedReservation(reservation);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    📍 Assign Locker
                                                </button>
                                            )}
                                            {reservation.status === "READY_FOR_PICKUP" && (
                                                <button
                                                    className={styles.pickupBtn}
                                                    onClick={() => handlePickup(reservation.id)}
                                                >
                                                    ✓ Mark Picked Up
                                                </button>
                                            )}
                                            {(reservation.status === "PENDING" || reservation.status === "READY_FOR_PICKUP") && (
                                                <button
                                                    className={styles.cancelBtn}
                                                    onClick={() => handleCancel(reservation.id)}
                                                >
                                                    ✕ Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modal for Assigning Locker */}
            {showModal && selectedReservation && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>📍 Assign Locker</h2>
                            <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
                        </div>

                        <div className={styles.modalContent}>
                            <div className={styles.modalInfo}>
                                <p><strong>Book:</strong> {selectedReservation.book.title}</p>
                                <p><strong>User:</strong> {selectedReservation.user.fullName}</p>
                            </div>

                            <div className={styles.modalFormGroup}>
                                <label>Select Locker *</label>
                                <select
                                    value={selectedLocker}
                                    onChange={(e) => setSelectedLocker(e.target.value)}
                                    className={styles.modalSelect}
                                >
                                    <option value="">Choose a locker...</option>
                                    {lockers.map((locker) => (
                                        <option key={locker.id} value={locker.id}>
                                            {locker.name} - {locker.location} {locker.available ? "✅ Available" : "❌ Full"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button className={styles.confirmBtn} onClick={handleAssignLocker}>
                                    ✓ Assign Locker
                                </button>
                                <button className={styles.cancelModalBtn} onClick={() => setShowModal(false)}>
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