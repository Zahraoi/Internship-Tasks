import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebase'
import { setUser, setLoading } from './store/slices/authSlice'
import { useDispatch } from 'react-redux'
import Navbar from './shared/components/Navbar'
import ProtectedRoute from './shared/components/ProtectedRoute'
import Login from './auth/pages/Login'
import Signup from './auth/pages/Signup'
import Home from './movies/pages/Home'
import MovieDetail from './movies/pages/MovieDetail'
import Watchlist from './watchlist/pages/Watchlist'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(setLoading(true))
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user))
      } else {
        dispatch(setUser(null))
      }
    })
    return () => unsubscribe()
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-white dark:bg-netflix-black text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route 
          path="/watchlist" 
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

export default App
