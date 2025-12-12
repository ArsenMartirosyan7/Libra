import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./UserProfile.module.scss";
import { UserSidebar } from '../sidebar/UserSidebar';
import { Outlet } from 'react-router-dom';

export const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch user profile
            const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            // Save to state
            setUser(userRes.data);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            setError("Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await axios.put("/api/user/profile", formData);
            setUser(formData);
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError(err.response?.data?.message || "Failed to update profile");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setError(null);
            await axios.post("/api/user/change-password", {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setSuccess("Password changed successfully!");
            setShowPasswordModal(false);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to change password:", err);
            setError(err.response?.data?.message || "Failed to change password");
        }
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <span className={styles.errorIcon}>⚠️</span>
                    <p>{error}</p>
                    <button onClick={fetchUserProfile} className={styles.retryBtn}>
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
                {/* Profile Header Card */}
                <div className={styles.headerCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {user?.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.headerInfo}>
                            <h1 className={styles.name}>{user?.fullName}</h1>
                            <p className={styles.email}>{user?.email}</p>
                            <p className={styles.memberSince}>
                                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                            </p>
                        </div>
                    </div>
                    <button
                        className={styles.editHeaderBtn}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "✕ Cancel" : "✏️ Edit"}
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className={styles.mainGrid}>
                    {/* Profile Information */}
                    <div className={styles.profileCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>👤 Personal Information</h2>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="fullName">Full Name</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="address">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address || ""}
                                        onChange={handleInputChange}
                                        placeholder="Enter your address"
                                        rows="3"
                                    />
                                </div>

                                <div className={styles.formActions}>
                                    <button type="submit" className={styles.saveBtn}>
                                        💾 Save Changes
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
                        ) : (
                            <div className={styles.infoGrid}>
                                <div className={styles.infoItem}>
                                    <p className={styles.infoLabel}>Full Name</p>
                                    <p className={styles.infoValue}>{user?.fullName || "—"}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <p className={styles.infoLabel}>Email</p>
                                    <p className={styles.infoValue}>{user?.email || "—"}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <p className={styles.infoLabel}>Phone Number</p>
                                    <p className={styles.infoValue}>{user?.phone || "Not provided"}</p>
                                </div>
                                <div className={styles.infoItem}>
                                    <p className={styles.infoLabel}>Address</p>
                                    <p className={styles.infoValue}>{user?.address || "Not provided"}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Account Security */}
                    <div className={styles.securityCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>🔐 Account Security</h2>
                        </div>

                        <div className={styles.securityContent}>
                            <div className={styles.securityItem}>
                                <div className={styles.securityIcon}>🔑</div>
                                <div className={styles.securityInfo}>
                                    <h3>Change Password</h3>
                                    <p>Update your password regularly to keep your account secure</p>
                                </div>
                                <button
                                    className={styles.securityBtn}
                                    onClick={() => setShowPasswordModal(true)}
                                >
                                    Change
                                </button>
                            </div>

                            <div className={styles.securityItem}>
                                <div className={styles.securityIcon}>📧</div>
                                <div className={styles.securityInfo}>
                                    <h3>Email Verification</h3>
                                    <p>Your email is verified and secure</p>
                                </div>
                                <span className={styles.verifiedBadge}>✓ Verified</span>
                            </div>

                            <div className={styles.securityItem}>
                                <div className={styles.securityIcon}>⏱️</div>
                                <div className={styles.securityInfo}>
                                    <h3>Last Login</h3>
                                    <p>{user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div className={styles.statsCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>📊 Account Statistics</h2>
                        </div>

                        <div className={styles.statsContent}>
                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>📚</div>
                                <div className={styles.statData}>
                                    <p className={styles.statNumber}>0</p>
                                    <p className={styles.statLabel}>Books Borrowed</p>
                                </div>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>🔖</div>
                                <div className={styles.statData}>
                                    <p className={styles.statNumber}>0</p>
                                    <p className={styles.statLabel}>Reservations</p>
                                </div>
                            </div>

                            <div className={styles.statItem}>
                                <div className={styles.statIcon}>⭐</div>
                                <div className={styles.statData}>
                                    <p className={styles.statNumber}>5</p>
                                    <p className={styles.statLabel}>Member Tier</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className={styles.preferencesCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>⚙️ Preferences</h2>
                        </div>

                        <div className={styles.preferencesList}>
                            <div className={styles.preferenceItem}>
                                <div>
                                    <h3>Email Notifications</h3>
                                    <p>Receive updates about your reservations and borrowed books</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" defaultChecked={true} />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>

                            <div className={styles.preferenceItem}>
                                <div>
                                    <h3>SMS Notifications</h3>
                                    <p>Get SMS alerts for locker arrivals and due date reminders</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" defaultChecked={false} />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>

                            <div className={styles.preferenceItem}>
                                <div>
                                    <h3>Newsletter</h3>
                                    <p>Subscribe to our weekly book recommendations</p>
                                </div>
                                <label className={styles.toggle}>
                                    <input type="checkbox" defaultChecked={true} />
                                    <span className={styles.toggleSlider}></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={styles.dangerCard}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>⚠️ Danger Zone</h2>
                        </div>

                        <div className={styles.dangerContent}>
                            <button className={styles.deleteAccountBtn}>
                                🗑️ Delete Account
                            </button>
                            <p className={styles.dangerWarning}>
                                This action cannot be undone. All your data will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>🔑 Change Password</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setShowPasswordModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleChangePassword} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your current password"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your new password"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm your new password"
                                    required
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.confirmBtn}>
                                    ✓ Change Password
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelModalBtn}
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    ✕ Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};