import { createRoot } from 'react-dom/client'
import { AppProviders } from './app/providers/AppProviders'
import { AppRouter } from './app/router/AppRouter'
import './styles/globals.css'
import './i18n' // Initialize i18n

// Bootstrap auth from localStorage
const bootstrapAuth = () => {
  try {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const { tokens } = JSON.parse(stored)
      if (tokens?.refresh) {
        // Session will be validated by interceptors
        return true
      }
    }
  } catch {
    localStorage.removeItem('auth')
  }
  return false
}

bootstrapAuth()

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <AppRouter />
  </AppProviders>
)