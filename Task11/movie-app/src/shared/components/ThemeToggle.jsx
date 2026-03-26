import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../store/slices/themeSlice'

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector((state) => state.theme)

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2.5 rounded-full bg-gray-200 dark:bg-gray-700 
                 hover:bg-gray-300 dark:hover:bg-gray-600 
                 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-300 rotate-0 hover:rotate-180" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 transition-transform duration-300 rotate-0 hover:rotate-180" />
      )}
    </button>
  )
}

export default ThemeToggle
