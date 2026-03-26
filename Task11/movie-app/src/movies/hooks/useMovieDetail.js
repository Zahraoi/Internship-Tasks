import { useQuery } from '@tanstack/react-query'
import { fetchMovieDetails, fetchMovieVideos } from '../../services/tmdb'

export const useMovieDetail = (movieId) => {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useMovieTrailer = (movieId) => {
  return useQuery({
    queryKey: ['movieTrailer', movieId],
    queryFn: () => fetchMovieVideos(movieId).then(videos => {
      const trailer = videos?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
      return trailer || videos?.[0] || { key: 'dQw4w9WgXcQ', site: 'YouTube', type: 'Trailer' }
    }),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60,
  })
}
