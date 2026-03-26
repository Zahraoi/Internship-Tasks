import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { setSearchQuery, setGenre, setQuality, setRating, setYear, setLanguage, setSortBy, resetFilters, toggleFilters } from '../../store/slices/moviesSlice'
import { useGenres, mockYears, mockRatings, mockQualities, mockSortOptions, mockLanguages } from '../hooks/useMovies'

const Filters = () => {
  const dispatch = useDispatch()
  const { data: genres } = useGenres()
  const filters = useSelector((state) => state.movies)
  const [localSearch, setLocalSearch] = useState(filters.searchQuery)

  const {
    searchQuery,
    selectedGenre,
    selectedQuality,
    selectedRating,
    selectedYear,
    selectedLanguage,
    sortBy,
    filtersOpen
  } = filters

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setSearchQuery(localSearch))
  }

  const handleClear = () => {
    setLocalSearch('')
    dispatch(setSearchQuery(''))
  }

  const activeFiltersCount = [
    selectedGenre !== 'all',
    selectedQuality !== 'all',
    selectedRating !== 'all',
    selectedYear !== 'all',
    selectedLanguage !== 'all'
  ].filter(Boolean).length

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies by title..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                       rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent
                       transition-all duration-200"
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        <button
          onClick={() => dispatch(toggleFilters())}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
            ${filtersOpen 
              ? 'bg-netflix-red text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Genre
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => dispatch(setGenre(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                <option value="all">All Genres</option>
                {genres?.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quality
              </label>
              <select
                value={selectedQuality}
                onChange={(e) => dispatch(setQuality(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                {mockQualities.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <select
                value={selectedRating}
                onChange={(e) => dispatch(setRating(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                {mockRatings.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => dispatch(setYear(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                {mockYears.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => dispatch(setLanguage(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                {mockLanguages.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => dispatch(setSortBy(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                           rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red"
              >
                {mockSortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => dispatch(resetFilters())}
                className="text-sm text-netflix-red hover:underline font-medium"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Filters
