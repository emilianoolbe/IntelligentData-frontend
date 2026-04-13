// ============================================
// Job Notifications Hook
// ============================================
// Tracks job status transitions and triggers toast notifications
// when jobs complete or fail. Uses polling for active jobs only.

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import type { ScrapingSchedule, ExecutionStatus } from '../types'

// ============================================
// Types
// ============================================

/** Map of job IDs to their last seen status */
type StatusMap = Map<string, ExecutionStatus>

/** Statuses that indicate a job is currently running */
const ACTIVE_STATUSES: ExecutionStatus[] = ['running']

/** Terminal statuses (job finished) */
const TERMINAL_STATUSES: ExecutionStatus[] = ['success', 'failed']

// ============================================
// Hook Implementation
// ============================================

/**
 * Hook to monitor job status changes and trigger notifications.
 * 
 * Uses a Map<jobId, lastSeenStatus> ref to track status transitions:
 * - Only triggers toast when status transitions to terminal state (success/failed)
 * - Deduplicates notifications by checking if status changed
 * - Polling is handled by useSchedules hook (30s interval for active jobs)
 * 
 * @param schedules - Array of schedules to monitor
 * @param enabled - Whether notifications are enabled (default: true)
 */
export function useJobNotifications(
  schedules: ScrapingSchedule[] = [],
  enabled = true
) {
  const { t } = useTranslation('scraping')
  
  // Track last seen status for each job
  const lastSeenStatusRef = useRef<StatusMap>(new Map())

  useEffect(() => {
    if (!enabled || schedules.length === 0) return

    // Process each schedule and detect status transitions
    schedules.forEach((schedule) => {
      const jobId = schedule.id
      const currentStatus = schedule.lastStatus
      const lastSeenStatus = lastSeenStatusRef.current.get(jobId)

      // Skip if no status (new schedule or never run)
      if (!currentStatus) return

      // Skip if status hasn't changed
      if (lastSeenStatus === currentStatus) return

      // Update the tracked status
      lastSeenStatusRef.current.set(jobId, currentStatus)

      // Only notify on terminal state transitions from a different state
      if (
        TERMINAL_STATUSES.includes(currentStatus) &&
        lastSeenStatus &&
        !TERMINAL_STATUSES.includes(lastSeenStatus)
      ) {
        // Get product name for notification
        const productName = schedule.product

        if (currentStatus === 'success') {
          toast.success(t('scheduled.notifications.executionCompleted', { product: productName }))
        } else if (currentStatus === 'failed') {
          toast.error(t('scheduled.notifications.executionFailed', { product: productName }))
        }
      }
    })
  }, [schedules, enabled, t])

  // Provide a way to clear notifications state (useful for testing)
  const clearNotifications = () => {
    lastSeenStatusRef.current.clear()
  }

  // Check if any jobs are currently active (for polling decisions)
  const hasActiveJobs = schedules.some(
    (s) => ACTIVE_STATUSES.includes(s.lastStatus as ExecutionStatus) || s.isActive
  )

  return {
    hasActiveJobs,
    clearNotifications,
  }
}

// ============================================
// Polling Hook
// ============================================

/**
 * Hook to conditionally poll schedules when there are active jobs.
 * Returns the refetch interval to use (false when no active jobs).
 * 
 * @param schedules - Array of schedules to check for active jobs
 * @param intervalMs - Polling interval in milliseconds (default: 30000 = 30s)
 */
export function useSchedulePolling(
  schedules: ScrapingSchedule[] = [],
  intervalMs = 30000
): number |false {
  const hasActiveJobs = schedules.some(
    (s) => ACTIVE_STATUSES.includes(s.lastStatus as ExecutionStatus) || s.isActive
  )

  return hasActiveJobs ? intervalMs : false
}