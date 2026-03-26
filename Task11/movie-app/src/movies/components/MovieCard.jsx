import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, Play } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { addToWatchlist, removeFromWatchlist } from '../../store/slices/watchlistSlice'
import { auth, db } from '../../services/firebase'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'

const LOCAL_STORAGE_KEY = 'movieStream_watchlist'

const getLocalWatchlist = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveLocalWatchlist = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

const MovieCard = ({ movie }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: watchlist } = useSelector((state) => state.watchlist)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isInWatchlist = watchlist.some(item => item.id === movie.id)

  const handleWatchlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please sign in to add to watchlist')
      return
    }

    const localWatchlist = getLocalWatchlist()
    const isInLocal = localWatchlist.some(item => item.id === movie.id)

    try {
      const watchlistRef = doc(db, 'watchlist', user.uid, 'movies', String(movie.id))

      if (isInWatchlist) {
        await deleteDoc(watchlistRef)
        dispatch(removeFromWatchlist(movie.id))
        
        const newLocal = localWatchlist.filter(item => item.id !== movie.id)
        saveLocalWatchlist(newLocal)
        
        toast.success('Removed from watchlist')
      } else {
        await setDoc(watchlistRef, {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          addedAt: new Date().toISOString()
        })
        dispatch(addToWatchlist(movie))
        
        const newLocal = [...localWatchlist, movie]
        saveLocalWatchlist(newLocal)
        
        toast.success('Added to watchlist!')
      }
    } catch (error) {
      console.warn('Firestore error, using localStorage fallback:', error.message)
      
      if (isInWatchlist) {
        dispatch(removeFromWatchlist(movie.id))
        const newLocal = localWatchlist.filter(item => item.id !== movie.id)
        saveLocalWatchlist(newLocal)
        toast.success('Removed from watchlist (offline)')
      } else {
        dispatch(addToWatchlist(movie))
        const newLocal = [...localWatchlist, movie]
        saveLocalWatchlist(newLocal)
        toast.success('Added to watchlist (offline)')
      }
    }
  }

  const getGenreNames = () => {
    const genreMap = {
      28: 'Action',
      12: 'Adventure',
      35: 'Comedy',
      80: 'Crime',
      18: 'Drama',
      878: 'Sci-Fi',
      27: 'Horror',
      9648: 'Mystery',
      10749: 'Romance',
      53: 'Thriller'
    }
    return movie.genre_ids?.slice(0, 2).map(id => genreMap[id] || 'Other').join(', ') || 'Movie'
  }

  return (
    <Link 
      to={`/movie/${movie.id}`}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
        isHovered ? 'scale-105 z-20 shadow-2xl' : 'shadow-lg'
      }`}>
        {!imageLoaded && (
          <div className="aspect-[2/3] bg-gray-700 animate-pulse" />
        )}
        <img
          src={movie.poster_path}
          alt={movie.title}
          className={`w-full aspect-[2/3] object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://placehold.co/500x750/1a1a2e/ffffff?text=No+Image'
            setImageLoaded(true)
          }}
        />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent 
          transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
              {movie.title}
            </h3>
            <p className="text-gray-300 text-xs mb-2">{getGenreNames()}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-medium">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400 text-xs">
                {movie.release_date?.split('-')[0]}
              </span>
              <span className="text-gray-400 text-xs border border-gray-500 px-1 rounded">
                {movie.quality || 'HD'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-netflix-red text-white text-xs font-semibold py-2 rounded flex items-center justify-center gap-1 hover:bg-red-700 transition-colors">
                <Play className="w-3 h-3" />
                Watch
              </button>
              <button
                onClick={handleWatchlistToggle}
                className={`p-2 rounded transition-colors ${
                  isInWatchlist 
                    ? 'bg-netflix-red text-white' 
                    : 'bg-black/50 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInWatchlist ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {!isHovered && (
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-gray-900 dark:text-white font-medium text-sm truncate">
          {movie.title}
        </h3>
        <p className="text-gray-500 text-xs">
          {movie.release_date?.split('-')[0]}
        </p>
      </div>
    </Link>
  )
}

export default MovieCard
