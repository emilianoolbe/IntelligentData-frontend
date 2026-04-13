/**
 * Theme types for the application
 */

export type Theme = 'dark' | 'light'

export interface ThemeContextValue {
  /** Current active theme */
  theme: Theme
  /** Set theme explicitly */
  setTheme: (theme: Theme) => void
  /** Toggle between dark and light */
  toggleTheme: () => void
  /** Whether current theme is dark */
  isDark: boolean
}