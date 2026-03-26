import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Play, Star } from 'lucide-react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { removeFromWatchlist } from '../../store/slices/watchlistSlice'
import { auth, db } from '../../services/firebase'
import { doc, deleteDoc } from 'firebase/firestore'

const WatchlistItem = ({ movie }) => {
  const dispatch = useDispatch()

  const handleRemove = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const user = auth.currentUser
      if (user) {
        const watchlistRef = doc(db, 'watchlist', user.uid, 'movies', String(movie.id))
        await deleteDoc(watchlistRef)
      }
      dispatch(removeFromWatchlist(movie.id))
      toast.success('Removed from watchlist')
    } catch (error) {
      console.error('Remove error:', error)
      dispatch(removeFromWatchlist(movie.id))
      toast.success('Removed from watchlist')
    }
  }

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl 
                 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex-shrink-0 w-20 sm:w-24">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover rounded-lg"
        />
      </div>

      <div className="flex-1 min-w-0 py-1">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-netflix-red transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
          {movie.release_date && (
            <span>{new Date(movie.release_date).getFullYear()}</span>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 hidden sm:block">
          {movie.overview}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault()
            window.location.href = `/movie/${movie.id}`
          }}
          className="p-2 bg-netflix-red text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Play className="w-5 h-5" />
        </button>
        <button
          onClick={handleRemove}
          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 
                     rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </Link>
  )
}

export default WatchlistItem
