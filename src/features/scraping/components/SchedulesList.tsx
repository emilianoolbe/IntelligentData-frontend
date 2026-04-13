// ============================================
// SchedulesList Component
// ============================================
// Table displaying scheduled scraping jobs with status badges and actions

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import type { ScrapingSchedule, ExecutionStatus } from '../types'

// ============================================
// Types
// ============================================

export interface SchedulesListProps {
  /** Array of schedules to display */
  schedules: ScrapingSchedule[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Callback when pause is clicked */
  onPause?: (id: string) => void
  /** Callback when resume is clicked */
  onResume?: (id: string) => void
  /** Callback when delete is clicked */
  onDelete?: (id: string) => void
  /** Callback when view history is clicked */
  onViewHistory?: (id: string) => void
  /** IDs of schedules currently being acted upon */
  actingUponIds?: string[]
}

// ============================================
// Status Badge Component
// ============================================

interface StatusBadgeProps {
  status: 'active' | 'paused'
}

function StatusBadge({ status }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  const statusClasses: Record<'active' | 'paused', string> = {
    active: 'bg-success-muted text-success',
    paused: 'bg-warning-muted text-warning',
  }

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ============================================
// Execution Status Badge Component
// ============================================

interface ExecutionStatusBadgeProps {
  status?: ExecutionStatus
}

function ExecutionStatusBadge({ status }: ExecutionStatusBadgeProps) {
  if (!status) {
    return <span className="text-muted">—</span>
  }
  
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  const statusClasses: Record<ExecutionStatus, string> = {
    success: 'bg-success-muted text-success',
    failed: 'bg-error-muted text-error',
    running: 'bg-accent-muted text-accent',
  }

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ============================================
// Frequency Display
// ============================================

interface FrequencyDisplayProps {
  frequency: string
  cronExpression?: string
}

function FrequencyDisplay({ frequency, cronExpression }: FrequencyDisplayProps) {
  const { t } = useTranslation('scraping')
  
  if (frequency === 'custom' && cronExpression) {
    return (
      <div className="flex flex-col">
        <span>{t(`scheduled.frequencies.${frequency}`)}</span>
        <span className="text-xs text-muted font-mono">{cronExpression}</span>
      </div>
    )
  }
  
  return <span>{t(`scheduled.frequencies.${frequency}`)}</span>
}

// ============================================
// Date Display
// ============================================

interface DateDisplayProps {
  date?: string
  fallback?: string
}

function DateDisplay({ date, fallback = '—' }: DateDisplayProps) {
  if (!date) return <span className="text-muted">{fallback}</span>
  
  const parsed = new Date(date)
  const formatted = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
  
  return <span>{formatted}</span>
}

// ============================================
// Main Component
// ============================================

export function SchedulesList({
  schedules,
  isLoading = false,
  onPause,
  onResume,
  onDelete,
  onViewHistory,
  actingUponIds = [],
}: SchedulesListProps) {
  const { t } = useTranslation('scraping')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted">{t('scheduled.list.empty')}</p>
        <p className="text-sm text-muted mt-2">{t('scheduled.list.emptyHint')}</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('scheduled.list.headers.product')}</TableHead>
          <TableHead>{t('scheduled.list.headers.frequency')}</TableHead>
          <TableHead>{t('scheduled.list.headers.nextRun')}</TableHead>
          <TableHead>{t('scheduled.list.headers.lastRun')}</TableHead>
          <TableHead>{t('scheduled.list.headers.status')}</TableHead>
          <TableHead className="text-right">{t('scheduled.list.headers.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule) => {
          const isActing = actingUponIds.includes(schedule.id)
          
          return (
            <TableRow key={schedule.id}>
              {/* Product */}
              <TableCell className="font-medium">
                {t(`products.${schedule.product}`)}
              </TableCell>
              
              {/* Frequency */}
              <TableCell>
                <FrequencyDisplay
                  frequency={schedule.frequency}
                  cronExpression={schedule.cronExpression}
                />
              </TableCell>
              
              {/* Next Run */}
              <TableCell>
                <DateDisplay 
                  date={schedule.nextRunAt} 
                  fallback={t('scheduled.list.empty')}
                />
              </TableCell>
              
              {/* Last Run */}
              <TableCell>
                <DateDisplay 
                  date={schedule.lastRunAt} 
                  fallback={t('scheduled.list.empty')}
                />
              </TableCell>
              
              {/* Status */}
              <TableCell>
                <div className="flex flex-col gap-1">
                  <StatusBadge status={schedule.isActive ? 'active' : 'paused'} />
                  {schedule.lastStatus && <ExecutionStatusBadge status={schedule.lastStatus} />}
                </div>
              </TableCell>
              
              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* Pause/Resume Button */}
                  {schedule.isActive ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPause?.(schedule.id)}
                      disabled={isActing}
                      title={t('scheduled.list.actions.pause')}
                    >
                      <PauseIcon />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResume?.(schedule.id)}
                      disabled={isActing}
                      title={t('scheduled.list.actions.resume')}
                    >
                      <PlayIcon />
                    </Button>
                  )}
                  
                  {/* View History Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewHistory?.(schedule.id)}
                    disabled={isActing}
                    title={t('scheduled.list.actions.viewHistory')}
                  >
                    <HistoryIcon />
                  </Button>
                  
                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(schedule.id)}
                    disabled={isActing}
                    title={t('scheduled.list.actions.delete')}
                    className="text-error hover:text-error-hover"
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

// ============================================
// Icon Components
// ============================================

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}