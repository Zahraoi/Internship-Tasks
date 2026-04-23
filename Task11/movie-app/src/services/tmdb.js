const API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://placehold.co/500x750/1a1a2e/ffffff?text=No+Image'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return 'https://placehold.co/1280x720/1a1a2e/ffffff?text=No+Backdrop'
  return `${IMAGE_BASE_URL}/${size}${path}`
}

const transformMovie = (movie) => ({
  ...movie,
  poster_path: getImageUrl(movie.poster_path),
  backdrop_path: movie.backdrop_path ? getBackdropUrl(movie.backdrop_path) : movie.backdrop_path,
  quality: movie.vote_average >= 8 ? '4K' : movie.vote_average >= 6 ? 'HD' : 'SD',
  runtime: movie.runtime || 120,
  status: movie.status || 'Released',
  tagline: movie.tagline || '',
  overview: movie.overview || 'No overview available.',
  genre_ids: movie.genres?.map(g => g.id) || movie.genre_ids || [],
})

export const fetchMovies = async ({ page = 1, query = '', genre = 'all', sortBy = 'popularity.desc' }) => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Please add VITE_TMDB_API_KEY to your .env file.')
  }

  let url
  
  if (query && query.trim()) {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query.trim())}&page=${page}&include_adult=false`
  } else {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=false`
    if (genre !== 'all') {
      url += `&with_genres=${genre}`
    }
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.status_message || `Failed to fetch movies: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      ...data,
      results: data.results?.map(transformMovie) || []
    }
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

export const fetchMovieDetails = async (movieId) => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured')
  }
  
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`)
  if (!response.ok) throw new Error('Failed to fetch movie details')
  const data = await response.json()
  return transformMovie(data)
}

export const fetchGenres = async () => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured')
  }
  
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
  if (!response.ok) throw new Error('Failed to fetch genres')
  const data = await response.json()
  return data.genres || []
}

export const fetchTrendingMovies = async (timeWindow = 'week') => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured')
  }
  
  const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`)
  if (!response.ok) throw new Error('Failed to fetch trending movies')
  const data = await response.json()
  return data.results?.map(transformMovie) || []
}

export const fetchMovieVideos = async (movieId) => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured')
  }
  
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`)
  if (!response.ok) throw new Error('Failed to fetch movie videos')
  const data = await response.json()
  return data.results || []
}
