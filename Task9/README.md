# Library Management System

A full-stack web application for managing library operations including book management, member management, and issue/return tracking.

## Features

### Core Features
- **Book Management**: Add, update, delete, view, and search books
- **Member Management**: Add, update, delete, view, and search members
- **Issue & Return System**: Issue books to members, return books with automatic availability updates
- **Due Date Tracking**: Set due dates for borrowed books
- **Late Return Fines**: Automatic fine calculation for late returns

### Additional Features
- **Dark Mode**: Toggle between light and dark themes
- **Admin Login**: Secure authentication for admin access
- **Responsive Design**: Works on all screen sizes
- **Real-time Search**: Search books by ID, title, or author

## Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database

## Project Structure

```
sostem/
├── server/                 # Backend
│   ├── index.js          # Express server
│   ├── models/           # MongoDB schemas
│   │   ├── Book.js
│   │   ├── Member.js
│   │   └── Issue.js
│   ├── routes/           # API routes
│   │   ├── bookRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── issueRoutes.js
│   │   └── auth.js
│   ├── .env              # Environment variables
│   └── package.json
├── client/               # Frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React contexts
│   │   ├── services/     # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

### 1. Clone the repository

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_EMAIL=admin@library.com
ADMIN_PASSWORD=admin123
```

### 4. Install Frontend Dependencies
```bash
cd client
npm install
```

## Running the Application

### Start Backend Server
```bash
cd server
npm start
```
Server runs on http://localhost:5000

### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend runs on http://localhost:5173

### Build for Production
```bash
cd client
npm run build
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/search?q=` | Search books |
| POST | `/api/books` | Add new book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |

### Members
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/members` | Get all members |
| GET | `/api/members/search?q=` | Search members |
| POST | `/api/members` | Add new member |
| PUT | `/api/members/:id` | Update member |
| DELETE | `/api/members/:id` | Delete member |

### Issues
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | Get all issue records |
| POST | `/api/issues` | Issue a book |
| PUT | `/api/issues/return/:id` | Return a book |

## Default Login Credentials

- **Email:** admin@library.com
- **Password:** admin123

## System Flow

1. Admin logs into dashboard
2. Admin adds books
3. Admin registers members
4. Admin issues book to member
5. System updates book availability
6. Member returns book
7. System updates records and calculates fines if late
8. Dark mode available for user preference

## Project Diagrams

Visual diagrams are provided in the `docs/` folder:

### To View Diagrams
Open `docs/index.html` in a web browser to see:
- **System Architecture Diagram** - Shows the complete system architecture with client, server, and database layers
- **Flowchart** - Shows the complete system flow from login to return

The diagrams visualize:
- Technology stack
- Data flow
- System components
- Process flow

## Author

**Umam Zahra**

## License

This project is for educational purposes.
