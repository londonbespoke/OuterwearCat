import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

function getInitialTheme() {
  // Check localStorage first
  const saved = localStorage.getItem('lbc_theme')
  if (saved === 'light' || saved === 'dark') return saved

  // Respect OS preference on first visit
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'

  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
    localStorage.setItem('lbc_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
