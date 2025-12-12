import { useState, useEffect } from 'react';
import styles from './Book.module.scss';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Book = () => {
    const [books, setBooks] = useState([]); // always start with an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const navigate = useNavigate();

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

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingWrapper}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Discovering amazing books...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorWrapper}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
                    <p className={styles.errorMessage}>{error}</p>
                    <button onClick={fetchBooks} className={styles.retryBtn}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
            </div>

            {books.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📚</div>
                    <h2>No Books Available</h2>
                    <p>Check back soon for new titles!</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {books.map((book) => (
                        <div key={book.id} className={styles.card}>
                            <div className={styles.cardImage}>
                                {book.coverImageUrl && book.coverImageUrl.trim() !== '' ? (
                                    <img
                                        src={book.coverImageUrl}
                                        alt={book.title}
                                        className={styles.image}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={styles.imagePlaceholder} style={book.coverImageUrl && book.coverImageUrl.trim() !== '' ? { display: 'none' } : {}}>
                                    <span>📖</span>
                                </div>
                                <div className={`${styles.badge} ${book.available ? styles.available : styles.unavailable}`}>
                                    {book.available ? 'Available' : 'Unavailable'}
                                </div>
                            </div>

                            <div className={styles.cardContent}>
                                <div className={styles.category}>{book.category || 'Uncategorized'}</div>
                                <h2 className={styles.cardTitle}>{book.title}</h2>
                                <p className={styles.author}>by {book.author}</p>

                                {book.description && (
                                    <p className={styles.description}>{book.description}</p>
                                )}

                                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <span className={styles.metaIcon}>📅</span>
                      {formatDate(book.publishedDate)}
                  </span>
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <button className={styles.viewBtn} onClick={() => navigate('/login')}>
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Book;
