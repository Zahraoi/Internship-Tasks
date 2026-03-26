import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useMovies, useTrendingMovies, useTopRatedMovies, useRecentMovies } from '../hooks/useMovies'
import HeroCarousel from '../components/HeroCarousel'
import { TrendingRow, TopRatedRow, RecentRow } from '../components/MovieRow'
import Filters from '../components/Filters'
import MovieGrid from '../components/MovieGrid'

const Home = () => {
  const location = useLocation()
  const { searchQuery } = useSelector((state) => state.movies)
  const { data: trendingMovies = [] } = useTrendingMovies()
  const { data: topRatedMovies = [] } = useTopRatedMovies()
  const { data: recentMovies = [] } = useRecentMovies()
  const { movies, hasMore, loadMore, totalMovies, error, refetch } = useMovies()

  const showTrending = !searchQuery

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      {showTrending && (
        <>
          <HeroCarousel movies={trendingMovies.slice(0, 5)} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TrendingRow movies={trendingMovies} />
            <TopRatedRow movies={topRatedMovies} />
            <RecentRow movies={recentMovies} />
          </div>
        </>
      )}

      <div 
        id="browse-section" 
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
          searchQuery ? 'pt-28 min-h-screen bg-white dark:bg-netflix-black' : ''
        }`}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Browse All Movies'}
        </h2>
        <Filters />
        <MovieGrid 
          movies={movies} 
          hasMore={hasMore}
          loadMore={loadMore}
          totalMovies={totalMovies}
          error={error}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default Home
