import React from 'react';
import { Search, BookOpen, Clock, Shield } from 'react-feather';
import './WhyChoose.css';

const WhyChoose = () => {
    return (
        <section className="whychoose-section">
            <div className="whychoose-container">

                {/* Header */}
                <div className="whychoose-header">
                    <h2>Why Choose Libra?</h2>
                    <p>
                        Experience library management reimagined with modern technology and elegant design
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="whychoose-cards">
                    <div className="card">
                        <div className="icon-container bg-primary-light">
                            <Search />
                        </div>
                        <h3>Smart Search</h3>
                        <p>Find your next read instantly with our intelligent search and filtering system</p>
                    </div>

                    <div className="card">
                        <div className="icon-container bg-accent-light">
                            <BookOpen />
                        </div>
                        <h3>Easy Borrowing</h3>
                        <p>Borrow books with a single click and manage your reading list effortlessly</p>
                    </div>

                    <div className="card">
                        <div className="icon-container bg-primary-light">
                            <Clock />
                        </div>
                        <h3>Real-Time Updates</h3>
                        <p>Stay informed with instant notifications about due dates and availability</p>
                    </div>

                    <div className="card">
                        <div className="icon-container bg-accent-light">
                            <Shield />
                        </div>
                        <h3>Secure & Reliable</h3>
                        <p>Your data is protected with enterprise-grade security and authentication</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
