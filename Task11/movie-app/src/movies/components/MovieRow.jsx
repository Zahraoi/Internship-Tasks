import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, TrendingUp, Star, Calendar } from 'lucide-react'
import MovieCard from './MovieCard'

const MovieRow = ({ title, movies, icon: Icon, viewAllLink }) => {
  const scrollContainerRef = React.useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-netflix-red" />}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-netflix-red transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 hover:bg-black/90 
                     rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300
                     -translate-x-2 group-hover:translate-x-0"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/70 hover:bg-black/90 
                     rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300
                     translate-x-2 group-hover:translate-x-0"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export const TrendingRow = ({ movies }) => (
  <MovieRow 
    title="Trending Now" 
    movies={movies} 
    icon={TrendingUp}
    viewAllLink="/"
  />
)

export const TopRatedRow = ({ movies }) => (
  <MovieRow 
    title="Top Rated" 
    movies={movies} 
    icon={Star}
    viewAllLink="/"
  />
)

export const RecentRow = ({ movies }) => (
  <MovieRow 
    title="Recently Added" 
    movies={movies} 
    icon={Calendar}
    viewAllLink="/"
  />
)

export default MovieRow
