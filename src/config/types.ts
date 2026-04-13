// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  /** Unique identifier for the nav item */
  id: string
  /** Translation key for display label (e.g., 'navigation:dashboard') */
  labelKey: string
  /** Route path */
  path: string
  /** Icon name (Lucide icon) */
  icon?: string
  /** Badge count for notifications */
  badge?: number
  /** Child nav items for nested navigation */
  children?: NavItem[]
}

export interface NavigationConfig {
  /** Main navigation items */
  main: NavItem[]
  /** Secondary/settings navigation items */
  secondary: NavItem[]
}

export type SidebarState = 'expanded' | 'collapsed'