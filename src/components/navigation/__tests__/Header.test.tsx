import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Header } from '../Header'
import { authSlice } from '@/features/auth/authSlice'
import { ThemeProvider } from '@/providers/ThemeProvider'
import type { AuthSlice } from '@/features/auth/types'

// Create i18n instance for tests
const createTestI18n = () => {
  const instance = i18n.createInstance()
  instance.use(initReactI18next).init({
    resources: {
      es: {
        accessibility: {
          theme: { switchToLight: 'Cambiar a modo claro', switchToDark: 'Cambiar a modo oscuro' },
          navigation: { openMenu: 'Abrir menú' },
        },
        auth: { logout: 'Cerrar sesión' },
      },
    },
    defaultNS: 'accessibility',
    fallbackLng: 'es',
    lng: 'es',
    interpolation: { escapeValue: false },
  })
  return instance
}

// Mock matchMedia for theme
const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

// Create test wrapper with all providers
function createTestWrapper(preloadedState?: Partial<AuthSlice>) {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: preloadedState as AuthSlice,
  })

  const testI18n = createTestI18n()

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={testI18n}>
          <ThemeProvider defaultTheme="dark" respectSystemPreference={false}>
            <BrowserRouter>{children}</BrowserRouter>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    )
  }
}

describe('Header', () => {
  const defaultAuthState: AuthSlice = {
    auth: {
      user: {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      },
      tokens: {
        access: 'access-token',
        refresh: 'refresh-token',
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without menu button by default', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      expect(screen.queryByLabelText('Abrir menú')).not.toBeInTheDocument()
    })

    it('should render menu button when showMenuButton is true', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header showMenuButton={true} />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Abrir menú')).toBeInTheDocument()
    })

    it('should render theme toggle', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const themeButton = screen.getByLabelText(/Cambiar a/)
      expect(themeButton).toBeInTheDocument()
    })

    it('should render logout button', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const logoutButton = screen.getByLabelText('Cerrar sesión')
      expect(logoutButton).toBeInTheDocument()
    })
  })

  describe('User Info', () => {
    it('should display user info when user is authenticated', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should not display user info when user is not authenticated', () => {
      const TestWrapper = createTestWrapper({
        auth: {
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      })
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      expect(screen.queryByText('testuser')).not.toBeInTheDocument()
    })
  })

  describe('Theme Toggle', () => {
    it('should show correct icon for dark mode', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const themeButton = screen.getByLabelText('Cambiar a modo claro')
      expect(themeButton).toBeInTheDocument()
    })
  })

  describe('Menu Button', () => {
    it('should call onMenuClick when menu button is clicked', () => {
      const onMenuClick = vi.fn()
      const TestWrapper = createTestWrapper(defaultAuthState)

      render(
        <TestWrapper>
          <Header showMenuButton={true} onMenuClick={onMenuClick} />
        </TestWrapper>
      )

      const menuButton = screen.getByLabelText('Abrir menú')
      fireEvent.click(menuButton)

      expect(onMenuClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Logout', () => {
    it('should dispatch logout action when logout button is clicked', async () => {
      const store = configureStore({
        reducer: {
          auth: authSlice.reducer,
        },
        preloadedState: defaultAuthState,
      })

      const testI18n = createTestI18n()

      render(
        <Provider store={store}>
          <I18nextProvider i18n={testI18n}>
            <ThemeProvider defaultTheme="dark" respectSystemPreference={false}>
              <BrowserRouter>
                <Header />
              </BrowserRouter>
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      )

      const logoutButton = screen.getByLabelText('Cerrar sesión')
      fireEvent.click(logoutButton)

      // Wait for the logout action to complete
      await waitFor(() => {
        const state = store.getState()
        expect(state.auth.isAuthenticated).toBe(false)
        expect(state.auth.user).toBe(null)
      })
    })
  })

  describe('Styling', () => {
    it('should have sticky positioning', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('sticky')
      expect(header).toHaveClass('top-0')
    })

    it('should have correct height', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      )

      const header = screen.getByRole('banner')
      expect(header).toHaveClass('h-16')
    })
  })
})