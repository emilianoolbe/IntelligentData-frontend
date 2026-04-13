import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Header } from '@/components/navigation/Header'
import { MobileDrawer } from '@/components/navigation/MobileDrawer'
import { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED, MOBILE_BREAKPOINT } from '@/config'
import type { SidebarState } from '@/config/types'

export function PrivateLayout() {
  const { t } = useTranslation()
  const [sidebarState, setSidebarState] = useState<SidebarState>('expanded')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarState((prev) => (prev === 'expanded' ? 'collapsed' : 'expanded'))
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const sidebarWidth = isMobile ? 0 : sidebarState === 'expanded' ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar state={sidebarState} onToggle={toggleSidebar} />
      )}

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

      {/* Main content area */}
      <div
        className="flex min-h-screen flex-col transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Header */}
        <Header
          onMenuClick={toggleMobileMenu}
          showMenuButton={isMobile}
        />

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 text-center text-sm text-muted">
          <p>{t('common:footer.copyright', { year: new Date().getFullYear() })}</p>
        </footer>
      </div>
    </div>
  )
}