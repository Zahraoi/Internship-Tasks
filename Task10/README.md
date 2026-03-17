# Personal Finance Dashboard

A full-stack web application for managing personal finances including expense tracking, budget management, and data visualization.

## Features

### Core Features
- **Transaction Management**: Add, update, delete, view, and search transactions with categories
- **Budget Management**: Set monthly budgets with visual progress bars and alerts
- **Data Visualization**: Monthly trends bar chart and category breakdown pie chart with Recharts
- **Month Filtering**: Filter transactions and budgets by specific month
- **Reports**: Clickable charts for detailed expense analysis

### Additional Features
- **Dark Mode**: Toggle between light and dark themes
- **User Login**: Secure authentication for user access
- **Responsive Design**: Works on all screen sizes
- **CSV Export**: Download transactions as CSV file
- **Undo/Redo**: Revert and redo transaction actions
- **Debounced Search**: Search transactions efficiently
- **Currency in PKR (Rs.)**: All amounts displayed in Pakistani Rupees
- **Sidebar Navigation**: Smooth scroll to Transactions and Budget sections with highlight animation

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database

## Project Structure

```
Task10/
├── backend/                 # Backend
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── budgets.js
│   ├── .env               # Environment variables
│   └── package.json
├── frontend/               # Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── BudgetSection.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/        # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── TransactionContext.jsx
│   │   ├── hooks/          # Custom hooks
│   │   │   └── useDebounce.js
│   │   ├── utils/          # Utility functions
│   │   │   └── currency.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm

## Installation

### 1. Clone the repository

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions?category=&startDate=&endDate=&search=` | Get transactions with filters |
| POST | `/api/transactions` | Add new transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/export/csv` | Export transactions as CSV |

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets` | Get all budgets |
| POST | `/api/budgets` | Set/update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
| GET | `/api/budgets/summary?month=` | Get budget summary with spending |

## Creating an Account

Since this is a login-only system, you'll need to create your first user via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

Or use Postman/Thunder Client to send a POST request to `/api/auth/register`.

## System Flow

1. User registers an account
2. User logs into dashboard
3. User adds transactions (income/expense)
4. User sets monthly budgets
5. User views summary cards (income, expense, balance)
6. User filters data by month
7. User searches transactions
8. User exports data as CSV
9. User views reports with charts
10. User can undo/redo actions
11. Dark mode available for user preference



## Author


Umam Zahra


## License

This project is for educational purposes.
