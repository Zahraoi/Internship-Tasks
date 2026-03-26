import React from 'react'
import { Loader2 } from 'lucide-react'

const Button = ({ 
  children, 
  variant = 'primary', 
  loading = false, 
  disabled = false, 
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseStyles = 'flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-netflix-red text-white hover:bg-red-700 active:scale-95',
    secondary: 'bg-gray-700 text-white hover:bg-gray-600 active:scale-95 dark:bg-gray-600 dark:hover:bg-gray-500',
    outline: 'border-2 border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </button>
  )
}

export default Button
