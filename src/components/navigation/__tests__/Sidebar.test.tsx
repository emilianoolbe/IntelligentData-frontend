import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { Sidebar } from '../Sidebar'
import { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from '@/config'

// Create a test i18n instance
function createTestI18n() {
  const instance = i18n.createInstance()
  instance.use(initReactI18next).init({
    resources: {
      es: {
        common: {
          appName: 'IntelligentData',
        },
        navigation: {
          dashboard: 'Dashboard',
          scraping: 'Scraping',
          filters: 'Filtros',
          charts: 'Gráficos',
          settings: 'Configuración',
        },
        accessibility: {
          'navigation.collapseSidebar': 'Colapsar sidebar',
          'navigation.expandSidebar': 'Expandir sidebar',
        },
      },
    },
    lng: 'es',
    fallbackLng: 'es',
    ns: ['common', 'navigation', 'accessibility'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })
  return instance
}

function RouterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={createTestI18n()}>
        {children}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('Sidebar', () => {
  const defaultProps = {
    state: 'expanded' as const,
    onToggle: vi.fn(),
  }

  describe('Rendering', () => {
    it('should render navigation items', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Scraping')).toBeInTheDocument()
      expect(screen.getByText('Filtros')).toBeInTheDocument()
      expect(screen.getByText('Gráficos')).toBeInTheDocument()
    })

    it('should render secondary navigation items', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      expect(screen.getByText('Configuración')).toBeInTheDocument()
    })

    it('should render toggle button', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      const toggleButton = screen.getByLabelText('Colapsar sidebar')
      expect(toggleButton).toBeInTheDocument()
    })

    it('should render logo when expanded', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="expanded" />
        </RouterWrapper>
      )

      expect(screen.getByAltText('IntelligentData')).toBeInTheDocument()
      expect(screen.getByText('IntelligentData')).toBeInTheDocument()
    })

    it('should not render logo text when collapsed', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="collapsed" />
        </RouterWrapper>
      )

      expect(screen.queryByText('IntelligentData')).not.toBeInTheDocument()
    })
  })

  describe('Toggle Behavior', () => {
    it('should call onToggle when toggle button is clicked', () => {
      const onToggle = vi.fn()

      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} onToggle={onToggle} />
        </RouterWrapper>
      )

      const toggleButton = screen.getByLabelText('Colapsar sidebar')
      fireEvent.click(toggleButton)

      expect(onToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Expanded State', () => {
    it('should show expanded width', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="expanded" />
        </RouterWrapper>
      )

      const aside = screen.getByRole('complementary')
      expect(aside.style.width).toBe(`${SIDEBAR_WIDTH_EXPANDED}px`)
    })

    it('should show labels when expanded', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="expanded" />
        </RouterWrapper>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Scraping')).toBeInTheDocument()
      expect(screen.getByText('Filtros')).toBeInTheDocument()
      expect(screen.getByText('Gráficos')).toBeInTheDocument()
      expect(screen.getByText('Configuración')).toBeInTheDocument()
    })

    it('should show collapse aria-label', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="expanded" />
        </RouterWrapper>
      )

      expect(screen.getByLabelText('Colapsar sidebar')).toBeInTheDocument()
    })
  })

  describe('Collapsed State', () => {
    it('should show collapsed width', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="collapsed" />
        </RouterWrapper>
      )

      const aside = screen.getByRole('complementary')
      expect(aside.style.width).toBe(`${SIDEBAR_WIDTH_COLLAPSED}px`)
    })

    it('should not show labels when collapsed', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="collapsed" />
        </RouterWrapper>
      )

      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
      expect(screen.queryByText('Scraping')).not.toBeInTheDocument()
    })

    it('should show expand aria-label', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} state="collapsed" />
        </RouterWrapper>
      )

      expect(screen.getByLabelText('Expandir sidebar')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should render correct navigation paths', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      const links = screen.getAllByRole('link')
      const paths = links.map((link) => link.getAttribute('href'))

      expect(paths).toContain('/dashboard')
      expect(paths).toContain('/scraping')
      expect(paths).toContain('/filters')
      expect(paths).toContain('/charts')
      expect(paths).toContain('/settings')
    })

    it('should render all navigation links', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      const links = screen.getAllByRole('link')
      expect(links.length).toBe(5) // 4 main + 1 secondary
    })
  })

  describe('Styling', () => {
    it('should have fixed positioning', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      const aside = screen.getByRole('complementary')
      expect(aside).toHaveClass('fixed')
      expect(aside).toHaveClass('left-0')
      expect(aside).toHaveClass('top-0')
    })

    it('should have transition styles', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      const aside = screen.getByRole('complementary')
      expect(aside).toHaveClass('transition-all')
      expect(aside).toHaveClass('duration-300')
    })
  })

  describe('Icons', () => {
    it('should render icons for all navigation items', () => {
      render(
        <RouterWrapper>
          <Sidebar {...defaultProps} />
        </RouterWrapper>
      )

      const aside = screen.getByRole('complementary')
      const svgs = aside.querySelectorAll('svg')

      // 5 nav items + 1 toggle button icon
      expect(svgs.length).toBeGreaterThanOrEqual(5)
    })
  })
})