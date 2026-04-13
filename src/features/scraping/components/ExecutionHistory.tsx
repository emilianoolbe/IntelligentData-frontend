// ============================================
// ExecutionHistory Component
// ============================================
// Modal/panel for viewing execution history of a scheduled job

import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import type { ExecutionHistoryItem, ExecutionStatus } from '../types'

// ============================================
// Types
// ============================================

export interface ExecutionHistoryProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Array of execution history items */
  executions?: ExecutionHistoryItem[]
  /** Whether data is loading */
  isLoading?: boolean
  /** Name of the schedule (for display) */
  scheduleName?: string
  /** Callback to load more items (pagination) */
  onLoadMore?: () => void
  /** Whether there are more items to load */
  hasMore?: boolean
}

// ============================================
// Status Badge Component
// ============================================

interface ExecutionStatusBadgeProps {
  status: ExecutionStatus
}

function ExecutionStatusBadge({ status }: ExecutionStatusBadgeProps) {
  const { t } = useTranslation('scraping')
  
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  const statusClasses: Record<ExecutionStatus, string> = {
    success: 'bg-success-muted text-success',
    failed: 'bg-error-muted text-error',
    running: 'bg-accent-muted text-accent',
  }

  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {t(`scheduled.history.status.${status}`)}
    </span>
  )
}

// ============================================
// Duration Display
// ============================================

interface DurationDisplayProps {
  duration?: number
}

function DurationDisplay({ duration }: DurationDisplayProps) {
  if (duration === undefined || duration === null) {
    return <span className="text-muted">—</span>
  }

  // Duration is in milliseconds
  if (duration < 1000) {
    return <span>{duration}ms</span>
  }
  
  const seconds = Math.floor(duration / 1000)
  if (seconds < 60) {
    return <span>{seconds}s</span>
  }
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return <span>{minutes}m {remainingSeconds}s</span>
}

// ============================================
// Date Display
// ============================================

interface DateDisplayProps {
  date: string
}

function DateDisplay({ date }: DateDisplayProps) {
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

export function ExecutionHistory({
  open,
  onClose,
  executions = [],
  isLoading = false,
  scheduleName,
  onLoadMore,
  hasMore = false,
}: ExecutionHistoryProps) {
  const { t } = useTranslation('scraping')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('scheduled.history.title')}
      description={scheduleName ? t('scheduled.history.subtitle', { name: scheduleName }) : undefined}
      size="xl"
    >
      <div className="space-y-4">
        {/* Content */}
        {isLoading && executions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
          </div>
        ) : executions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted">{t('scheduled.history.empty')}</p>
          </div>
        ) : (
          <>
            <Table stickyHeader>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('scheduled.history.headers.date')}</TableHead>
                  <TableHead>{t('scheduled.history.headers.status')}</TableHead>
                  <TableHead>{t('scheduled.history.headers.items')}</TableHead>
                  <TableHead>{t('scheduled.history.headers.duration')}</TableHead>
                  <TableHead className="text-right">{t('scheduled.history.actions.viewDetails')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.map((execution) => (
                  <TableRow key={execution.id}>
                    {/* Date */}
                    <TableCell>
                      <DateDisplay date={execution.startedAt} />
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell>
                      <ExecutionStatusBadge status={execution.status} />
                    </TableCell>
                    
                    {/* Items Count */}
                    <TableCell>
                      <span className="font-medium">{execution.itemsCount}</span>
                    </TableCell>
                    
                    {/* Duration */}
                    <TableCell>
                      <DurationDisplay duration={execution.duration} />
                    </TableCell>
                    
                    {/* Error Message (if failed) */}
                    {execution.status === 'failed' && execution.errorMessage && (
                      <TableCell>
                        <span className="text-sm text-error" title={execution.errorMessage}>
                          {execution.errorMessage.length >50
                            ? `${execution.errorMessage.substring(0, 50)}...`
                            : execution.errorMessage}
                        </span>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? t('common:loading') : t('common:loadMore')}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            {t('scheduled.history.actions.back')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}