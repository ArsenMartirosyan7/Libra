# Libra - Library Management System

A modern, full-stack web application for managing library operations including book cataloging, borrowing, and returns. Built with React and Spring Boot, featuring role-based access control and smart locker integration.

## 📚 Features

### Core Functionality
- **Book Browsing**: Search and explore the library's book collection with an intuitive interface
- **Borrowing System**: Seamless book checkout process with availability tracking
- **Return Management**: Easy book return workflow with due date monitoring
- **Smart Locker Integration**: Arduino-powered automated locker system for contactless book pickup (Optional)

### Role-Based Access Control
- **Admin**: Book catalog management, Borrowing oversight, Full system management, User administration and System configuration
- **Student**: Browse books, Manage borrowing history, Request books and Open the Locker

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot**
- **Spring Security** for authentication and authorization
- **Spring Data JPA** for database operations
- **Spring Web** for RESTful API endpoints
- **JWT** for secure token-based authentication
- **PostgreSQL** database

### Frontend
- **React** (Node.js 20)
- **Material-UI** for modern, responsive components
- **Axios** for API communication

### Hardware Integration (Optional)
- **Arduino** with serial communication for smart locker control

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 20 or higher
- PostgreSQL 12 or higher
- Arduino IDE (optional, for smart locker feature)

### Installation

#### 1. Clone the Repository
```bash
git clone "Link of the Github Repository"
cd libra
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE libra_db;
\q
```

#### 3. Backend Configuration
Create `application.yml` in `src/main/resources/`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/libra_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT Configuration
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000

# Server Configuration
server.port=8080
```

#### 4. Start Backend
```bash
# Navigate to backend directory
cd backend

# Run with Maven
./mvnw spring-boot:run

The backend will start on `http://localhost:8080`

#### 5. Frontend Configuration
Create `.env` in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080
```

#### 6. Start Frontend
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

### Database Seeding
The application includes sample data that will be automatically loaded on first run:
- Sample books with various genres and authors
- Default admin, librarian, and student accounts
- Sample borrowing records

**Default Login Credentials:**
- Admin: `admin@libra.com` / `admin123`
- User: `student@libra.com` / `student123`

> ⚠️ **Important**: Change these default passwords in production!

## 📡 API Endpoints

## Authentication
**Base URL:** `/api/auth`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | User login |

## Admin
**Base URL:** `/api/admin`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Books** | | |
| `POST` | `/books` | Add a new book |
| `PUT` | `/books/{id}` | Update a book |
| `DELETE` | `/books/{id}` | Delete a book |
| `GET` | `/books/{id}/availability` | Check book availability |
| **Users** | | |
| `GET` | `/users` | Get all users |
| **Borrowing** | | |
| `POST` | `/borrow/{bookId}/user/{userId}` | Borrow a book for a user |
| `POST` | `/return/{bookId}/user/{userId}` | Return a book for a user |
| `GET` | `/borrow-history` | Get global borrow history |
| **Reservations** | | |
| `POST` | `/reservations/{resId}/approve` | Approve a reservation |
| **Fees** | | |
| `GET` | `/late-fees` | Calculate late fees |

## Books
**Base URL:** `/api/books`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Get all books |
| `GET` | `/{id}` | Get book by ID |
| `POST` | `/` | Create a book (Admin only) |
| `PUT` | `/{id}` | Update a book (Admin only) |
| `DELETE` | `/{id}` | Delete a book (Admin only) |

## Users
**Base URL:** `/api/user`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/profile` | Get current user's profile |
| `GET` | `/borrowed-books` | Get current user's borrowed books |
| `GET` | `/reserved-books` | Get current user's reserved books |
| `GET` | `/` | Get all users |

## Smart Lockers
**Base URL:** `/api/lockers`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Get all lockers |
| `GET` | `/{id}` | Get locker by ID |
| `POST` | `/` | Create a new locker |
| `PUT` | `/{lockerId}/assign/{userId}` | Assign a locker to a user |
| `PUT` | `/{lockerId}/free` | Free a locker |
| `POST` | `/open` | Open specific locker |
```

## 🔐 Security

- JWT-based authentication with secure token generation
- Password encryption using BCrypt
- Role-based authorization for API endpoints
- CORS configuration for frontend-backend communication
- SQL injection prevention through JPA/Hibernate

## 🏗️ Project Structure

```
libra/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/bl/mb/
│   │   │       ├── config/          # Configuration classes
│   │   │       ├── controller/      # REST controllers
│   │   │       ├── dto/             # Data Transfer Objects
│   │   │       ├── filter/          # Request filters
│   │   │       ├── jwt/             # JWT handling
│   │   │       ├── models/          # Entity models
│   │   │       ├── repo/            # Repositories
│   │   │       ├── security/        # Security configuration
│   │   │       ├── service/         # Business logic services
│   │   │       └── Libra.java       # Main application class
│   │   └── resources/
│   │       └── ...
│   └── └── ...
├── libra-front/
│   ├── public/
│   ├── src/
│   │   ├── admin/               # Admin specific components/pages
│   │   ├── api/                 # API calls
│   │   ├── components/          # Shared components
│   │   ├── constants/           # Constant values
│   │   ├── hooks/               # Custom React hooks
│   │   ├── i18n/                # Internationalization
│   │   ├── pages/               # Main pages
│   │   ├── user/                # User specific components/pages
│   │   ├── App.js               # Main App component
│   │   └── index.js             # Entry point
│   ├── package.json
│   └── ...
├── docker-compose.yml           # Docker composition
├── Dockerfile                   # Docker build file
├── pom.xml                      # Maven build configuration
└── README.md
```
## 🎯 Current Status

### Completed Features ✅
- User authentication and authorization
- Book catalog management
- Borrowing and return system
- Role-based access control
- RESTful API implementation
- Responsive Material-UI interface

### In Progress 🚧
- Arduino smart locker integration
- Advanced search filters
- Email notifications
- Overdue book tracking

### Future Improvements 🔮
- Cloud deployment (AWS/Azure)
- Mobile application
- Book recommendations
- Analytics dashboard
- QR code scanning for quick checkout

## 🤝 Contributing

This is a university semester project. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of a university coursework assignment.

## 🙏 Acknowledgments

- University project supervisor
- Material-UI for the component library
- Spring Boot documentation
- React community

---

**Note**: This is a prototype developed for educational purposes. The smart locker feature requires additional hardware setup and is currently in development.
