import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X, Mail, Loader2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { auth, sendPasswordResetEmail } from '../../services/firebase'
import Input from './Input'
import Button from './Button'

const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
})

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  if (!isOpen) return null

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, data.email)
      setEmailSent(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error) {
      console.error('Password reset error:', error)
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'No account found with this email address'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Failed to send reset email. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmailSent(false)
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {emailSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
              <p className="text-gray-400 mb-6">
                We've sent a password reset link to your email. Please check your inbox and follow the instructions.
              </p>
              <Button onClick={handleClose} className="w-full">
                Got it
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Button
                  type="submit"
                  className="w-full !py-3.5"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              <p className="text-center text-gray-500 text-sm mt-4">
                Remember your password?{' '}
                <button onClick={handleClose} className="text-netflix-red hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordModal
