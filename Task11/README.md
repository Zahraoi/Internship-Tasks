# Movopia - Netflix Clone

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.14.1-FFCA28?logo=firebase&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.2.1-764ABC?logo=redux&logoColor=white)

> A Netflix-inspired movie streaming application built with React.js, featuring authentication, movie discovery, watchlist management, and a cinematic user experience.

**Developed by Umam Zahra** | **Codematics Internship**

---

##  Features

###  Advanced Authentication
- Email/Password login and registration
- Google OAuth one-tap sign-in
- Password reset functionality
- Form validation with React Hook Form + Yup schema

###  Movie Discovery
- Smart search by title
- Multi-filter system (Genre, Quality, Rating, Year, Language)
- Multiple sorting options (Popularity, Top Rated, Latest, A-Z)
- Infinite scroll for seamless browsing
- Real-time search results

###  Cinematic Experience
- Hero carousel with trending movies
- Movie detail pages with full metadata
- Integrated YouTube trailer player
- IMDb-style ratings display
- Skeleton loading animations

###  Beautiful UI
- Netflix-inspired dark theme
- Clean light mode alternative
- Fully responsive design (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Toast notifications for feedback

###  Personalization
- Add/remove movies to watchlist
- Persistent watchlist storage (localStorage + Firebase backup)
- Heart icon favorites on movie cards
- Watchlist accessible from navigation

---

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **TanStack Query** | Server state & API caching |
| **Firebase 10** | Authentication & database |
| **React Router 6** | Client-side routing |
| **React Hook Form** | Form handling |
| **Yup** | Schema validation |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |

---

## Getting Started

### Prerequisites

- **Node.js** 16+ installed
- **npm** or **yarn** package manager
- **Firebase account** (free tier)
- **TMDB account** for API access (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd movie-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Setup

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# TMDB API Key (Optional - uses mock data if not provided)
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Navigate to **Authentication** → **Sign-in method**
   - Enable **Email/Password**
   - Enable **Google**
4. Navigate to **Firestore Database**
   - Create database (start in test mode)
5. Go to **Project Settings** → **General**
   - Copy the web app configuration to your `.env`

### TMDB API Setup (Optional)

1. Create account at [The Movie Database](https://www.themoviedb.org/)
2. Go to **Settings** → **API**
3. Generate your API key
4. Add to `.env` as `VITE_TMDB_API_KEY`

> **Note:** Without TMDB API key, the app uses built-in mock data for demonstration.

---

##  Project Structure

```
movie-app/
├── src/
│   ├── auth/                    # Authentication Module
│   │   ├── hooks/
│   │   │   └── useAuth.js       # Auth state hook
│   │   └── pages/
│   │       ├── Login.jsx        # Login page
│   │       └── Signup.jsx      # Registration page
│   │
│   ├── movies/                  # Movies Module
│   │   ├── components/
│   │   │   ├── Filters.jsx     # Filter dropdowns
│   │   │   ├── HeroCarousel.jsx # Hero banner
│   │   │   ├── MovieCard.jsx   # Movie card component
│   │   │   ├── MovieGrid.jsx   # Movie grid layout
│   │   │   └── MovieRow.jsx    # Horizontal row
│   │   ├── hooks/
│   │   │   ├── useMovieDetail.js
│   │   │   └── useMovies.js    # Movies query hook
│   │   └── pages/
│   │       ├── Home.jsx        # Home page
│   │       └── MovieDetail.jsx # Movie detail page
│   │
│   ├── watchlist/               # Watchlist Module
│   │   ├── components/
│   │   │   └── WatchlistItem.jsx
│   │   ├── hooks/
│   │   │   └── useWatchlist.js
│   │   └── pages/
│   │       └── Watchlist.jsx   # Watchlist page
│   │
│   ├── shared/                  # Shared Components
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── ForgotPasswordModal.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── ThemeToggle.jsx
│   │   └── styles/
│   │       └── globals.css     # Global styles
│   │
│   ├── services/
│   │   ├── firebase.js         # Firebase configuration
│   │   ├── mockData.js         # Mock movie data
│   │   └── tmdb.js            # TMDB API service
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js    # Auth state
│   │   │   ├── moviesSlice.js  # Movies & filters
│   │   │   ├── themeSlice.js   # Theme state
│   │   │   └── watchlistSlice.js
│   │   └── store.js            # Redux store
│   │
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── .env
```

---


##  Key Features Explained

### State Management (Redux Toolkit)

```javascript
// Store slices for different concerns
- authSlice    → User authentication state
- themeSlice   → Dark/Light mode
- moviesSlice  → Search, filters, sorting
- watchlistSlice → Users favorite movies
```

### Data Fetching (TanStack Query)

```javascript
// Automatic caching, background refetching
- useMovies()      → Fetch paginated movies
- useMovieDetail() → Fetch single movie
- useMovieTrailer()→ Fetch YouTube trailer key
- useGenres()      → Fetch genre list
```

### Image Handling

- TMDB image CDN for real movie posters
- Fallback to placehold.co for failed images
- Lazy loading with skeleton placeholders

### Responsive Design

| Breakpoint | Screen Size |
|-------------|-------------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

##  Troubleshooting

### Images not loading?
- Check if TMDB API key is valid
- Fallback placeholder service (placehold.co) handles missing images

### Firebase errors?
- Ensure Firestore rules allow read/write for authenticated users
- Check that Authentication is properly configured

### Theme not persisting?
- Theme state is saved to localStorage automatically

---

## License

This project is created for educational purposes as part of the **Codematics Internship** program.

