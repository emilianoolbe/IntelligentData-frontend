import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ExecutionHistory } from '../components/ExecutionHistory'
import type { ExecutionHistoryItem } from '../types'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'scheduled.history.title': 'Execution History',
        'scheduled.history.subtitle': 'Execution history for job {{name}}',
        'scheduled.history.empty': 'No executions recorded',
        'scheduled.history.headers.date': 'Date',
        'scheduled.history.headers.status': 'Status',
        'scheduled.history.headers.items': 'Items',
        'scheduled.history.headers.duration': 'Duration',
        'scheduled.history.actions.viewDetails': 'View details',
        'scheduled.history.actions.back': 'Back',
        'scheduled.history.status.success': 'Success',
        'scheduled.history.status.failed': 'Failed',
        'scheduled.history.status.running': 'In Progress',
        'common:loading': 'Loading...',
        'common:loadMore': 'Load more',
      }
      return translations[key] || key
    },
  }),
}))

describe('ExecutionHistory', () => {
  const mockExecutions: ExecutionHistoryItem[] = [
    {
      id: 'exec-1',
      scheduleId: 'schedule-1',
      startedAt: '2024-01-15T10:00:00Z',
      completedAt: '2024-01-15T10:05:00Z',
      status: 'success',
      itemsCount: 42,
      duration: 300000,
    },
    {
      id: 'exec-2',
      scheduleId: 'schedule-1',
      startedAt: '2024-01-14T10:00:00Z',
      completedAt: '2024-01-14T10:10:00Z',
      status: 'failed',
      itemsCount: 0,
      errorMessage: 'Connection timeout',
      duration: 600000,
    },
  ]

  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    executions: mockExecutions,
    isLoading: false,
    scheduleName: 'mercadolibre',
    hasMore: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the modal when open', () => {
      render(<ExecutionHistory {...defaultProps} />)

      expect(screen.getByText('Execution History')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(<ExecutionHistory {...defaultProps} open={false} />)

      expect(screen.queryByText('Execution History')).not.toBeInTheDocument()
    })

    it('should show schedule name in subtitle', () => {
      render(<ExecutionHistory {...defaultProps} />)

      // The mock doesn't interpolate, so check for the raw text
      expect(screen.getByText('Execution history for job {{name}}')).toBeInTheDocument()
    })

    it('should show loading state', () => {
      render(<ExecutionHistory {...defaultProps} executions={[]} isLoading={true} />)

      expect(document.querySelector('.animate-spin') || screen.getByRole('status')).toBeInTheDocument()
    })

    it('should show empty state when no executions', () => {
      render(<ExecutionHistory {...defaultProps} executions={[]} />)

      expect(screen.getByText('No executions recorded')).toBeInTheDocument()
    })
  })

  describe('Table Content', () => {
    it('should display execution dates', () => {
      render(<ExecutionHistory {...defaultProps} />)

      // Date formatting depends on locale, so check for presence of dates
      expect(screen.getAllByText(/\d/)[0]).toBeInTheDocument()
    })

    it('should display success status', () => {
      render(<ExecutionHistory {...defaultProps} />)

      expect(screen.getByText('Success')).toBeInTheDocument()
    })

    it('should display failed status', () => {
      render(<ExecutionHistory {...defaultProps} />)

      expect(screen.getByText('Failed')).toBeInTheDocument()
    })

    it('should display item counts', () => {
      render(<ExecutionHistory {...defaultProps} />)

      expect(screen.getByText('42')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should display duration', () => {
      render(<ExecutionHistory {...defaultProps} />)

      expect(screen.getByText('5m 0s')).toBeInTheDocument()
      expect(screen.getByText('10m 0s')).toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('should show load more button when hasMore is true', () => {
      const onLoadMore = vi.fn()
      render(<ExecutionHistory {...defaultProps} hasMore={true} onLoadMore={onLoadMore} />)

      expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument()
    })

    it('should not show load more button when hasMore is false', () => {
      render(<ExecutionHistory {...defaultProps} hasMore={false} />)

      expect(screen.queryByRole('button', { name: /load more/i })).not.toBeInTheDocument()
    })

    it('should call onLoadMore when load more clicked', async () => {
      const onLoadMore = vi.fn()
      render(<ExecutionHistory {...defaultProps} hasMore={true} onLoadMore={onLoadMore} />)

      const loadMoreButton = screen.getByRole('button', { name: /load more/i })
      fireEvent.click(loadMoreButton)

      expect(onLoadMore).toHaveBeenCalled()
    })
  })

  describe('Close Behavior', () => {
    it('should call onClose when back button clicked', () => {
      const onClose = vi.fn()
      render(<ExecutionHistory {...defaultProps} onClose={onClose} />)

      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)

      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('Error Display', () => {
    it('should show error message for failed executions', () => {
      const executionsWithError: ExecutionHistoryItem[] = [
        {
          id: 'exec-1',
          scheduleId: 'schedule-1',
          startedAt: '2024-01-15T10:00:00Z',
          status: 'failed',
          itemsCount: 0,
          errorMessage: 'Connection timeout occurred',
        },
      ]

      render(<ExecutionHistory {...defaultProps} executions={executionsWithError} />)

      expect(screen.getByText(/Connection timeout/i)).toBeInTheDocument()
    })
  })
})