import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const HeroCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [imgError, setImgError] = React.useState(false)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  if (!movies || movies.length === 0) return null

  const currentMovie = movies[currentIndex]

  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={imgError ? 'https://placehold.co/1280x720/1a1a2e/ffffff?text=No+Image' : (currentMovie.backdrop_path || currentMovie.poster_path)}
          alt={currentMovie.title}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-netflix-red text-white text-sm font-semibold rounded">
                NETFLIX ORIGINAL
              </span>
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm font-medium">
                  {currentMovie.vote_average.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-300 text-sm">
                {currentMovie.release_date?.split('-')[0]}
              </span>
              <span className="text-gray-300 text-sm border border-gray-500 px-2 py-0.5 rounded">
                {currentMovie.quality || 'HD'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {currentMovie.title}
            </h1>

            {currentMovie.tagline && (
              <p className="text-lg text-gray-300 italic mb-4">
                "{currentMovie.tagline}"
              </p>
            )}

            <p className="text-gray-300 text-base line-clamp-3 mb-6">
              {currentMovie.overview}
            </p>

            <div className="flex items-center gap-4">
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-2 px-8 py-3 bg-netflix-red text-white font-semibold rounded-lg
                          hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Watch Now
              </Link>
              <Link
                to={`/movie/${currentMovie.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-lg
                          hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 
                   rounded-full text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 
                   rounded-full text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-netflix-red w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
