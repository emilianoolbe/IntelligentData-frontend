import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { ScrapingFormState, ScrapingFormErrors } from '../types'
import { AVAILABLE_PRODUCTS, AVAILABLE_MONTHS, getAvailableYears } from '../types'

interface ScrapingFormProps {
  onSubmit: (data: ScrapingFormState) => void
  isLoading?: boolean
}

const initialFormState: ScrapingFormState = {
  product: '',
  month: '',
  year: '',
  customUrl: '',
}

export function ScrapingForm({ onSubmit, isLoading = false }: ScrapingFormProps) {
  const { t } = useTranslation('scraping')
  const [formState, setFormState] = useState<ScrapingFormState>(initialFormState)
  const [errors, setErrors] = useState<ScrapingFormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: ScrapingFormErrors = {}

    if (!formState.product) {
      newErrors.product = t('form.errors.productRequired')
    }
    if (!formState.month) {
      newErrors.month = t('form.errors.monthRequired')
    }
    if (!formState.year) {
      newErrors.year = t('form.errors.yearRequired')
    }
    if (formState.customUrl && !isValidUrl(formState.customUrl)) {
      newErrors.customUrl = t('form.errors.invalidUrl')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formState)
    }
  }

  const handleReset = () => {
    setFormState(initialFormState)
    setErrors({})
  }

  const handleSelectChange = (field: keyof ScrapingFormState) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleInputChange = (field: keyof ScrapingFormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const availableYears = getAvailableYears()

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Selector */}
        <div className="space-y-2">
          <label htmlFor="product" className="block text-sm font-medium text-primary">
            {t('form.product')} <span className="text-error">*</span>
          </label>
          <select
            id="product"
            value={formState.product}
            onChange={handleSelectChange('product')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="">{t('form.productPlaceholder')}</option>
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

        {/* Month Selector */}
        <div className="space-y-2">
          <label htmlFor="month" className="block text-sm font-medium text-primary">
            {t('form.month')} <span className="text-error">*</span>
          </label>
          <select
            id="month"
            value={formState.month}
            onChange={handleSelectChange('month')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="">{t('form.monthPlaceholder')}</option>
            {AVAILABLE_MONTHS.map((month) => (
              <option key={month} value={month}>
                {t(`months.${month}`)}
              </option>
            ))}
          </select>
          {errors.month && (
            <p className="text-sm text-error">{errors.month}</p>
          )}
        </div>

        {/* Year Selector */}
        <div className="space-y-2">
          <label htmlFor="year" className="block text-sm font-medium text-primary">
            {t('form.year')} <span className="text-error">*</span>
          </label>
          <select
            id="year"
            value={formState.year}
            onChange={handleSelectChange('year')}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            <option value="">{t('form.yearPlaceholder')}</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.year && (
            <p className="text-sm text-error">{errors.year}</p>
          )}
        </div>

        {/* Custom URL */}
        <div className="space-y-2">
          <Input
            id="customUrl"
            label={t('form.customUrl')}
            type="url"
            placeholder={t('form.customUrlPlaceholder')}
            value={formState.customUrl}
            onChange={handleInputChange('customUrl')}
            helperText={t('form.customUrlHelper')}
            disabled={isLoading}
            error={errors.customUrl}
            fullWidth
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t('form.submitting') : t('form.submit')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            {t('form.reset')}
          </Button>
        </div>
      </form>
    </Card>
  )
}