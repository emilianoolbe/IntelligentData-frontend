import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import {
  useCreateSchedule,
  usePauseSchedule,
  useResumeSchedule,
  useDeleteSchedule,
} from '../hooks/useScheduledScrape'
import type { ScrapingSchedule, CreateScheduleRequest } from '../types'

// Mock the API module
vi.mock('../api/scheduledScrapeApi', () => ({
  scheduledScrapeApi: {
    create: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import { scheduledScrapeApi } from '../api/scheduledScrapeApi'
import { toast } from 'sonner'

const mockApi = vi.mocked(scheduledScrapeApi)
const mockToast = vi.mocked(toast)

// Create wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    )
  }
}

describe('useCreateSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a schedule successfully', async () => {
    const mockSchedule: ScrapingSchedule = {
      id: 'new-schedule',
      product: 'mercadolibre',
      frequency: 'daily',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    mockApi.create.mockResolvedValueOnce(mockSchedule)

    const { result } = renderHook(() => useCreateSchedule(), {
      wrapper: createWrapper(),
    })

    const request: CreateScheduleRequest = {
      product: 'mercadolibre',
      frequency: 'daily',
    }

    result.current.mutate(request)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockSchedule)
    })

    expect(mockApi.create).toHaveBeenCalledWith(request)
    expect(mockToast.success).toHaveBeenCalledWith('scraping:scheduled.notifications.jobCreated')
  })

  it('should show error toast on failure', async () => {
    mockApi.create.mockRejectedValueOnce(new Error('Creation failed'))

    const { result } = renderHook(() => useCreateSchedule(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      product: 'mercadolibre',
      frequency: 'daily',
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockToast.error).toHaveBeenCalled()
  })
})

describe('usePauseSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should pause a schedule successfully', async () => {
    const mockSchedule: ScrapingSchedule = {
      id: 'schedule-1',
      product: 'mercadolibre',
      frequency: 'daily',
      isActive: false,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
    }

    mockApi.pause.mockResolvedValueOnce(mockSchedule)

    const { result } = renderHook(() => usePauseSchedule(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('schedule-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.pause).toHaveBeenCalledWith('schedule-1')
    expect(mockToast.success).toHaveBeenCalledWith('scraping:scheduled.notifications.jobPaused')
  })
})

describe('useResumeSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should resume a schedule successfully', async () => {
    const mockSchedule: ScrapingSchedule = {
      id: 'schedule-1',
      product: 'mercadolibre',
      frequency: 'daily',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
    }

    mockApi.resume.mockResolvedValueOnce(mockSchedule)

    const { result } = renderHook(() => useResumeSchedule(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('schedule-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.resume).toHaveBeenCalledWith('schedule-1')
    expect(mockToast.success).toHaveBeenCalledWith('scraping:scheduled.notifications.jobResumed')
  })
})

describe('useDeleteSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete a schedule successfully', async () => {
    mockApi.delete.mockResolvedValueOnce(undefined)

    const { result } = renderHook(() => useDeleteSchedule(), {
      wrapper: createWrapper(),
    })

    result.current.mutate('schedule-1')

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockApi.delete).toHaveBeenCalledWith('schedule-1')
    expect(mockToast.success).toHaveBeenCalledWith('scraping:scheduled.notifications.jobDeleted')
  })
})