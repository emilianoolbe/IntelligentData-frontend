// ============================================
// ScheduleForm Component
// ============================================
// Modal form for creating/editing scheduled scraping jobs

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { 
  CreateScheduleRequest, 
  ScheduleFrequency, 
  ScrapingProduct 
} from '../types'
import { AVAILABLE_PRODUCTS } from '../types'

// ============================================
// Types
// ============================================

export interface ScheduleFormProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Callback when form is submitted */
  onSubmit: (data: CreateScheduleRequest) => void
  /** Whether the form is submitting */
  isLoading?: boolean
}

interface FormState {
  product: ScrapingProduct | ''
  frequency: ScheduleFrequency | ''
  cronExpression: string
}

interface FormErrors {
  product?: string
  frequency?: string
  cronExpression?: string
}

// ============================================
// Frequency Options
// ============================================

const FREQUENCY_OPTIONS: ScheduleFrequency[] = ['hourly', 'daily', 'weekly', 'monthly', 'custom']

// ============================================
// Cron Validation
// ============================================

/**
 * Validates a cron expression.
 * Basic validation: 5 or 6fields, each with valid characters.
 */
function isValidCron(expression: string): boolean {
  if (!expression.trim()) return false
  
  const parts = expression.trim().split(/\s+/)
  if (parts.length <5 || parts.length > 6) return false
  
  // Basic pattern: allow numbers, *, /, ,, -
  const validPattern = /^[0-9*,/\-]+$/
  return parts.every(part => validPattern.test(part))
}

// ============================================
// Component
// ============================================

export function ScheduleForm({
  open,
  onClose,
  onSubmit,
  isLoading = false,
}: ScheduleFormProps) {
  const { t } = useTranslation('scraping')
  
  const [formState, setFormState] = useState<FormState>({
    product: '',
    frequency: '',
    cronExpression: '',
  })
  
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formState.product) {
      newErrors.product = t('scheduled.form.errors.productRequired')
    }
    if (!formState.frequency) {
      newErrors.frequency = t('scheduled.form.errors.frequencyRequired')
    }
    if (formState.frequency === 'custom' && !isValidCron(formState.cronExpression)) {
      newErrors.cronExpression = t('scheduled.form.errors.invalidCron')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const request: CreateScheduleRequest = {
        product: formState.product as ScrapingProduct,
        frequency: formState.frequency as ScheduleFrequency,
        cronExpression: formState.frequency === 'custom' 
          ? formState.cronExpression 
          : undefined,
      }
      onSubmit(request)
    }
  }

  const handleReset = () => {
    setFormState({
      product: '',
      frequency: '',
      cronExpression: '',
    })
    setErrors({})
    onClose()
  }

  const handleSelectChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleInputChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const showCronInput = formState.frequency === 'custom'

  return (
    <Modal
      open={open}
      onClose={handleReset}
      title={t('scheduled.form.createTitle')}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selector */}
        <div className="space-y-2">
          <label htmlFor="schedule-product" className="block text-sm font-medium text-primary">
            {t('scheduled.form.product')} <span className="text-error">*</span>
          </label>
          <select
            id="schedule-product"
            value={formState.product}
            onChange={handleSelectChange('product')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="">{t('scheduled.form.productPlaceholder')}</option>
            {AVAILABLE_PRODUCTS.map((product) => (
              <option key={product} value={product}>
                {t(`products.${product}`)}
              </option>
            ))}
          </select>
          {errors.product && (
            <p className="text-sm text-error">{errors.product}</p>
          )}
        </div>

        {/* Frequency Selector */}
        <div className="space-y-2">
          <label htmlFor="schedule-frequency" className="block text-sm font-medium text-primary">
            {t('scheduled.form.frequency')} <span className="text-error">*</span>
          </label>
          <select
            id="schedule-frequency"
            value={formState.frequency}
            onChange={handleSelectChange('frequency')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="">{t('scheduled.form.frequencyPlaceholder')}</option>
            {FREQUENCY_OPTIONS.map((freq) => (
              <option key={freq} value={freq}>
                {t(`scheduled.frequencies.${freq}`)}
              </option>
            ))}
          </select>
          {errors.frequency && (
            <p className="text-sm text-error">{errors.frequency}</p>
          )}
        </div>

        {/* Custom Cron Expression */}
        {showCronInput && (
          <div className="space-y-2">
            <Input
              id="schedule-cron"
              label={t('scheduled.form.customCron')}
              type="text"
              placeholder={t('scheduled.form.customCronPlaceholder')}
              value={formState.cronExpression}
              onChange={handleInputChange('cronExpression')}
              helperText={t('scheduled.form.customCronHelper')}
              disabled={isLoading}
              error={errors.cronExpression}
              fullWidth
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            {t('scheduled.delete.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t('scheduled.form.submitting') : t('scheduled.form.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}