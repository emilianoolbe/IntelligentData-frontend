import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'

export function LoginPage() {
  const { t } = useTranslation()
  const { login, isLoading, error, clearAuthError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    clearAuthError()

    // Validation
    if (!email.trim()) {
      setLocalError(t('auth:login.errors.emailRequired'))
      return
    }
    if (!email.includes('@')) {
      setLocalError(t('auth:login.errors.emailInvalid'))
      return
    }
    if (!password.trim()) {
      setLocalError(t('auth:login.errors.passwordRequired'))
      return
    }

    const result = await login({ email, password })
    if (!result.success) {
      setLocalError(result.error || t('auth:login.errors.invalidCredentials'))
    }
  }

  const displayError = localError || error

  return (
    <AuthLayout
      title={t('auth:login.title')}
      subtitle={t('auth:login.subtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {displayError && (
          <div className="rounded-lg bg-error-muted p-3 text-sm text-error">
            {displayError}
          </div>
        )}

        <Input
          label={t('auth:login.email')}
          type="email"
          placeholder={t('auth:login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <Input
          label={t('auth:login.password')}
          type="password"
          placeholder={t('auth:login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          {t('auth:login.submit')}
        </Button>

        <p className="text-center text-sm text-muted">
          {t('auth:login.noAccount')}{' '}
          <Link
            to="/register"
            className="text-accent hover:text-accent-hover underline"
          >
            {t('auth:login.register')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}