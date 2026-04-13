import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { ScheduleForm } from '../components/ScheduleForm'
import type { CreateScheduleRequest } from '../types'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'scheduled.form.createTitle': 'New Schedule',
        'scheduled.form.product': 'Product',
        'scheduled.form.productPlaceholder': 'Select a product',
        'scheduled.form.frequency': 'Frequency',
        'scheduled.form.frequencyPlaceholder': 'Select frequency',
        'scheduled.form.customCron': 'Custom Cron Expression',
        'scheduled.form.customCronPlaceholder': '0 0 * * *',
        'scheduled.form.customCronHelper': 'Format: minute hour day-of-month month day-of-week',
        'scheduled.form.submit': 'Save schedule',
        'scheduled.form.submitting': 'Saving...',
        'scheduled.form.errors.productRequired': 'Product is required',
        'scheduled.form.errors.frequencyRequired': 'Frequency is required',
        'scheduled.form.errors.invalidCron': 'Invalid cron expression',
        'scheduled.delete.cancel': 'Cancel',
        'scheduled.frequencies.hourly': 'Hourly',
        'scheduled.frequencies.daily': 'Daily',
        'scheduled.frequencies.weekly': 'Weekly',
        'scheduled.frequencies.monthly': 'Monthly',
        'scheduled.frequencies.custom': 'Custom',
        'products.mercadolibre': 'MercadoLibre',
        'products.amazon': 'Amazon',
        'products.fravega': 'Fravega',
      }
      return translations[key] || key
    },
  }),
}))

describe('ScheduleForm', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the form when open', () => {
      render(<ScheduleForm {...defaultProps} />)

      expect(screen.getByText('New Schedule')).toBeInTheDocument()
      expect(screen.getByLabelText(/product/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(<ScheduleForm {...defaultProps} open={false} />)

      expect(screen.queryByText('New Schedule')).not.toBeInTheDocument()
    })

    it('should show cron input when frequency is custom', async () => {
      render(<ScheduleForm {...defaultProps} />)

      const frequencySelect = screen.getByLabelText(/frequency/i)
      fireEvent.change(frequencySelect, { target: { value: 'custom' } })

      await waitFor(() => {
        expect(screen.getByLabelText(/custom cron/i)).toBeInTheDocument()
      })
    })
  })

  describe('Validation', () => {
    it('should show error when product is not selected', async () => {
      render(<ScheduleForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /save schedule/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Product is required')).toBeInTheDocument()
      })
    })

    it('should show error when frequency is not selected', async () => {
      render(<ScheduleForm {...defaultProps} />)

      const productSelect = screen.getByLabelText(/product/i)
      fireEvent.change(productSelect, { target: { value: 'mercadolibre' } })

      const submitButton = screen.getByRole('button', { name: /save schedule/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Frequency is required')).toBeInTheDocument()
      })
    })

    it('should validate cron expression for custom frequency', async () => {
      render(<ScheduleForm {...defaultProps} />)

      // Select product
      const productSelect = screen.getByLabelText(/product/i)
      fireEvent.change(productSelect, { target: { value: 'mercadolibre' } })

      // Select custom frequency
      const frequencySelect = screen.getByLabelText(/frequency/i)
      fireEvent.change(frequencySelect, { target: { value: 'custom' } })

      // Enter invalid cron
      const cronInput = screen.getByLabelText(/custom cron/i)
      fireEvent.change(cronInput, { target: { value: 'invalid' } })

      const submitButton = screen.getByRole('button', { name: /save schedule/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid cron expression')).toBeInTheDocument()
      })
    })

    it('should accept valid cron expressions', async () => {
      const onSubmit = vi.fn()
      render(<ScheduleForm {...defaultProps} onSubmit={onSubmit} />)

      // Select product
      const productSelect = screen.getByLabelText(/product/i)
      fireEvent.change(productSelect, { target: { value: 'mercadolibre' } })

      // Select custom frequency
      const frequencySelect = screen.getByLabelText(/frequency/i)
      fireEvent.change(frequencySelect, { target: { value: 'custom' } })

      // Enter valid cron
      const cronInput = screen.getByLabelText(/custom cron/i)
      fireEvent.change(cronInput, { target: { value: '0 0 * * *' } })

      const submitButton = screen.getByRole('button', { name: /save schedule/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          product: 'mercadolibre',
          frequency: 'custom',
          cronExpression: '0 0 * * *',
        })
      })
    })
  })

  describe('Form Submission', () => {
    it('should submit with correct data for predefined frequency', async () => {
      const onSubmit = vi.fn()
      render(<ScheduleForm {...defaultProps} onSubmit={onSubmit} />)

      // Select product
      const productSelect = screen.getByLabelText(/product/i)
      fireEvent.change(productSelect, { target: { value: 'mercadolibre' } })

      // Select frequency
      const frequencySelect = screen.getByLabelText(/frequency/i)
      fireEvent.change(frequencySelect, { target: { value: 'daily' } })

      const submitButton = screen.getByRole('button', { name: /save schedule/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          product: 'mercadolibre',
          frequency: 'daily',
          cronExpression: undefined,
        })
      })
    })

    it('should call onClose when cancel is clicked', async () => {
      const onClose = vi.fn()
      render(<ScheduleForm {...defaultProps} onClose={onClose} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Loading State', () => {
    it('should disable form when loading', () => {
      render(<ScheduleForm {...defaultProps} isLoading={true} />)

      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    })
  })
})