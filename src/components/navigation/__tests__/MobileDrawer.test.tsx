import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { MobileDrawer } from '../MobileDrawer'
import { HEADER_HEIGHT } from '@/config'

// Create a test i18n instance
function createTestI18n() {
  const instance = i18n.createInstance()
  instance.use(initReactI18next).init({
    resources: {
      es: {
        navigation: {
          dashboard: 'Dashboard',
          scraping: 'Scraping',
          filters: 'Filtros',
          charts: 'Gráficos',
          settings: 'Configuración',
        },
        accessibility: {
          'navigation.closeMenu': 'Cerrar menú',
        },
      },
    },
    lng: 'es',
    fallbackLng: 'es',
    ns: ['navigation', 'accessibility'],
    defaultNS: 'navigation',
    interpolation: {
      escapeValue: false,
    },
  })
  return instance
}

// Wrapper with i18n
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={createTestI18n()}>
      {children}
    </I18nextProvider>
  )
}

describe('MobileDrawer', () => {
  const defaultProps = {
    isOpen: false,
    onClose: vi.fn(),
  }

  // Helper to get the drawer element (not the backdrop)
  const getDrawerElement = () => {
    // The drawer has transform classes, backdrop does not
    return document.querySelector('[class*="transform"][class*="translate-x"]')
  }

  describe('Rendering', () => {
    it('should render drawer element hidden when isOpen is false', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={false} />
        </TestWrapper>
      )

      const drawer = getDrawerElement()
      expect(drawer).toBeInTheDocument()
      expect(drawer).toHaveClass('-translate-x-full')
    })

    it('should render drawer visible when isOpen is true', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const drawer = getDrawerElement()
      expect(drawer).toBeInTheDocument()
      expect(drawer).toHaveClass('translate-x-0')
    })

    it('should render navigation items when open', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Scraping')).toBeInTheDocument()
      expect(screen.getByText('Filtros')).toBeInTheDocument()
      expect(screen.getByText('Gráficos')).toBeInTheDocument()
      expect(screen.getByText('Configuración')).toBeInTheDocument()
    })

    it('should render close button when open', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      expect(screen.getByLabelText('Cerrar menú')).toBeInTheDocument()
    })
  })

  describe('Backdrop', () => {
    it('should render backdrop when open', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const backdrop = document.querySelector('.bg-black\\/50')
      expect(backdrop).toBeInTheDocument()
    })

    it('should not render backdrop when closed', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={false} />
        </TestWrapper>
      )

      const backdrop = document.querySelector('.bg-black\\/50')
      expect(backdrop).not.toBeInTheDocument()
    })

    it('should call onClose when backdrop is clicked', () => {
      const onClose = vi.fn()

      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} onClose={onClose} />
        </TestWrapper>
      )

      const backdrop = document.querySelector('.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(onClose).toHaveBeenCalledTimes(1)
      }
    })
  })

  describe('Close Behavior', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn()

      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} onClose={onClose} />
        </TestWrapper>
      )

      const closeButton = screen.getByLabelText('Cerrar menú')
      fireEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when navigation link is clicked', () => {
      const onClose = vi.fn()

      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} onClose={onClose} />
        </TestWrapper>
      )

      const dashboardLink = screen.getByText('Dashboard')
      fireEvent.click(dashboardLink)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Navigation Links', () => {
    it('should render correct navigation paths', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const links = screen.getAllByRole('link')
      const paths = links.map((link) => link.getAttribute('href'))

      expect(paths).toContain('/dashboard')
      expect(paths).toContain('/scraping')
      expect(paths).toContain('/filters')
      expect(paths).toContain('/charts')
      expect(paths).toContain('/settings')
    })
  })

  describe('Styling', () => {
    it('should have correct padding top for header offset', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const drawer = getDrawerElement() as HTMLElement | null
      expect(drawer?.style.paddingTop).toBe(`${HEADER_HEIGHT}px`)
    })

    it('should be hidden on lg screens and up', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const drawer = getDrawerElement()
      expect(drawer).toHaveClass('lg:hidden')
    })

    it('should have fixed positioning', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const drawer = getDrawerElement()
      expect(drawer).toHaveClass('fixed')
      expect(drawer).toHaveClass('inset-y-0')
      expect(drawer).toHaveClass('left-0')
    })

    it('should have transition styles', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const drawer = getDrawerElement()
      expect(drawer).toHaveClass('transition-transform')
      expect(drawer).toHaveClass('duration-300')
    })
  })

  describe('Icons', () => {
    it('should render icons for all navigation items', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const drawer = getDrawerElement()
      const svgs = drawer?.querySelectorAll('svg')

      // 5 nav items + 1 close button icon
      expect(svgs?.length).toBeGreaterThanOrEqual(5)
    })
  })

  describe('Accessibility', () => {
    it('should have aria-hidden on backdrop', () => {
      render(
        <TestWrapper>
          <MobileDrawer {...defaultProps} isOpen={true} />
        </TestWrapper>
      )

      const backdrop = document.querySelector('.bg-black\\/50')
      expect(backdrop).toHaveAttribute('aria-hidden', 'true')
    })
  })
})