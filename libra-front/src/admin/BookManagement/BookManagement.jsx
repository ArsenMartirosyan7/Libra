import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookManagement.module.scss";

const initialFormState = {
    title: "",
    author: "",
    category: "",
    description: "",
    coverImageUrl: "",
    publishedDate: "",
};

export const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [editingBookId, setEditingBookId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    // Fetch books from backend
    const fetchBooks = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/books`);
            setBooks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching books:', err);
            setError(err.message || 'Unexpected error occurred');
            setBooks([]); // fallback to empty array
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Add or Edit Book
    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookData = {
            ...form,
            available: form.available ?? true, // default to true if not set
        };

        try {
            setError(null);

            let response;

            if (editingBookId) {
                response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/api/books/${editingBookId}`,
                    bookData,
                    { headers: { "Content-Type": "application/json" } }
                );
                setSuccess("Book updated successfully!");
            } else {
                response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/books`,
                    bookData,
                    { headers: { "Content-Type": "application/json" } }
                );
                setSuccess("Book added successfully!");
            }

            console.log("Response:", response.data); // Debug log

            setForm(initialFormState);
            setEditingBookId(null);
            fetchBooks();

            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to save book:", err);
            setError(err.response?.data?.message || "Failed to save book. Please try again.");
        }
    };


    // Delete book
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            setError(null);
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/books/${id}`);
            setSuccess("Book deleted successfully!");
            fetchBooks();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error("Failed to delete book:", err);
            setError("Failed to delete book");
        }
    };

    // Edit book
    const handleEdit = (book) => {
        setForm({
            title: book.title,
            author: book.author,
            category: book.category,
            description: book.description,
            coverImageUrl: book.coverImageUrl,
            publishedDate: book.publishedDate,
        });
        setEditingBookId(book.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cancel editing
    const handleCancel = () => {
        setForm(initialFormState);
        setEditingBookId(null);
    };

    // Get unique categories
    const categories = ["all", ...new Set(books.map(b => b.category).filter(Boolean))];

    // Filter books
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || book.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const quickLinks = [
        { label: "Dashboard", href: "/admin/dashboard", icon: "📊", color: "blue" },
        { label: "Users", href: "/admin/user", icon: "👥", color: "purple" },
        { label: "Borrow / Return", href: "/admin/borrow", icon: "🔄", color: "green" },
        { label: "Locker Reservations", href: "/admin/locker", icon: "🎫", color: "orange" },
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>📚 Books Management</h1>
                <p className={styles.subtitle}>Add, edit, and manage your library's book collection</p>
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
                <div className={styles.formSection}>
                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>
                            {editingBookId ? "✏️ Edit Book" : "➕ Add New Book"}
                        </h2>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">Title *</label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        placeholder="Enter book title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="author">Author *</label>
                                    <input
                                        id="author"
                                        type="text"
                                        name="author"
                                        placeholder="Enter author name"
                                        value={form.author}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="category">Category</label>
                                    <input
                                        id="category"
                                        type="text"
                                        name="category"
                                        placeholder="e.g., Fiction, Science, History"
                                        value={form.category}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="publishedDate">Published Date</label>
                                    <input
                                        id="publishedDate"
                                        type="date"
                                        name="publishedDate"
                                        value={form.publishedDate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="coverImageUrl">Cover Image URL</label>
                                <input
                                    id="coverImageUrl"
                                    type="text"
                                    name="coverImageUrl"
                                    placeholder="https://example.com/cover.jpg"
                                    value={form.coverImageUrl}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter book description..."
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.submitBtn}>
                                    {editingBookId ? "💾 Update Book" : "➕ Add Book"}
                                </button>
                                {editingBookId && (
                                    <button
                                        type="button"
                                        className={styles.cancelBtn}
                                        onClick={handleCancel}
                                    >
                                        ✕ Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Books List Section */}
                <div className={styles.listSection}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.listTitle}>Book List</h2>
                        <p className={styles.listSubtitle}>{filteredBooks.length} book(s)</p>
                    </div>

                    {/* Search and Filter */}
                    <div className={styles.controls}>
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

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className={styles.filterSelect}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All Categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className={styles.loadingWrapper}>
                            <div className={styles.spinner}></div>
                            <p>Loading books...</p>
                        </div>
                    ) : filteredBooks.length === 0 ? (
                        <div className={styles.emptyState}>
                            <span className={styles.emptyIcon}>📭</span>
                            <h3>No books found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className={styles.booksGrid}>
                            {filteredBooks.map((book) => (
                                <div key={book.id} className={styles.bookCard}>
                                    <div className={styles.bookImage}>
                                        {book.coverImageUrl ? (
                                            <img
                                                src={book.coverImageUrl}
                                                alt={book.title}
                                                className={styles.image}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.querySelector('.imagePlaceholder').style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={styles.imagePlaceholder}>
                                            <span>📖</span>
                                        </div>
                                        <span className={`${styles.badge} ${book.available ? styles.available : styles.unavailable}`}>
                                            {book.available ? "Available" : "Unavailable"}
                                        </span>
                                    </div>

                                    <div className={styles.bookInfo}>
                                        <h3 className={styles.bookTitle}>{book.title}</h3>
                                        <p className={styles.bookAuthor}>by {book.author}</p>
                                        <p className={styles.bookCategory}>{book.category || "Uncategorized"}</p>
                                        {book.description && (
                                            <p className={styles.bookDescription}>{book.description}</p>
                                        )}
                                        <p className={styles.bookDate}>
                                            📅 {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "Unknown"}
                                        </p>
                                    </div>

                                    <div className={styles.actions}>
                                        <button
                                            onClick={() => handleEdit(book)}
                                            className={styles.editBtn}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className={styles.deleteBtn}
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

export default BookManagement;