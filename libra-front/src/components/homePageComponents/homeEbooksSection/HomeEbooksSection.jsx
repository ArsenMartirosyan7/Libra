import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomeEbooksStyle.module.scss";

const HomeEbooksComponent = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchBooks = async () => {
        setLoading(true);
        const res = await fetch(`https://gutendex.com/books/?page=1`);
        const data = await res.json();
        setBooks(data.results.slice(0, 4)); // Show only 4 books
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div className={styles.homeEbooks}>
            <div className={styles.sectionHeader}>
                <h2>Featured E-Books</h2>
                <p>Explore our handpicked collection of free e-books</p>
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading eBooks...</p>
                </div>
            ) : (
                <>
                    <div className={styles.booksGrid}>
                        {books.map((book) => (
                            <div key={book.id} className={styles.bookCard}>
                                <div className={styles.bookCoverWrapper}>
                                    <img
                                        src={book.formats["image/jpeg"]}
                                        alt={book.title}
                                        className={styles.bookCover}
                                        onError={(e) => {
                                            e.target.src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect fill='%23e2e8f0' width='200' height='300'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3ENo Cover%3C/text%3E%3C/svg%3E";
                                        }}
                                    />
                                </div>
                                <h3 className={styles.bookTitle}>{book.title}</h3>
                                <p className={styles.bookAuthor}>
                                    {book.authors.length > 0
                                        ? book.authors.map((a) => a.name).join(", ")
                                        : "Unknown Author"}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.viewMoreWrapper}>
                        <button
                            className={styles.viewMoreBtn}
                            onClick={() => navigate("/login")}
                        >
                            View More
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeEbooksComponent;
