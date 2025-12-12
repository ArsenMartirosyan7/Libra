import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.scss";

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        borrowedBooks: 0,
        lateFees: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const booksRes = await axios.get(`${API_URL}/api/books`);
                const usersRes = await axios.get(`${API_URL}/api/user`);




                setStats({
                    totalBooks: booksRes.data.length,
                    totalUsers: usersRes.data.length,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setError("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const quickLinks = [
        { label: "Books", href: "/admin/book", icon: "📚", color: "blue" },
        { label: "Users", href: "/admin/user", icon: "👥", color: "purple" },
        { label: "Borrow / Return", href: "/admin/borrow", icon: "🔄", color: "green" },
        { label: "Locker Reservations", href: "/admin/locker", icon: "🎫", color: "orange" },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>Admin Dashboard</h1>
                    <p className={styles.subtitle}>Welcome back! Here's your library overview</p>
                </div>
                <div className={styles.headerIcon}>👨‍💼</div>
            </div>

            {/* Error State */}
            {error && (
                <div className={styles.errorBanner}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p>Loading dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.iconBooks}`}>
                                📚
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Total Books</p>
                                <h2 className={styles.statValue}>{stats.totalBooks}</h2>
                            </div>
                            <div className={styles.statBg}></div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.iconUsers}`}>
                                👥
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Total Users</p>
                                <h2 className={styles.statValue}>{stats.totalUsers}</h2>
                            </div>
                            <div className={styles.statBg}></div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.iconBorrow}`}>
                                🔄
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Borrowed Books</p>
                                <h2 className={styles.statValue}>25</h2>
                            </div>
                            <div className={styles.statBg}></div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.iconFees}`}>
                                💰
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.statLabel}>Late Fees</p>
                                <h2 className={styles.statValue}>$259.82</h2>
                            </div>
                            <div className={styles.statBg}></div>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className={styles.quickLinksSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Quick Links</h2>
                            <p className={styles.sectionSubtitle}>Access key management features</p>
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

                    {/* Footer Info */}
                    <div className={styles.footerInfo}>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>ℹ️</span>
                            <div>
                                <h3>System Status</h3>
                                <p>All systems operational</p>
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <span className={styles.infoIcon}>🔔</span>
                            <div>
                                <h3>Last Updated</h3>
                                <p>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};