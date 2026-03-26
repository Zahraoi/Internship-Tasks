import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Home, 
  Search, 
  Heart, 
  LogIn, 
  LogOut, 
  User, 
  Menu, 
  X,
  Film
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { logout } from '../../store/slices/authSlice'
import { setSearchQuery, resetFilters } from '../../store/slices/moviesSlice'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { searchQuery } = useSelector((state) => state.movies)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const searchInputRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      dispatch(logout())
      setIsMobileMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    const searchTerm = localSearch.trim()
    dispatch(setSearchQuery(searchTerm))
    if (location.pathname !== '/') {
      navigate('/')
    }
    setIsSearchOpen(false)
    
    setTimeout(() => {
      const browseSection = document.getElementById('browse-section')
      if (browseSection) {
        browseSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }

  const handleClearSearch = () => {
    setLocalSearch('')
    dispatch(setSearchQuery(''))
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleNavClick = (path) => {
    dispatch(resetFilters())
    setLocalSearch('')
    navigate(path)
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Movies', path: '/', icon: Film },
    ...(user ? [{ name: 'Watchlist', path: '/watchlist', icon: Heart }] : []),
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => handleNavClick('/')} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-netflix-red rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">
                Movopia
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-netflix-red bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <ThemeToggle />

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-300" />
                    )}
                    <span className="text-sm text-gray-300 max-w-[100px] truncate">
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm !py-2">
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsSearchOpen(true)
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                <Search className="w-5 h-5" />
                Search Movies
              </button>
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-netflix-red bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </button>
              ))}
              
              {!user && (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-netflix-red text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setIsSearchOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies by title..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && localSearch.trim()) {
                    handleSearch()
                  }
                }}
                className="w-full pl-14 pr-14 py-5 bg-transparent text-white text-xl placeholder:text-gray-500 focus:outline-none"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('')
                    searchInputRef.current?.focus()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={handleSearch}
                disabled={!localSearch.trim()}
                className="w-full py-3 bg-netflix-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search{localSearch.trim() ? ` for "${localSearch.trim()}"` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
