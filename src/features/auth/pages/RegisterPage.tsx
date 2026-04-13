import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthLayout } from '@/layouts/AuthLayout'

// Note: Backend register endpoint may not be implemented yet
// This is a scaffold ready for when the API is available

export function RegisterPage() {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Validation
    if (!username.trim()) {
      setLocalError(t('auth:register.errors.usernameRequired'))
      return
    }
    if (!email.trim()) {
      setLocalError(t('auth:register.errors.emailRequired'))
      return
    }
    if (!email.includes('@')) {
      setLocalError(t('auth:register.errors.emailInvalid'))
      return
    }
    if (!password.trim()) {
      setLocalError(t('auth:register.errors.passwordRequired'))
      return
    }
    if (password.length < 8) {
      setLocalError(t('auth:register.errors.passwordMinLength'))
      return
    }
    if (password !== confirmPassword) {
      setLocalError(t('auth:register.errors.passwordMismatch'))
      return
    }

    // TODO: Call register API when available
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLocalError(t('auth:register.errors.notAvailable') || 'Registration not available yet')
    setIsLoading(false)
  }

  return (
    <AuthLayout
      title={t('auth:register.title')}
      subtitle={t('auth:register.subtitle')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {localError && (
          <div className="rounded-lg bg-error-muted p-3 text-sm text-error">
            {localError}
          </div>
        )}

        <Input
          label={t('auth:register.username')}
          type="text"
          placeholder={t('auth:register.usernamePlaceholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />

        <Input
          label={t('auth:register.email')}
          type="email"
          placeholder={t('auth:register.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <Input
          label={t('auth:register.password')}
          type="password"
          placeholder={t('auth:register.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={t('auth:register.passwordHelper')}
          fullWidth
        />

        <Input
          label={t('auth:register.confirmPassword')}
          type="password"
          placeholder={t('auth:register.confirmPasswordPlaceholder')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          {t('auth:register.submit')}
        </Button>

        <p className="text-center text-sm text-muted">
          {t('auth:register.haveAccount')}{' '}
          <Link
            to="/login"
            className="text-accent hover:text-accent-hover underline"
          >
            {t('auth:register.login')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}