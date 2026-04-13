import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Theme, ThemeContextValue } from '../types/theme'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const STORAGE_KEY = 'theme'

interface ThemeProviderProps {
  children: ReactNode
  /** Default theme if no preference is stored. Defaults to 'dark' */
  defaultTheme?: Theme
  /** Whether to respect system color scheme preference on first visit */
  respectSystemPreference?: boolean
}

/**
 * ThemeProvider - Manages application theme (dark/light)
 * 
 * Features:
 * - Persists theme preference in localStorage
 * - Syncs theme with DOM via data-theme attribute
 * - Respects system preference on first visit (optional)
 * - Dark mode by default
 */
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  respectSystemPreference = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored === 'dark' || stored === 'light') {
        return stored
      }
    }
    return defaultTheme
  })

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement
    
    // Set data-theme attribute
    root.setAttribute('data-theme', theme)
    
    // Also set class for Tailwind dark: variants (alternative approach)
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Respect system preference on first visit (if enabled and no stored preference)
  useEffect(() => {
    if (!respectSystemPreference) return
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return // User already has a preference
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light'
    
    setThemeState(systemTheme)
    localStorage.setItem(STORAGE_KEY, systemTheme)
  }, [respectSystemPreference])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access theme context
 * 
 * @throws Error if used outside ThemeProvider
 * @returns ThemeContextValue with theme, setTheme, toggleTheme, isDark
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}