import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { navigation, SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from '@/config'
import { logoSimple } from '@/assets'
import type { SidebarState } from '@/config/types'

interface SidebarProps {
  state: SidebarState
  onToggle: () => void
}

// Simple icon mapping (same as NavItem)
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

export function Sidebar({ state, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const isExpanded = state === 'expanded'
  const width = isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-elevated',
        'transition-all duration-300'
      )}
      style={{ width: `${width}px` }}
    >
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <img
              src={logoSimple}
              alt="IntelligentData"
              className="h-8 w-auto"
            />
            <span className="text-lg font-semibold text-primary">{t('common:appName')}</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'rounded-lg p-2 text-secondary hover:bg-secondary hover:text-primary',
            !isExpanded && 'mx-auto'
          )}
          aria-label={isExpanded ? t('accessibility:navigation.collapseSidebar') : t('accessibility:navigation.expandSidebar')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isExpanded ? (
              <path d="m15 18-6-6 6-6" />
            ) : (
              <path d="m9 18 6-6-6-6" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* Main navigation */}
        <div className="space-y-1">
          {navigation.main.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center gap-3 rounded-lg transition-colors',
                  'hover:bg-secondary',
                  isActive
                    ? 'bg-accent-muted text-accent'
                    : 'text-secondary hover:text-primary',
                  isExpanded ? 'px-3 py-2' : 'justify-center px-3 py-3'
                )
              }
              aria-current="page"
            >
              {icons[item.icon || 'LayoutDashboard']}
              {isExpanded && (
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* Secondary navigation */}
        <div className="space-y-1">
          {navigation.secondary.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  'flex items-center gap-3 rounded-lg transition-colors',
                  'hover:bg-secondary',
                  isActive
                    ? 'bg-accent-muted text-accent'
                    : 'text-secondary hover:text-primary',
                  isExpanded ? 'px-3 py-2' : 'justify-center px-3 py-3'
                )
              }
              aria-current="page"
            >
              {icons[item.icon || 'Settings']}
              {isExpanded && (
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}