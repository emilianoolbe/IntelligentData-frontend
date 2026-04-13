import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { ReactNode } from 'react'
import { LoginPage, RegisterPage } from '@/features/auth/pages'
import { ScrapingPage } from '@/features/scraping/pages/ScrapingPage'
import { PrivateLayout } from '@/layouts/PrivateLayout'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import type { RootState } from '@/app/store'

// ============================================
// Protected Route Guard
// ============================================

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// ============================================
// Public Route (redirect if authenticated)
// ============================================

interface PublicRouteProps {
  children: ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

// ============================================
// Placeholder Pages
// ============================================

function FiltersPage() {
  return (
    <div className="rounded-xl border border-border bg-elevated p-6">
      <h2 className="mb-4 text-xl font-semibold">Filtros</h2>
      <p className="text-muted">Página de filtros - En desarrollo</p>
    </div>
  )
}

function ChartsPage() {
  return (
    <div className="rounded-xl border border-border bg-elevated p-6">
      <h2 className="mb-4 text-xl font-semibold">Gráficos</h2>
      <p className="text-muted">Página de gráficos - En desarrollo</p>
    </div>
  )
}

function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-elevated p-6">
        <h2 className="mb-4 text-xl font-semibold">Configuración</h2>
        
        <div className="space-y-4">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">Tema</h3>
              <p className="text-sm text-muted">
                {theme === 'dark' ? 'Modo oscuro activo' : 'Modo claro activo'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-tertiary"
            >
              Cambiar a {theme === 'dark' ? 'claro' : 'oscuro'}
            </button>
          </div>
          
          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-primary">Idioma</h3>
              <p className="text-sm text-muted">Español (predeterminado)</p>
            </div>
            <button
              disabled
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-muted cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-elevated p-6">
        <h2 className="mb-4 text-xl font-semibold">Bienvenido</h2>
        {user && (
          <div className="space-y-2 text-secondary">
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-elevated p-6">
        <h3 className="mb-4 text-lg font-semibold">Resumen</h3>
        <p className="text-muted">
          El dashboard completo se implementará en un cambio futuro con gráficos de precios y estadísticas.
        </p>
      </div>
    </div>
  )
}

// ============================================
// App Router
// ============================================

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes - Wrapped in PrivateLayout */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scraping" element={<ScrapingPage />} />
          <Route path="/filters" element={<FiltersPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}