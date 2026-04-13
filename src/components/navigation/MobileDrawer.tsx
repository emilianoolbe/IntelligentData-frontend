import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { navigation, HEADER_HEIGHT } from '@/config'

// Same icon mapping
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

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-elevated transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ paddingTop: `${HEADER_HEIGHT}px` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-secondary hover:bg-secondary hover:text-primary"
          aria-label={t('accessibility:navigation.closeMenu')}
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="p-4">
          {/* Main navigation */}
          <div className="space-y-1">
            {navigation.main.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-secondary hover:bg-secondary hover:text-primary"
              >
                {icons[item.icon || 'LayoutDashboard']}
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-border" />

          {/* Secondary navigation */}
          <div className="space-y-1">
            {navigation.secondary.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-secondary hover:bg-secondary hover:text-primary"
              >
                {icons[item.icon || 'Settings']}
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}