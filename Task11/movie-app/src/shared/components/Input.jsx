import React, { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-3 ${Icon ? 'pl-11' : ''} rounded-lg border 
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:ring-netflix-red'
            }
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:border-transparent
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-1.5 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
