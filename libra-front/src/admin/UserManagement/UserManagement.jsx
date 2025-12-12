import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserManagement.module.scss";

const initialFormState = {
    fullName: "",
    email: "",
    roles: [],
};

export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [editingUserId, setEditingUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const API_URL = process.env.REACT_APP_API_URL;

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/user`);
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleRolesChange = (e) => {
        const options = e.target.options;
        const selectedRoles = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) selectedRoles.push({ name: options[i].value });
        }
        setForm({ ...form, roles: selectedRoles });
    };

    // Add / Update user
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            if (editingUserId) {
                await axios.put(`/api/admin/users/${editingUserId}`, form);
                setSuccess("User updated successfully!");
            }
            setForm(initialFormState);
            setEditingUserId(null);
            fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Failed to update user. Please try again.");
        }
    };

    // Edit user
    const handleEdit = (user) => {
        setForm({
            fullName: user.fullName,
            email: user.email,
            roles: user.roles,
        });
        setEditingUserId(user.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cancel editing
    const handleCancel = () => {
        setForm(initialFormState);
        setEditingUserId(null);
    };

    // Delete user
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            setError(null);
            await axios.delete(`/api/admin/users/${id}`);
            setSuccess("User deleted successfully!");
            fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to delete user:", err);
            setError("Failed to delete user");
        }
    };

    // Get unique roles
    const roles = ["all", ...new Set(users.flatMap(u => u.roles).map(r => r.name))];

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || user.roles.some(r => r.name === filterRole);
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (roleName) => {
        switch(roleName) {
            case "ADMIN":
                return "admin";
            case "USER":
                return "user";
            default:
                return "default";
        }
    };

    const quickLinks = [
        { label: "Dashboard", href: "/admin/dashboard", icon: "📊", color: "blue" },
        { label: "Books", href: "/admin/book", icon: "📚", color: "blue" },
        { label: "Borrow / Return", href: "/admin/borrow", icon: "🔄", color: "green" },
        { label: "Reservations", href: "/admin/locker", icon: "🎫", color: "orange" },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>👥 Users Management</h1>
                <p className={styles.subtitle}>Manage user accounts and permissions</p>
            </div>

            <div className={styles.quickLinksSection}>
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

            <div className={styles.content}>
                {/* Form Section */}
                {editingUserId && (
                    <div className={styles.formSection}>
                        <div className={styles.formCard}>
                            <h2 className={styles.formTitle}>✏️ Edit User</h2>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="fullName">Full Name *</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter full name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="roles">Roles</label>
                                    <select
                                        id="roles"
                                        multiple
                                        value={form.roles.map((r) => r.name)}
                                        onChange={handleRolesChange}
                                        className={styles.multiSelect}
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                    <small className={styles.helperText}>Hold Ctrl/Cmd to select multiple roles</small>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <button type="submit" className={styles.submitBtn}>
                                        💾 Update User
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={handleCancel}
                                    >
                                        ✕ Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Users List Section */}
                <div className={styles.listSection}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.listTitle}>Users List</h2>
                        <p className={styles.listSubtitle}>{filteredUsers.length} user(s)</p>
                    </div>

                    {/* Search and Filter */}
                    <div className={styles.controls}>
                        <div className={styles.searchBox}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role === "all" ? "All Roles" : role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className={styles.loadingWrapper}>
                            <div className={styles.spinner}></div>
                            <p>Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>👨‍💼</span>
                            <h3>No users found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className={styles.usersGrid}>
                            {filteredUsers.map((user) => (
                                <div key={user.id} className={styles.userCard}>
                                    <div className={styles.userAvatar}>
                                        {user.fullName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className={styles.userInfo}>
                                        <h3 className={styles.userName}>{user.fullName}</h3>
                                        <p className={styles.userEmail}>
                                            <span className={styles.emailIcon}>📧</span>
                                            {user.email}
                                        </p>

                                        <div className={styles.rolesBadges}>
                                            {user.roles.length > 0 ? (
                                                user.roles.map((role, index) => (
                                                    <span
                                                        key={index}
                                                        className={`${styles.roleBadge} ${styles[getRoleBadgeColor(role.name)]}`}
                                                    >
                                                        {role.name === "ADMIN" ? "👑" : "👤"} {role.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className={`${styles.roleBadge} ${styles.default}`}>
                                                    No roles assigned
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className={styles.editBtn}
                                            title="Edit user"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className={styles.deleteBtn}
                                            title="Delete user"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};