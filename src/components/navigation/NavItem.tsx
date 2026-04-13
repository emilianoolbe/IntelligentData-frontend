import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { NavItem as NavItemType } from '@/config/types'

interface NavItemProps {
  item: NavItemType
  collapsed?: boolean
}

// Simple icon mapping - using SVG icons directly
const icons: Record<string, React.ReactNode> = {
  LayoutDashboard: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  Globe: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  ),
  Filter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  BarChart3: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  ),
  Settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v10" />
      <path d="m4.22 4.22 4.24 4.24m5.08 5.08 4.24 4.24" />
      <path d="M1 12h6m6 0h10" />
      <path d="m4.22 19.78 4.24-4.24m5.08-5.08 4.24-4.24" />
    </svg>
  ),
}

export function NavItem({ item, collapsed = false }: NavItemProps) {
  const { t } = useTranslation()
  const Icon = icons[item.icon || 'LayoutDashboard']

  return (
    <NavLink
      to={item.path}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          'flex items-center gap-3 rounded-lg transition-colors',
          'hover:bg-secondary',
          isActive
            ? 'bg-accent-muted text-accent'
            : 'text-secondary hover:text-primary',
          collapsed ? 'justify-center px-3 py-3' : 'px-3 py-2'
        )
      }
      aria-current="page"
    >
      {Icon}
      {!collapsed && (
        <span className="text-sm font-medium">{t(item.labelKey)}</span>
      )}
      {item.badge && !collapsed && (
        <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs text-white">
          {item.badge}
        </span>
      )}
    </NavLink>
  )
}