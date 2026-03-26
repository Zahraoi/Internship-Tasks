import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../services/firebase'
import { setWatchlist, setWatchlistLoading } from '../../store/slices/watchlistSlice'

const LOCAL_STORAGE_KEY = 'movieStream_watchlist'

const getLocalWatchlist = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveLocalWatchlist = (items) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

const useWatchlist = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items, loading } = useSelector((state) => state.watchlist)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      dispatch(setWatchlist([]))
      return
    }

    dispatch(setWatchlistLoading(true))
    setError(null)

    try {
      const watchlistRef = collection(db, 'watchlist', user.uid, 'movies')
      const q = query(watchlistRef, orderBy('addedAt', 'desc'))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const watchlistData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          dispatch(setWatchlist(watchlistData))
          saveLocalWatchlist(watchlistData)
        },
        (err) => {
          console.warn('Firestore sync error, loading from localStorage:', err.message)
          setError(err.message)
          const localData = getLocalWatchlist()
          dispatch(setWatchlist(localData))
        }
      )

      return () => unsubscribe()
    } catch (err) {
      console.warn('Watchlist setup error, loading from localStorage:', err.message)
      setError(err.message)
      const localData = getLocalWatchlist()
      dispatch(setWatchlist(localData))
    }
  }, [user, dispatch])

  return { items, loading, error }
}

export default useWatchlist
