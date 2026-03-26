import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { auth } from '../../services/firebase'
import { setUser, setLoading } from '../../store/slices/authSlice'

const useAuth = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(true))
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user))
      } else {
        dispatch(setUser(null))
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return null
}

export default useAuth
