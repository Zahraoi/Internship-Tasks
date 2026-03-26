import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
}

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist: (state, action) => {
      state.items = action.payload
      state.loading = false
    },
    addToWatchlist: (state, action) => {
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload)
      }
    },
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    setWatchlistLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  setWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  setWatchlistLoading,
} = watchlistSlice.actions

export default watchlistSlice.reducer
