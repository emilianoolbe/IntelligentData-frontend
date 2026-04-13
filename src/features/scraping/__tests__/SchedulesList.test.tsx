import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { SchedulesList } from '../components/SchedulesList'
import type { ScrapingSchedule } from '../types'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'scheduled.list.empty': 'No active schedules',
        'scheduled.list.emptyHint': 'Create a new schedule to get started',
        'scheduled.list.headers.product': 'Product',
        'scheduled.list.headers.frequency': 'Frequency',
        'scheduled.list.headers.nextRun': 'Next Run',
        'scheduled.list.headers.lastRun': 'Last Run',
        'scheduled.list.headers.status': 'Status',
        'scheduled.list.headers.actions': 'Actions',
        'scheduled.list.actions.pause': 'Pause',
        'scheduled.list.actions.resume': 'Resume',
        'scheduled.list.actions.delete': 'Delete',
        'scheduled.list.actions.viewHistory': 'View history',
        'scheduled.frequencies.daily': 'Daily',
        'scheduled.frequencies.custom': 'Custom',
        'products.mercadolibre': 'MercadoLibre',
        'products.amazon': 'Amazon',
      }
      return translations[key] || key
    },
  }),
}))

describe('SchedulesList', () => {
  const mockSchedules: ScrapingSchedule[] = [
    {
      id: '1',
      product: 'mercadolibre',
      frequency: 'daily',
      isActive: true,
      lastStatus: 'success',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      nextRunAt: '2024-01-16T10:00:00Z',
      lastRunAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      product: 'amazon',
      frequency: 'weekly',
      isActive: false,
      lastStatus: 'failed',
      createdAt: '2024-01-14T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ]

  const defaultProps = {
    schedules: mockSchedules,
    isLoading: false,
    onPause: vi.fn(),
    onResume: vi.fn(),
    onDelete: vi.fn(),
    onViewHistory: vi.fn(),
    actingUponIds: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render table with schedules', () => {
      render(<SchedulesList {...defaultProps} />)

      expect(screen.getByText('MercadoLibre')).toBeInTheDocument()
      expect(screen.getByText('Amazon')).toBeInTheDocument()
    })

    it('should show loading state', () => {
      render(<SchedulesList {...defaultProps} isLoading={true} />)

      // Check for the spinner element with animate-spin class
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('should show empty state when no schedules', () => {
      render(<SchedulesList {...defaultProps} schedules={[]} />)

      expect(screen.getByText('No active schedules')).toBeInTheDocument()
      expect(screen.getByText('Create a new schedule to get started')).toBeInTheDocument()
    })
  })

  describe('Status Display', () => {
    it('should show active status badge for active schedules', () => {
      render(<SchedulesList {...defaultProps} />)

      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should show paused status badge for paused schedules', () => {
      render(<SchedulesList {...defaultProps} />)

      expect(screen.getByText('Paused')).toBeInTheDocument()
    })

    it('should show execution status when available', () => {
      render(<SchedulesList {...defaultProps} />)

      expect(screen.getByText('Success')).toBeInTheDocument()
      expect(screen.getByText('Failed')).toBeInTheDocument()
    })
  })

  describe('Actions', () => {
    it('should show pause button for active schedules', () => {
      const onPause = vi.fn()
      render(<SchedulesList {...defaultProps} onPause={onPause} />)

      const pauseButtons = screen.getAllByRole('button', { name: /pause/i })
      fireEvent.click(pauseButtons[0])

      expect(onPause).toHaveBeenCalledWith('1')
    })

    it('should show resume button for paused schedules', () => {
      const onResume = vi.fn()
      render(<SchedulesList {...defaultProps} onResume={onResume} />)

      const resumeButtons = screen.getAllByRole('button', { name: /resume/i })
      fireEvent.click(resumeButtons[0])

      expect(onResume).toHaveBeenCalledWith('2')
    })

    it('should call onViewHistory when history button clicked', () => {
      const onViewHistory = vi.fn()
      render(<SchedulesList {...defaultProps} onViewHistory={onViewHistory} />)

      const historyButtons = screen.getAllByRole('button', { name: /view history/i })
      fireEvent.click(historyButtons[0])

      expect(onViewHistory).toHaveBeenCalledWith('1')
    })

    it('should disable buttons when acting upon', () => {
      render(<SchedulesList {...defaultProps} actingUponIds={['1']} />)

      const pauseButtons = screen.getAllByRole('button', { name: /pause/i })
      expect(pauseButtons[0]).toBeDisabled()
    })
  })

  describe('Frequency Display', () => {
    it('should show frequency label', () => {
      render(<SchedulesList {...defaultProps} />)

      expect(screen.getByText('Daily')).toBeInTheDocument()
    })

    it('should show cron expression for custom frequency', () => {
      const scheduleWithCron: ScrapingSchedule[] = [
        {
          id: '1',
          product: 'mercadolibre',
          frequency: 'custom',
          cronExpression: '0 0 * * *',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      render(<SchedulesList {...defaultProps} schedules={scheduleWithCron} />)

      expect(screen.getByText('Custom')).toBeInTheDocument()
      expect(screen.getByText('0 0 * * *')).toBeInTheDocument()
    })
  })
})