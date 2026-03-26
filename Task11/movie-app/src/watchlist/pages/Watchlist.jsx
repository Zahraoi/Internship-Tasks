import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Film } from 'lucide-react'
import useWatchlist from '../hooks/useWatchlist'
import WatchlistItem from '../components/WatchlistItem'
import Button from '../../shared/components/Button'

const Watchlist = () => {
  const { items, loading } = useWatchlist()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-48" />
            <div className="h-24 bg-gray-800 rounded-xl" />
            <div className="h-24 bg-gray-800 rounded-xl" />
            <div className="h-24 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-netflix-red/10 rounded-xl">
              <Heart className="w-8 h-8 text-netflix-red" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                My Watchlist
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {items.length} {items.length === 1 ? 'movie' : 'movies'} saved
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start adding movies to your watchlist by clicking the heart icon on any movie you want to save.
            </p>
            <Link to="/">
              <Button icon={Film}>
                Browse Movies
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((movie) => (
              <WatchlistItem key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
