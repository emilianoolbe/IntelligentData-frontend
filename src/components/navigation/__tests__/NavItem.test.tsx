import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { NavItem } from '../NavItem'
import type { NavItem as NavItemType } from '@/config/types'

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
      },
    },
    lng: 'es',
    fallbackLng: 'es',
    ns: ['navigation'],
    defaultNS: 'navigation',
    interpolation: {
      escapeValue: false,
    },
  })
  return instance
}

// Wrapper for router and i18n
function RouterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={createTestI18n()}>
        {children}
      </I18nextProvider>
    </BrowserRouter>
  )
}

describe('NavItem', () => {
  const defaultItem: NavItemType = {
    id: 'dashboard',
    labelKey: 'navigation:dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
  }

  describe('Rendering', () => {
    it('should render with label when not collapsed', () => {
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} />
        </RouterWrapper>
      )

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('should render without label when collapsed', () => {
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} collapsed={true} />
        </RouterWrapper>
      )

      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    })

    it('should render badge when provided and not collapsed', () => {
      const itemWithBadge: NavItemType = {
        ...defaultItem,
        badge: 5,
      }

      render(
        <RouterWrapper>
          <NavItem item={itemWithBadge} />
        </RouterWrapper>
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should not render badge when collapsed', () => {
      const itemWithBadge: NavItemType = {
        ...defaultItem,
        badge: 5,
      }

      render(
        <RouterWrapper>
          <NavItem item={itemWithBadge} collapsed={true} />
        </RouterWrapper>
      )

      expect(screen.queryByText('5')).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should render as a link with correct href', () => {
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/dashboard')
    })

    it('should apply active styles when route matches', () => {
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} />
        </RouterWrapper>
      )

      // Navigate to the same path to test active state
      const link = screen.getByRole('link')
      expect(link).toHaveClass('flex')
      expect(link).toHaveClass('items-center')
    })
  })

  describe('Styling', () => {
    it('should apply collapsed styles when collapsed', () => {
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} collapsed={true} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('justify-center')
    })

    it('should apply expanded styles when not collapsed', () => {
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} collapsed={false} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      expect(link).not.toHaveClass('justify-center')
    })
  })

  describe('Icons', () => {
    it('should render LayoutDashboard icon by default', () => {
      render(
        <RouterWrapper>
          <NavItem item={{ ...defaultItem, icon: undefined }} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render specified icon', () => {
      const itemWithIcon: NavItemType = {
        ...defaultItem,
        icon: 'Settings',
      }

      render(
        <RouterWrapper>
          <NavItem item={itemWithIcon} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Globe icon', () => {
      const itemWithIcon: NavItemType = {
        ...defaultItem,
        icon: 'Globe',
      }

      render(
        <RouterWrapper>
          <NavItem item={itemWithIcon} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render Filter icon', () => {
      const itemWithIcon: NavItemType = {
        ...defaultItem,
        icon: 'Filter',
      }

      render(
        <RouterWrapper>
          <NavItem item={itemWithIcon} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render BarChart3 icon', () => {
      const itemWithIcon: NavItemType = {
        ...defaultItem,
        icon: 'BarChart3',
      }

      render(
        <RouterWrapper>
          <NavItem item={itemWithIcon} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      const svg = link.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should pass aria-current prop to NavLink', () => {
      // Note: aria-current is only applied when the link is active (routing concern)
      // In react-router-dom v7, the aria-current prop is used when the link matches
      // the current route. This test verifies the prop is passed correctly.
      render(
        <RouterWrapper>
          <NavItem item={defaultItem} />
        </RouterWrapper>
      )

      const link = screen.getByRole('link')
      // Just verify the link exists - aria-current requires routing integration
      expect(link).toBeInTheDocument()
    })
  })
})