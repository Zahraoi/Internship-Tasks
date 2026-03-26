import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'
import moviesReducer from './slices/moviesSlice'
import watchlistReducer from './slices/watchlistSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    movies: moviesReducer,
    watchlist: watchlistReducer,
  },
})
