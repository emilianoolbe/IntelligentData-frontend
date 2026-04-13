import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { useManualScrape } from '../hooks/useManualScrape'
import type { ManualScrapeResponse } from '../types'

// Mock the API module
vi.mock('../api/manualScrapeApi', () => ({
  manualScrapeApi: {
    submit: vi.fn(),
  },
}))

import { manualScrapeApi } from '../api/manualScrapeApi'

const mockManualScrapeApi = vi.mocked(manualScrapeApi)

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

describe('useManualScrape', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useManualScrape(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.data).toBe(undefined)
    })

    it('should provide mutate function', () => {
      const { result } = renderHook(() => useManualScrape(), {
        wrapper: createWrapper(),
      })

      expect(typeof result.current.mutate).toBe('function')
    })
  })

  describe('Successful Submission', () => {
    it('should call API with correct data', async () => {
      const mockResponse: ManualScrapeResponse = {
        success: true,
        count: 5,
        items: [
          {
            id: '1',
            title: 'Test Product',
            price: 1000,
            currency: 'ARS',
            url: 'https://test.com/product',
            source: 'mercadolibre',
            available: true,
            scrapedAt: '2024-01-15T10:00:00Z',
          },
        ],
        scrapedAt: '2024-01-15T10:00:00Z',
      }

      mockManualScrapeApi.submit.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useManualScrape(), {
        wrapper: createWrapper(),
      })

      const requestData = {
        product: 'mercadolibre' as const,
        month: '01' as const,
        year: '2024',
      }

      result.current.mutate(requestData)

      await waitFor(() => {
        // React Query v5 passes context object as second param, so we check the first call's first arg
        expect(mockManualScrapeApi.submit).toHaveBeenCalled()
        const callArgs = mockManualScrapeApi.submit.mock.calls[0][0]
        expect(callArgs).toEqual(requestData)
      })
    })

    it('should set data on success', async () => {
      const mockResponse: ManualScrapeResponse = {
        success: true,
        count: 1,
        items: [],
        scrapedAt: '2024-01-15T10:00:00Z',
      }

      mockManualScrapeApi.submit.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useManualScrape(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        product: 'mercadolibre',
        month: '01',
        year: '2024',
      })

      await waitFor(() => {
        expect(result.current.data).toEqual(mockResponse)
        expect(result.current.isSuccess).toBe(true)
      })
    })

    it('should resolve mutation successfully', async () => {
      const mockResponse: ManualScrapeResponse = {
        success: true,
        count: 0,
        items: [],
        scrapedAt: '2024-01-15T10:00:00Z',
      }

      mockManualScrapeApi.submit.mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useManualScrape(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        product: 'mercadolibre',
        month: '01',
        year: '2024',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
        expect(result.current.isPending).toBe(false)
      })
    })
  })

  describe('Error Handling', () => {
    it('should set error on failure', async () => {
      const mockError = new Error('Network error')
      mockManualScrapeApi.submit.mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useManualScrape(), {
        wrapper: createWrapper(),
      })

      result.current.mutate({
        product: 'mercadolibre',
        month: '01',
        year: '2024',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
        expect(result.current.error).toBe(mockError)
      })
    })
  })

  describe('Cache Behavior', () => {
    it('should cache results under correct key', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      })

      const mockResponse: ManualScrapeResponse = {
        success: true,
        count: 2,
        items: [],
        scrapedAt: '2024-01-15T10:00:00Z',
      }

      mockManualScrapeApi.submit.mockResolvedValueOnce(mockResponse)

      const Wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      )

      const { result } = renderHook(() => useManualScrape(), {
        wrapper: Wrapper,
      })

      result.current.mutate({
        product: 'mercadolibre',
        month: '01',
        year: '2024',
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // Check cache
      const cachedData = queryClient.getQueryData(['scraping', 'manual', 'latest'])
      expect(cachedData).toEqual(mockResponse)
    })
  })
})