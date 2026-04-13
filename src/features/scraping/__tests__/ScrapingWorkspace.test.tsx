import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScrapingWorkspace } from '../components/ScrapingWorkspace'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'title': 'Manual Scraping',
        'subtitle': 'Extract product data',
        'scheduled.tabs.manual': 'Manual',
        'scheduled.tabs.scheduled': 'Scheduled',
        'scheduled.title': 'Scheduled Scraping',
        'scheduled.description': 'Configure automatic periodic executions',
        'scheduled.form.createTitle': 'New Schedule',
        'scheduled.list.empty': 'No active schedules',
        'scheduled.list.emptyHint': 'Create a new schedule',
        'scheduled.delete.description': 'Are you sure?',
        'scheduled.history.title': 'Execution History',
        'scheduled.history.subtitle': 'History for {{name}}',
        'products.mercadolibre': 'MercadoLibre',
      }
      return translations[key] || key
    },
  }),
}))

// Mock all hooks
vi.mock('../hooks/useScheduledScrape', () => ({
  useSchedules: () => ({
    data: [
      {
        id: '1',
        product: 'mercadolibre',
        frequency: 'daily',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
    isLoading: false,
  }),
  useCreateSchedule: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  usePauseSchedule: () => ({
    mutate: vi.fn(),
  }),
  useResumeSchedule: () => ({
    mutate: vi.fn(),
  }),
  useDeleteSchedule: () => ({
    mutate: vi.fn(),
  }),
  useExecutionHistory: () => ({
    data: { executions: [], total: 0, hasMore: false },
    isLoading: false,
    refetch: vi.fn(),
  }),
}))

vi.mock('../hooks/useManualScrape', () => ({
  useManualScrape: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
    data: null,
  }),
  scrapingKeys: {
    all: ['scraping'],
    manual: () => ['scraping', 'manual'],
    manualLatest: () => ['scraping', 'manual', 'latest'],
  },
}))

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  }
}

describe('ScrapingWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Tab Navigation', () => {
    it('should render both tabs', () => {
      render(<ScrapingWorkspace />, { wrapper: createWrapper() })

      expect(screen.getByText('Manual')).toBeInTheDocument()
      expect(screen.getByText('Scheduled')).toBeInTheDocument()
    })

    it('should show manual tab by default', () => {
      render(<ScrapingWorkspace />, { wrapper: createWrapper() })

      // Manual tab should have active styling
      const manualTab = screen.getByRole('button', { name: /manual/i })
      expect(manualTab).toHaveClass('bg-accent')
    })

    it('should switch to scheduled tab when clicked', async () => {
      render(<ScrapingWorkspace />, { wrapper: createWrapper() })

      const scheduledTab = screen.getByRole('button', { name: /scheduled/i })
      fireEvent.click(scheduledTab)

      await waitFor(() => {
        expect(screen.getByText('Scheduled Scraping')).toBeInTheDocument()
      })
    })

    it('should start with scheduled tab if specified', () => {
      render(<ScrapingWorkspace initialTab="scheduled" />, { wrapper: createWrapper() })

      expect(screen.getByText('Scheduled Scraping')).toBeInTheDocument()
    })
  })

  describe('Manual Tab Content', () => {
    it('should render manual scraping form on manual tab', () => {
      render(<ScrapingWorkspace />, { wrapper: createWrapper() })

      // Check for manual tab header
      expect(screen.getByText('Manual Scraping')).toBeInTheDocument()
    })

    it('should preserve manual tab state when switching tabs', async () => {
      render(<ScrapingWorkspace />, { wrapper: createWrapper() })

      // Switch to scheduled
      const scheduledTab = screen.getByRole('button', { name: /scheduled/i })
      fireEvent.click(scheduledTab)

      // Switch back to manual
      const manualTab = screen.getByRole('button', { name: /manual/i })
      fireEvent.click(manualTab)

      await waitFor(() => {
        expect(screen.getByText('Manual Scraping')).toBeInTheDocument()
      })
    })
  })

  describe('Scheduled Tab Content', () => {
    it('should render schedules list on scheduled tab', async () => {
      render(<ScrapingWorkspace initialTab="scheduled" />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('MercadoLibre')).toBeInTheDocument()
      })
    })

    it('should show create schedule button', async () => {
      render(<ScrapingWorkspace initialTab="scheduled" />, { wrapper: createWrapper() })

      await waitFor(() => {
        expect(screen.getByText('New Schedule')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Interactions', () => {
    it('should open create schedule modal when button clicked', async () => {
      render(<ScrapingWorkspace initialTab="scheduled" />, { wrapper: createWrapper() })

      const createButton = screen.getByText('New Schedule')
      fireEvent.click(createButton)

      await waitFor(() => {
        // Modal should be visible (check for modal content)
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })
  })
})