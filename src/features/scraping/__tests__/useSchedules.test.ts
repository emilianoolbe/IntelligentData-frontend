import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { useSchedules, useSchedule, useExecutionHistory } from '../hooks/useScheduledScrape'
import type { ScrapingSchedule, ListSchedulesResponse, ExecutionHistoryResponse } from '../types'

// Mock the API module
vi.mock('../api/scheduledScrapeApi', () => ({
  scheduledScrapeApi: {
    list: vi.fn(),
    get: vi.fn(),
    getHistory: vi.fn(),
  },
}))

import { scheduledScrapeApi } from '../api/scheduledScrapeApi'

const mockApi = vi.mocked(scheduledScrapeApi)

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

describe('useSchedules', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      mockApi.list.mockResolvedValueOnce({ schedules: [], total: 0 })

      const { result } = renderHook(() => useSchedules(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBe(undefined)
    })
  })

  describe('Successful Fetch', () => {
    it('should fetch and return schedules', async () => {
      const mockSchedules: ScrapingSchedule[] = [
        {
          id: '1',
          product: 'mercadolibre',
          frequency: 'daily',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      const mockResponse: ListSchedulesResponse = {
        schedules: mockSchedules,
        total: 1,
      }

      mockApi.list.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useSchedules(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(result.current.data).toEqual(mockSchedules)
      })
    })

    it('should return empty array when no schedules', async () => {
      mockApi.list.mockResolvedValueOnce({ schedules: [], total: 0 })

      const { result } = renderHook(() => useSchedules(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(result.current.data).toEqual([])
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle fetch errors', async () => {
      mockApi.list.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useSchedules(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
        expect(result.current.error).toBeInstanceOf(Error)
      })
    })
  })
})

describe('useSchedule', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch a single schedule by ID', async () => {
    const mockSchedule: ScrapingSchedule = {
      id: '123',
      product: 'mercadolibre',
      frequency: 'daily',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }

    mockApi.get.mockResolvedValueOnce(mockSchedule)

    const { result } = renderHook(() => useSchedule('123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockSchedule)
    })
  })

  it('should not fetch when ID is empty', () => {
    const { result } = renderHook(() => useSchedule(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockApi.get).not.toHaveBeenCalled()
  })
})

describe('useExecutionHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch execution history for a schedule', async () => {
    const mockResponse: ExecutionHistoryResponse = {
      executions: [
        {
          id: 'exec-1',
          scheduleId: 'schedule-1',
          startedAt: '2024-01-15T10:00:00Z',
          status: 'success',
          itemsCount: 10,
        },
      ],
      total: 1,
      hasMore: false,
    }

    mockApi.getHistory.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useExecutionHistory('schedule-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockResponse)
    })
  })

  it('should not fetch when scheduleId is empty', () => {
    const { result } = renderHook(() => useExecutionHistory(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockApi.getHistory).not.toHaveBeenCalled()
  })
})