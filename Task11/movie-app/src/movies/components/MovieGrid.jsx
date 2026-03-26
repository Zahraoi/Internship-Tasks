import React from 'react'
import { useSelector } from 'react-redux'
import { Search, Filter, AlertCircle, RefreshCw } from 'lucide-react'
import MovieCard from './MovieCard'

const MovieGrid = ({ movies, isLoading, loadMore, hasMore, totalMovies = 0, error = null, refetch }) => {
  const { searchQuery, selectedGenre, selectedQuality, selectedRating, selectedYear, selectedLanguage } = useSelector((state) => state.movies)

  const hasFilters = searchQuery || selectedGenre !== 'all' || selectedQuality !== 'all' || 
                     selectedRating !== 'all' || selectedYear !== 'all' || selectedLanguage !== 'all'

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Movies
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
          {error}
        </p>
        {refetch && (
          <button
            onClick={refetch}
            className="px-6 py-3 bg-netflix-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        )}
      </div>
    )
  }

  if (isLoading && (!movies || movies.length === 0)) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-lg" />
            <div className="mt-2 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          {hasFilters ? (
            <Filter className="w-10 h-10 text-gray-400" />
          ) : (
            <Search className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {hasFilters ? 'No movies match your filters' : 'No movies found'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {hasFilters 
            ? 'Try adjusting your search or filters to find more movies'
            : 'Please check your API connection and try again'
          }
        </p>
        {hasFilters && (
          <div className="text-sm text-gray-400 space-y-1">
            {searchQuery && <p>Searching for: "{searchQuery}"</p>}
            {selectedGenre !== 'all' && <p>Genre: {selectedGenre}</p>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {totalMovies > 0 && (
        <p className="text-gray-400 text-sm mb-4">
          Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
          {searchQuery && ` for "${searchQuery}"`}
          {totalMovies > movies.length && ` (${totalMovies} total)`}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg font-medium
                     hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50
                     inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Movies'
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default MovieGrid
