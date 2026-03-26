import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Play, 
  Heart, 
  Clock, 
  Calendar, 
  Star, 
  Globe, 
  Film,
  ChevronLeft,
  X,
  ThumbsUp,
  Share2,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useMovieDetail, useMovieTrailer } from '../hooks/useMovieDetail'
import { useGenres } from '../hooks/useMovies'
import { addToWatchlist, removeFromWatchlist } from '../../store/slices/watchlistSlice'
import { auth, db } from '../../services/firebase'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'
import Skeleton from '../../shared/components/Skeleton'
import Button from '../../shared/components/Button'

const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: watchlist } = useSelector((state) => state.watchlist)
  const { data: movie, isLoading, error } = useMovieDetail(id)
  const { data: trailer } = useMovieTrailer(id)
  const { data: genres } = useGenres()
  
  const [showTrailer, setShowTrailer] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const isInWatchlist = watchlist.some(item => item.id === movie?.id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast.error('Please sign in to add to watchlist')
      return
    }

    try {
      const watchlistRef = doc(db, 'watchlist', user.uid, 'movies', String(movie.id))

      if (isInWatchlist) {
        await deleteDoc(watchlistRef)
        dispatch(removeFromWatchlist(movie.id))
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
        toast.success('Added to watchlist!')
      }
    } catch (error) {
      console.error('Watchlist error:', error)
      dispatch(addToWatchlist(movie))
      toast.success('Added to watchlist!')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.overview,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const getGenreNames = () => {
    if (movie?.genres && Array.isArray(movie.genres)) {
      return movie.genres.map(g => g.name)
    }
    if (!movie?.genre_ids || !genres) return []
    const genreMap = genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name
      return acc
    }, {})
    return movie.genre_ids.map(id => genreMap[id]).filter(Boolean)
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <Link to="/" className="text-netflix-red hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <Skeleton variant="detail" />
  }

  if (!movie) return null

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="relative h-[60vh] min-h-[400px] max-h-[600px]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          <img
            src={movie.backdrop_path || movie.poster_path}
            alt={movie.title}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/80 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-64 md:w-80 rounded-xl shadow-2xl mx-auto lg:mx-0"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg text-gray-400 italic mb-4">
                "{movie.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-white font-bold">
                  {movie.vote_average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">/10</span>
              </div>
              
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.release_date?.split('-')[0]}
              </span>
              
              {movie.runtime && (
                <span className="text-gray-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}

              <span className="text-gray-400 flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {movie.original_language?.toUpperCase() || 'EN'}
              </span>

              <span className="px-2 py-1 border border-gray-500 text-gray-400 text-sm rounded">
                {movie.quality || 'HD'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {getGenreNames().map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white/10 text-white text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={() => setShowTrailer(true)}
                icon={Play}
                className="!py-4 !px-8"
              >
                Watch Trailer
              </Button>

              <Button
                onClick={handleWatchlistToggle}
                variant={isInWatchlist ? 'primary' : 'secondary'}
                icon={Heart}
                className={`!py-4 !px-8 ${isInWatchlist ? '!bg-green-600 hover:!bg-green-700' : ''}`}
              >
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </Button>

              <Button
                onClick={handleShare}
                variant="ghost"
                icon={Share2}
                className="!py-4 !px-4"
              >
                Share
              </Button>
            </div>

            <div className="border-t border-gray-700 pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <ThumbsUp className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Rate this movie:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <p className="text-white font-medium">{movie.status || 'Released'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Release Date</p>
                  <p className="text-white font-medium">
                    {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Vote Count</p>
                  <p className="text-white font-medium">{movie.vote_count?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Popularity</p>
                  <p className="text-white font-medium">{movie.popularity?.toFixed(0) || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer?.key || 'dQw4w9WgXcQ'}?autoplay=1`}
              title="Movie Trailer"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetail
