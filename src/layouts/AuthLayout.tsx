import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { logoSimple } from '@/assets'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logoSimple}
            alt="IntelligentData"
            className="h-12 w-auto"
          />
        </div>

        {/* Card */}
        <div
          className={cn(
            'rounded-xl border border-border bg-elevated p-8 shadow-lg',
            'space-y-6'
          )}
        >
          {/* Header */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted">{subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}