import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./UserSidebar.module.scss";

export const UserSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "📊",
            path: "/user/dashboard",
            description: "Overview of your account"
        },
        {
            id: "profile",
            label: "Profile",
            icon: "👤",
            path: "/user/profile",
            description: "Manage your information"
        },
        {
            id: "available-books",
            label: "Available Books",
            icon: "📚",
            path: "/user/available-books",
            description: "Browse and reserve books"
        },
        {
            id: "borrowed",
            label: "My Books",
            icon: "📖",
            path: "/user/borrow-books",
            description: "View borrowed books"
        },
        {
            id: "reservations",
            label: "Reservations",
            icon: "🔖",
            path: "/user/borrow-books",
            description: "Manage reservations"
        },
        {
            id: "returns",
            label: "Returns",
            icon: "↩️",
            path: "/user/return",
            description: "Handle book returns"
        },
        {
            id: "locker",
            label: "Locker Orders",
            icon: "📦",
            path: "/user/locker-reservation",
            description: "Reserve and order books"
        },
        {
            id: "history",
            label: "Borrow History",
            icon: "📜",
            path: "/user/borrow-history",
            description: "View borrowing history"
        }
    ];

    const isActive = (path) => location.pathname === path;

    const handleNavigate = (path) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={styles.mobileToggle}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? "✕" : "☰"} Menu
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileOpen && (
                <div
                    className={styles.mobileOverlay}
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ""} ${!isOpen ? styles.collapsed : ""}`}>
                {/* Header */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🏛️</span>
                        {isOpen && <span className={styles.logoText}>Libra</span>}
                    </div>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setIsOpen(!isOpen)}
                        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isOpen ? "‹" : "›"}
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <div className={styles.navSection}>
                        {isOpen && <p className={styles.sectionTitle}>Main</p>}
                        {menuItems.slice(0, 3).map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
                                onClick={() => handleNavigate(item.path)}
                                title={!isOpen ? item.label : ""}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {isOpen && (
                                    <div className={styles.navText}>
                                        <span className={styles.navLabel}>{item.label}</span>
                                        <span className={styles.navDescription}>{item.description}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className={styles.navSection}>
                        {isOpen && <p className={styles.sectionTitle}>My Books</p>}
                        {menuItems.slice(3, 7).map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
                                onClick={() => handleNavigate(item.path)}
                                title={!isOpen ? item.label : ""}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {isOpen && (
                                    <div className={styles.navText}>
                                        <span className={styles.navLabel}>{item.label}</span>
                                        <span className={styles.navDescription}>{item.description}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className={styles.navSection}>
                        {isOpen && <p className={styles.sectionTitle}>History</p>}
                        {menuItems.slice(7).map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
                                onClick={() => handleNavigate(item.path)}
                                title={!isOpen ? item.label : ""}
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {isOpen && (
                                    <div className={styles.navText}>
                                        <span className={styles.navLabel}>{item.label}</span>
                                        <span className={styles.navDescription}>{item.description}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                {isOpen && (
                    <div className={styles.sidebarFooter}>
                        <div className={styles.footerCard}>
                            <p className={styles.footerTitle}>Need Help?</p>
                            <p className={styles.footerText}>Check our support center</p>
                            <button className={styles.helpBtn}>Support →</button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};