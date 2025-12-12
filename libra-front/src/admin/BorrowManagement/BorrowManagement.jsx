import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BorrowManagement.module.scss";

export const BorrowManagement = () => {
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    const [borrows, setBorrows] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedBook, setSelectedBook] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/user`);
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to fetch users");
        }
    };

    const fetchBooks = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/books`);
            setBooks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch books:", err);
            setError("Failed to fetch books");
        }
    };

    const fetchBorrows = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/borrow-history`);
            console.log("Borrows API response:", res.data);
            setBorrows(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch borrows:", err);
            setError("Failed to fetch borrow history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchUsers(), fetchBooks(), fetchBorrows()]);
            setLoading(false);
        };
        fetchAll();
    }, []);

    const handleBorrow = async () => {
        if (!selectedUser || !selectedBook) {
            setError("Please select both a user and a book");
            return;
        }
        try {
            setError(null);
            await axios.post(`${API_URL}/api/admin/borrow/${selectedBook}/user/${selectedUser}`);
            setSuccess("Book borrowed successfully!");
            await fetchBooks();
            await fetchBorrows();
            setSelectedUser("");
            setSelectedBook("");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to borrow book");
        }
    };

    const handleReturn = async (bookId, userId) => {
        if (!window.confirm("Confirm returning this book?")) return;
        try {
            setError(null);
            await axios.post(`${API_URL}/api/admin/return/${bookId}/user/${userId}`);
            setSuccess("Book returned successfully!");
            await fetchBooks();
            await fetchBorrows();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to return book");
        }
    };

    const filteredBorrows = borrows.filter(b => {
        const matchesStatus = filterStatus === "all" ||
            (filterStatus === "active" && !b.returnedOn) ||
            (filterStatus === "returned" && b.returnedOn);
        const matchesSearch =
            b.userFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const isOverdue = (dueDate, returnedOn) => {
        if (returnedOn) return false;
        return new Date(dueDate) < new Date();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const quickLinks = [
        { label: "Dashboard", href: "/admin/dashboard", icon: "📊", color: "blue" },
        { label: "Books", href: "/admin/book", icon: "📚", color: "blue" },
        { label: "Users", href: "/admin/user", icon: "👥", color: "purple" },
        { label: "Locker Reservations", href: "/admin/locker", icon: "🎫", color: "orange" },
    ];

    return (
        <div className={styles.container}>
            {/* Header and Quick Links */}
            <div className={styles.header}>
                <h1 className={styles.title}>📚 Borrow / Return Management</h1>
                <p className={styles.subtitle}>Manage book borrowing and returns</p>
            </div>

            <div className={styles.quickLinksSection}>
                <div className={styles.linksGrid}>
                    {quickLinks.map((link, idx) => (
                        <a key={idx} href={link.href} className={`${styles.linkCard} ${styles[link.color]}`}>
                            <div className={styles.linkIcon}>{link.icon}</div>
                            <span className={styles.linkLabel}>{link.label}</span>
                            <div className={styles.linkArrow}>→</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Success/Error messages */}
            {success && <div className={styles.successBanner}><span>✅</span><p>{success}</p></div>}
            {error && <div className={styles.errorBanner}><span>⚠️</span><p>{error}</p></div>}

            {/* Loading state */}
            {loading ? (
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p>Loading data...</p>
                </div>
            ) : (
                <>
                    {/* Borrow Form */}
                    <div className={styles.formSection}>
                        <div className={styles.formCard}>
                            <h2 className={styles.formTitle}>➕ Borrow New Book</h2>
                            <p className={styles.formSubtitle}>Select a user and book</p>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>User *</label>
                                    <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className={styles.select}>
                                        <option value="">Choose a user...</option>
                                        {users.map(u => (
                                            <option key={u.id} value={u.id}>
                                                👤 {u.fullName} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Book *</label>
                                    <select value={selectedBook} onChange={e => setSelectedBook(e.target.value)} className={styles.select}>
                                        <option value="">Choose a book...</option>
                                        {books.map(b => (
                                            <option key={b.id} value={b.id}>
                                                📖 {b.title} {b.available ? "✅" : "❌"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleBorrow} className={styles.borrowBtn}>✓ Borrow Book</button>
                        </div>
                    </div>

                    {/* Borrowing History */}
                    <div className={styles.historySection}>
                        <div className={styles.historyHeader}>
                            <h2 className={styles.historyTitle}>Borrowing History</h2>
                            <p>{filteredBorrows.length} record(s)</p>
                        </div>

                        <div className={styles.controls}>
                            <input
                                type="text"
                                placeholder="Search by user or book..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                            <div className={styles.filterButtons}>
                                <button className={`${styles.filterBtn} ${filterStatus==="all"?styles.active:""}`} onClick={()=>setFilterStatus("all")}>All ({borrows.length})</button>
                                <button className={`${styles.filterBtn} ${filterStatus==="active"?styles.active:""}`} onClick={()=>setFilterStatus("active")}>Active ({borrows.filter(b=>!b.returnedOn).length})</button>
                                <button className={`${styles.filterBtn} ${filterStatus==="returned"?styles.active:""}`} onClick={()=>setFilterStatus("returned")}>Returned ({borrows.filter(b=>b.returnedOn).length})</button>
                            </div>
                        </div>

                        {filteredBorrows.length === 0 ? (
                            <div className={styles.emptyState}>📭 No records</div>
                        ) : (
                            <div className={styles.borrowsGrid}>
                                {filteredBorrows.map(b => (
                                    <div key={b.borrowId} className={`${styles.borrowCard} ${isOverdue(b.dueDate,b.returnedOn)?styles.overdue:""}`}>
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <h3>📖 {b.bookTitle}</h3>
                                                <p>👤 {b.userFullName}</p>
                                            </div>
                                            <div>
                                                {b.returnedOn ? "✓ Returned" : isOverdue(b.dueDate,b.returnedOn) ? "⚠️ Overdue" : "📍 Active"}
                                            </div>
                                        </div>
                                        <div className={styles.cardDates}>
                                            <div>Borrowed: {formatDate(b.borrowedOn)}</div>
                                            <div>Due: {formatDate(b.dueDate)}</div>
                                            <div>Returned: {formatDate(b.returnedOn)}</div>
                                        </div>
                                        {!b.returnedOn && <button onClick={()=>handleReturn(b.bookId,b.userId)}>↩️ Return</button>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default BorrowManagement;
