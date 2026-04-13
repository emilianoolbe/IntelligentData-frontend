import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeProvider'

// Test component to access theme context
function ThemeConsumer() {
  const { theme, setTheme, toggleTheme, isDark } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{isDark.toString()}</span>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

// Helper to render with provider
function renderWithProvider(defaultTheme: 'dark' | 'light' = 'dark') {
  return render(
    <ThemeProvider defaultTheme={defaultTheme} respectSystemPreference={false}>
      <ThemeConsumer />
    </ThemeProvider>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockClear()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('dark', 'light')
  })

  describe('Default Theme', () => {
    it('should default to dark theme', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      renderWithProvider('dark')

      expect(screen.getByTestId('theme').textContent).toBe('dark')
      expect(screen.getByTestId('isDark').textContent).toBe('true')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should respect defaultTheme prop', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      renderWithProvider('light')

      expect(screen.getByTestId('theme').textContent).toBe('light')
      expect(screen.getByTestId('isDark').textContent).toBe('false')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })
  })

  describe('localStorage Persistence', () => {
    it('should persist theme to localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      renderWithProvider()

      // ThemeProvider calls setItem when theme changes
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it('should restore theme from localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      renderWithProvider()

      expect(screen.getByTestId('theme').textContent).toBe('light')
    })

    it('should ignore invalid localStorage values', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid')
      renderWithProvider('dark')

      // Should fall back to defaultTheme
      expect(screen.getByTestId('theme').textContent).toBe('dark')
    })
  })

  describe('DOM Synchronization', () => {
    it('should set data-theme attribute on document element', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      renderWithProvider()

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })

    it('should set class on document element', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      renderWithProvider()

      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })
  })

  describe('setTheme', () => {
    it('should change theme to light', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      renderWithProvider()

      const lightButton = screen.getByRole('button', { name: 'Set Light' })
      fireEvent.click(lightButton)

      expect(screen.getByTestId('theme').textContent).toBe('light')
      expect(screen.getByTestId('isDark').textContent).toBe('false')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('should change theme to dark', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      renderWithProvider()

      const darkButton = screen.getByRole('button', { name: 'Set Dark' })
      fireEvent.click(darkButton)

      expect(screen.getByTestId('theme').textContent).toBe('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('light')
      renderWithProvider('light')

      const toggleButton = screen.getByRole('button', { name: 'Toggle' })
      fireEvent.click(toggleButton)

      expect(screen.getByTestId('theme').textContent).toBe('dark')
      expect(screen.getByTestId('isDark').textContent).toBe('true')
    })
  })
})

describe('useTheme', () => {
  it('should throw error when used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<ThemeConsumer />)
    }).toThrow('useTheme must be used within a ThemeProvider')

    consoleError.mockRestore()
  })
})