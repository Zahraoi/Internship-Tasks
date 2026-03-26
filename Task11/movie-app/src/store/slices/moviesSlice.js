import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchQuery: '',
  selectedGenre: 'all',
  selectedQuality: 'all',
  selectedRating: 'all',
  selectedYear: 'all',
  selectedLanguage: 'all',
  sortBy: 'popularity.desc',
  filtersOpen: false,
}

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setGenre: (state, action) => {
      state.selectedGenre = action.payload
    },
    setQuality: (state, action) => {
      state.selectedQuality = action.payload
    },
    setRating: (state, action) => {
      state.selectedRating = action.payload
    },
    setYear: (state, action) => {
      state.selectedYear = action.payload
    },
    setLanguage: (state, action) => {
      state.selectedLanguage = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    toggleFilters: (state) => {
      state.filtersOpen = !state.filtersOpen
    },
    resetFilters: (state) => {
      state.searchQuery = ''
      state.selectedGenre = 'all'
      state.selectedQuality = 'all'
      state.selectedRating = 'all'
      state.selectedYear = 'all'
      state.selectedLanguage = 'all'
      state.sortBy = 'popularity.desc'
    },
  },
})

export const {
  setSearchQuery,
  setGenre,
  setQuality,
  setRating,
  setYear,
  setLanguage,
  setSortBy,
  toggleFilters,
  resetFilters,
} = moviesSlice.actions

export default moviesSlice.reducer
