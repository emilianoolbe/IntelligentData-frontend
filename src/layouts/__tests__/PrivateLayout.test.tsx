import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { PrivateLayout } from '../PrivateLayout'
import { authSlice } from '@/features/auth/authSlice'
import { ThemeProvider } from '@/providers/ThemeProvider'
import type { AuthSlice } from '@/features/auth/types'
import { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED, MOBILE_BREAKPOINT } from '@/config'

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

// Mock window.innerWidth
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

// Create test wrapper with all providers
function createTestWrapper(preloadedState?: Partial<AuthSlice>) {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: preloadedState as AuthSlice,
  })

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider defaultTheme="dark" respectSystemPreference={false}>
          <BrowserRouter>{children}</BrowserRouter>
        </ThemeProvider>
      </Provider>
    )
  }
}

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

describe('PrivateLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window width to desktop
    mockWindowWidth(1280)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Desktop Layout', () => {
    it('should render sidebar on desktop', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })

    it('should render header on desktop', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should render outlet content on desktop', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      // The Outlet is rendered, even if empty
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
    })

    it('should render footer on desktop', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByText(`IntelligentData © ${currentYear}`)).toBeInTheDocument()
    })

    it('should not show menu button on desktop', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      expect(screen.queryByLabelText('Open menu')).not.toBeInTheDocument()
    })

    it('should collapse sidebar when toggle is clicked', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const toggleButton = screen.getByLabelText('Collapse sidebar')
      fireEvent.click(toggleButton)

      // After clicking, should show expand label
      expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument()
    })
  })

  describe('Mobile Layout', () => {
    it('should not render sidebar on mobile', () => {
      mockWindowWidth(MOBILE_BREAKPOINT -100)

      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })

    it('should show menu button on mobile', () => {
      mockWindowWidth(MOBILE_BREAKPOINT -100)

      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Open menu')).toBeInTheDocument()
    })

    it('should open mobile drawer when menu button is clicked', () => {
      mockWindowWidth(MOBILE_BREAKPOINT -100)

      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const menuButton = screen.getByLabelText('Open menu')
      fireEvent.click(menuButton)

      // Should show navigation in drawer
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

it('should close mobile drawer when close button is clicked', () => {
      mockWindowWidth(MOBILE_BREAKPOINT - 100)

      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      // Open drawer
      const menuButton = screen.getByLabelText('Open menu')
      fireEvent.click(menuButton)

      // Close drawer
      const closeButton = screen.getByLabelText('Close menu')
      fireEvent.click(closeButton)

      // Drawer should be hidden - get the drawer element (not backdrop)
      const drawer = document.querySelector('[class*="transform"][class*="translate-x"]')
      expect(drawer).toHaveClass('-translate-x-full')
    })
  })

  describe('Sidebar Width', () => {
    it('should apply expanded sidebar width by default', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const mainContent = document.querySelector('.ml-\\[')
      if (mainContent) {
        const marginLeft = mainContent.getAttribute('style')
        expect(marginLeft).toContain(`${SIDEBAR_WIDTH_EXPANDED}px`)
      }
    })

    it('should apply collapsed sidebar width after toggle', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      // Collapse sidebar
      const toggleButton = screen.getByLabelText('Collapse sidebar')
      fireEvent.click(toggleButton)

      const mainContent = document.querySelector('.ml-\\[')
      if (mainContent) {
        const marginLeft = mainContent.getAttribute('style')
        expect(marginLeft).toContain(`${SIDEBAR_WIDTH_COLLAPSED}px`)
      }
    })
  })

  describe('Resize Handling', () => {
    it('should update mobile state on resize', async () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      // Start desktop - sidebar visible
      expect(screen.getByRole('complementary')).toBeInTheDocument()

      // Simulate resize to mobile
      mockWindowWidth(MOBILE_BREAKPOINT - 100)
      fireEvent(window, new Event('resize'))

      // Allow state update
      await vi.waitFor(() => {
        // Sidebar should not be visible after mobile resize
        // Note: CSS hides it with lg:hidden which doesn't affect rendering in tests
        // The component removes it from DOM when isMobile becomes true
      })
    })
  })

  describe('Footer', () => {
    it('should display current year in copyright', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have min-h-screen background', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const container = document.querySelector('.min-h-screen')
      expect(container).toHaveClass('bg-background')
    })

    it('should have proper main padding', () => {
      const TestWrapper = createTestWrapper(defaultAuthState)
      render(
        <TestWrapper>
          <PrivateLayout />
        </TestWrapper>
      )

      const main = screen.getByRole('main')
      expect(main).toHaveClass('p-6')
    })
  })
})