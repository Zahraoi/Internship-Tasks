import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { useState, useCallback, useMemo, useEffect } from 'react'
import {
  fetchMovies as apiFetchMovies,
  fetchGenres as apiFetchGenres,
  fetchTrendingMovies as apiFetchTrending,
  fetchMovieDetails
} from '../../services/tmdb'
import {
  mockLanguages,
  mockYears,
  mockRatings,
  mockQualities,
  mockSortOptions
} from '../../services/mockData'

export const useMovies = () => {
  const filters = useSelector((state) => state.movies)
  
  const {
    searchQuery,
    selectedGenre,
    sortBy
  } = filters

  const [page, setPage] = useState(1)
  const [searchTrigger, setSearchTrigger] = useState(0)

  useEffect(() => {
    setPage(1)
    setSearchTrigger(prev => prev + 1)
  }, [searchQuery, selectedGenre, sortBy])

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['movies', searchQuery, selectedGenre, sortBy, page, searchTrigger],
    queryFn: () => apiFetchMovies({
      page,
      query: searchQuery,
      genre: selectedGenre,
      sortBy
    }),
    enabled: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  const movies = useMemo(() => {
    return data?.results || []
  }, [data])

  const hasMore = useMemo(() => {
    return page < (data?.total_pages || 1)
  }, [page, data])

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, isFetching])

  return {
    movies,
    allMovies: movies,
    totalMovies: data?.total_results || 0,
    hasMore,
    loadMore,
    isLoading: isLoading || isFetching,
    error: error ? error.message : null,
    refetch
  }
}

export const useTrendingMovies = () => {
  return useQuery({
    queryKey: ['trendingMovies'],
    queryFn: () => apiFetchTrending('week'),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useTopRatedMovies = () => {
  return useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => apiFetchMovies({ sortBy: 'vote_average.desc', page: 1 }),
    select: (data) => data?.results?.slice(0, 10) || [],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useRecentMovies = () => {
  return useQuery({
    queryKey: ['recentMovies'],
    queryFn: () => apiFetchMovies({ sortBy: 'release_date.desc', page: 1 }),
    select: (data) => data?.results?.slice(0, 10) || [],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: apiFetchGenres,
    staleTime: 1000 * 60 * 60 * 24,
  })
}

export { 
  mockLanguages,
  mockYears,
  mockRatings,
  mockQualities,
  mockSortOptions 
}
