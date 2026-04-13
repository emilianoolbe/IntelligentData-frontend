import type { NavigationConfig } from './types'

// ============================================
// Navigation Configuration
// ============================================

export const navigation: NavigationConfig = {
  main: [
    {
      id: 'dashboard',
      labelKey: 'navigation:dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
    },
    {
      id: 'scraping',
      labelKey: 'navigation:scraping',
      path: '/scraping',
      icon: 'Globe',
    },
    {
      id: 'filters',
      labelKey: 'navigation:filters',
      path: '/filters',
      icon: 'Filter',
    },
    {
      id: 'charts',
      labelKey: 'navigation:charts',
      path: '/charts',
      icon: 'BarChart3',
    },
  ],
  secondary: [
    {
      id: 'settings',
      labelKey: 'navigation:settings',
      path: '/settings',
      icon: 'Settings',
    },
  ],
}

// ============================================
// Breakpoints
// ============================================

export const MOBILE_BREAKPOINT = 1024 // px

// ============================================
// Sidebar Dimensions
// ============================================

export const SIDEBAR_WIDTH_EXPANDED = 280 // px
export const SIDEBAR_WIDTH_COLLAPSED = 80 // px
export const HEADER_HEIGHT = 64 // px