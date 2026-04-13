import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useJobNotifications, useSchedulePolling } from '../hooks/useJobNotifications'
import type { ScrapingSchedule } from '../types'

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (params) {
        return `${key} ${JSON.stringify(params)}`
      }
      return key
    },
  }),
}))

import { toast } from 'sonner'

const mockToast = vi.mocked(toast)

describe('useJobNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hasActiveJobs', () => {
    it('should return true when there are active jobs', () => {
      const schedules: ScrapingSchedule[] = [
        {
          id: '1',
          product: 'mercadolibre',
          frequency: 'daily',
          isActive: true,
          lastStatus: 'running',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      const { result } = renderHook(() => useJobNotifications(schedules))

      expect(result.current.hasActiveJobs).toBe(true)
    })

    it('should return true when isActive is true', () => {
      const schedules: ScrapingSchedule[] = [
        {
          id: '1',
          product: 'mercadolibre',
          frequency: 'daily',
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      const { result } = renderHook(() => useJobNotifications(schedules))

      expect(result.current.hasActiveJobs).toBe(true)
    })

    it('should return false when no active jobs', () => {
      const schedules: ScrapingSchedule[] = [
        {
          id: '1',
          product: 'mercadolibre',
          frequency: 'daily',
          isActive: false,
          lastStatus: 'success',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
      ]

      const { result } = renderHook(() => useJobNotifications(schedules))

      expect(result.current.hasActiveJobs).toBe(false)
    })

    it('should return false when empty array', () => {
      const { result } = renderHook(() => useJobNotifications([]))

      expect(result.current.hasActiveJobs).toBe(false)
    })
  })

  describe('clearNotifications', () => {
    it('should provide clearNotifications function', () => {
      const { result } = renderHook(() => useJobNotifications([]))

      expect(typeof result.current.clearNotifications).toBe('function')
    })
  })
})

describe('useSchedulePolling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return interval when there are active jobs', () => {
    const schedules: ScrapingSchedule[] = [
      {
        id: '1',
        product: 'mercadolibre',
        frequency: 'daily',
        isActive: true,
        lastStatus: 'running',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ]

    const { result } = renderHook(() => useSchedulePolling(schedules))

    expect(result.current).toBe(30000)
  })

  it('should return custom interval when specified', () => {
    const schedules: ScrapingSchedule[] = [
      {
        id: '1',
        product: 'mercadolibre',
        frequency: 'daily',
        isActive: true,
        lastStatus: 'running',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ]

    const { result } = renderHook(() => useSchedulePolling(schedules, 15000))

    expect(result.current).toBe(15000)
  })

  it('should return false when no active jobs', () => {
    const schedules: ScrapingSchedule[] = [
      {
        id: '1',
        product: 'mercadolibre',
        frequency: 'daily',
        isActive: false,
        lastStatus: 'success',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ]

    const { result } = renderHook(() => useSchedulePolling(schedules))

    expect(result.current).toBe(false)
  })

  it('should return false when empty array', () => {
    const { result } = renderHook(() => useSchedulePolling([]))

    expect(result.current).toBe(false)
  })
})