import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./login.module.scss";

const Login = () => {
    const [activeTab, setActiveTab] = useState("signin");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async () => {
        if (!form.email || !form.password || (activeTab === "signup" && !form.fullName)) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            if (activeTab === "signup") {
                // Sign up flow
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                    fullName: form.fullName,
                    username: form.email.split("@")[0],
                    email: form.email,
                    password: form.password
                });

                alert("Account created! You can now log in.");
                setForm({ fullName: "", email: "", password: "" });
                setActiveTab("signin");

            } else {
                // Sign in flow
                const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                    emailOrUsername: form.email, // <-- send this key
                    password: form.password
                });


                if (!res.data || !res.data.accessToken) {
                    throw new Error("Invalid credentials");
                }

                localStorage.setItem("token", res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                // redirect after successful login
                window.location.href = "/user/dashboard";
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* LEFT SIDE IMAGE + TEXT */}
            <div className={styles.left}>
                <img
                    src="https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?cs=srgb&dl=pexels-technobulka-2908984.jpg&fm=jpg"
                    alt="Library"
                    className={styles.leftImg}
                />
                <div className={styles.leftOverlay} />

                <div className={styles.leftText}>
                    <p>
                        Explore thousands of books. Learn, grow, and achieve excellence.
                    </p>
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            50,000+ Books
                        </div>
                        <div className={styles.feature}>
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Free Access
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className={styles.right}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <h2>
                            {activeTab === "signin" ? "Welcome back" : "Create account"}
                        </h2>
                        <p>
                            {activeTab === "signin"
                                ? "Sign in to continue your reading journey"
                                : "Join our community of book lovers"}
                        </p>
                    </div>

                    {/* TAB BUTTONS */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tabButton} ${
                                activeTab === "signin" ? styles.active : ""
                            }`}
                            onClick={() => setActiveTab("signin")}
                        >
                            Sign In
                        </button>

                        <button
                            className={`${styles.tabButton} ${
                                activeTab === "signup" ? styles.active : ""
                            }`}
                            onClick={() => setActiveTab("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* FORM */}
                    <div className={styles.form}>
                        {activeTab === "signup" && (
                            <input
                                name="fullName"
                                placeholder="Full Name"
                                onChange={handleChange}
                                value={form.fullName}
                                className={styles.input}
                            />
                        )}

                        <input
                            name="email"
                            placeholder="Email address"
                            onChange={handleChange}
                            value={form.email}
                            className={styles.input}
                        />

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={form.password}
                            className={styles.input}
                        />

                        {activeTab === "signin" && (
                            <div className={styles.forgotPassword}>
                                <a href="#">Forgot password?</a>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? (
                                <div className={styles.loadingContainer}>
                                    <div className={styles.spinner} />
                                    Loading...
                                </div>
                            ) : activeTab === "signin" ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>

                    <p className={styles.switchTab}>
                        {activeTab === "signin" ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={() => setActiveTab("signup")}>
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setActiveTab("signin")}>
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;