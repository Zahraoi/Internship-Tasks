import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import toast from 'react-hot-toast'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { auth, googleProvider } from '../../services/firebase'
import { setUser, setLoading, setError } from '../../store/slices/authSlice'
import Input from '../../shared/components/Input'
import Button from '../../shared/components/Button'
import ForgotPasswordModal from '../../shared/components/ForgotPasswordModal'

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    dispatch(setLoading(true))
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password)
      dispatch(setUser(result.user))
      toast.success('Welcome back!')
      navigate('/')
    } catch (error) {
      dispatch(setError(error.message))
      toast.error(error.code === 'auth/user-not-found' 
        ? 'No account found with this email' 
        : error.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : 'Failed to sign in')
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      dispatch(setUser(result.user))
      toast.success('Welcome!')
      navigate('/')
    } catch (error) {
      dispatch(setError(error.message))
      toast.error('Failed to sign in with Google')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue watching</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-netflix-red focus:ring-netflix-red"
              />
              <span className="text-gray-400">Remember me</span>
            </label>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-netflix-red hover:underline text-left"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full !py-3.5"
            loading={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 
                     bg-white text-gray-800 font-semibold rounded-lg
                     hover:bg-gray-100 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continue with Google
        </button>

        <p className="text-center mt-8 text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-netflix-red font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  )
}

export default Login
