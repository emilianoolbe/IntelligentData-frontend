// ============================================
// Scheduled Scraping React Query Hooks
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { scheduledScrapeApi } from '../api/scheduledScrapeApi'
import { scrapingKeys } from '../types'
import type { CreateScheduleRequest, UpdateScheduleRequest } from '../types'
import { toast } from 'sonner'

// ============================================
// Query Hooks
// ============================================

/** Hook to fetch all schedules */
export function useSchedules() {
  return useQuery({
    queryKey: scrapingKeys.schedules(),
    queryFn: scheduledScrapeApi.list,
    select: (data) => data.schedules,
  })
}

/** Hook to fetch a single schedule */
export function useSchedule(id: string) {
  return useQuery({
    queryKey: scrapingKeys.schedule(id),
    queryFn: () => scheduledScrapeApi.get(id),
    enabled: !!id,
  })
}

/** Hook to fetch execution history for a schedule */
export function useExecutionHistory(scheduleId: string, limit = 20) {
  return useQuery({
    queryKey: scrapingKeys.executions(scheduleId),
    queryFn: () => scheduledScrapeApi.getHistory(scheduleId, { limit }),
    enabled: !!scheduleId,
  })
}

// ============================================
// Mutation Hooks
// ============================================

/** Hook to create a new schedule */
export function useCreateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateScheduleRequest) => scheduledScrapeApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedules() })
      toast.success('scraping:scheduled.notifications.jobCreated')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`scraping:scheduled.notifications.errorPrefix${message}`)
    },
  })
}

/** Hook to update a schedule */
export function useUpdateSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScheduleRequest }) =>
      scheduledScrapeApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedules() })
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedule(variables.id) })
      toast.success('scraping:scheduled.notifications.jobUpdated')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`scraping:scheduled.notifications.errorPrefix${message}`)
    },
  })
}

/** Hook to delete a schedule */
export function useDeleteSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => scheduledScrapeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedules() })
      toast.success('scraping:scheduled.notifications.jobDeleted')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`scraping:scheduled.notifications.errorPrefix${message}`)
    },
  })
}

/** Hook to pause a schedule */
export function usePauseSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => scheduledScrapeApi.pause(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedules() })
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedule(id) })
      toast.success('scraping:scheduled.notifications.jobPaused')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`scraping:scheduled.notifications.errorPrefix${message}`)
    },
  })
}

/** Hook to resume a schedule */
export function useResumeSchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => scheduledScrapeApi.resume(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedules() })
      queryClient.invalidateQueries({ queryKey: scrapingKeys.schedule(id) })
      toast.success('scraping:scheduled.notifications.jobResumed')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`scraping:scheduled.notifications.errorPrefix${message}`)
    },
  })
}