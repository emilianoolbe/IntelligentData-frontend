// ============================================
// ScrapingWorkspace Component
// ============================================
// Tabbed container composing manual + scheduled scraping

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ScrapingForm } from './ScrapingForm'
import { ScrapingResults } from './ScrapingResults'
import { ScheduleForm } from './ScheduleForm'
import { SchedulesList } from './SchedulesList'
import { ExecutionHistory } from './ExecutionHistory'
import {
  useSchedules,
  useCreateSchedule,
  usePauseSchedule,
  useResumeSchedule,
  useDeleteSchedule,
  useExecutionHistory,
} from '../hooks/useScheduledScrape'
import { useManualScrape } from '../hooks/useManualScrape'
import type {
  ScrapingFormState,
  ScrapingProduct,
  ScrapingMonth,
  ScrapingYear,
  ManualScrapeRequest,
  ScrapedItem,
  CreateScheduleRequest,
} from '../types'

// ============================================
// Types
// ============================================

type TabType = 'manual' | 'scheduled'

interface ScrapingWorkspaceProps {
  /** Initial tab to display */
  initialTab?: TabType
}

// ============================================
// Tab Button Component
// ============================================

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${active
          ? 'bg-accent text-white'
          : 'text-muted hover:text-primary hover:bg-secondary'
        }
      `}
    >
      {children}
    </button>
  )
}

// ============================================
// Main Component
// ============================================

export function ScrapingWorkspace({ initialTab = 'manual' }: ScrapingWorkspaceProps) {
  const { t } = useTranslation('scraping')
  
  // ============================================
  // State
  // ============================================
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)
  const [actingUponIds, setActingUponIds] = useState<string[]>([])
  
  // ============================================
  // Manual Scraping Hooks
  // ============================================
  
  const { mutate: manualScrape, isPending: isManualLoading, error: manualError, data: manualData } = useManualScrape()
  
  // ============================================
  // Scheduled Scraping Hooks
  // ============================================
  
  const { data: schedulesData, isLoading: isSchedulesLoading } = useSchedules()
  const { mutate: createSchedule, isPending: isCreating } = useCreateSchedule()
  const { mutate: pauseSchedule } = usePauseSchedule()
  const { mutate: resumeSchedule } = useResumeSchedule()
  const { mutate: deleteSchedule } = useDeleteSchedule()
  
  // Execution history
  const { data: historyData, isLoading: isHistoryLoading, refetch: refetchHistory } = useExecutionHistory(
    selectedScheduleId || ''
  )
  
  // Get schedules array
  const schedules = schedulesData || []
  
  // ============================================
  // Handlers
  // ============================================
  
  const handleManualSubmit = useCallback((formData: ScrapingFormState) => {
    const request: ManualScrapeRequest = {
      product: formData.product as ScrapingProduct,
      month: formData.month as ScrapingMonth,
      year: formData.year as ScrapingYear,
      customUrl: formData.customUrl || undefined,
    }
    manualScrape(request)
  }, [manualScrape])
  
  const handleCreateSchedule = useCallback((data: CreateScheduleRequest) => {
    createSchedule(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false)
      },
    })
  }, [createSchedule])
  
  const handlePauseSchedule = useCallback((id: string) => {
    setActingUponIds((prev) => [...prev, id])
    pauseSchedule(id, {
      onSettled: () => {
        setActingUponIds((prev) => prev.filter((x) => x !== id))
      },
    })
  }, [pauseSchedule])
  
  const handleResumeSchedule = useCallback((id: string) => {
    setActingUponIds((prev) => [...prev, id])
    resumeSchedule(id, {
      onSettled: () => {
        setActingUponIds((prev) => prev.filter((x) => x !== id))
      },
    })
  }, [resumeSchedule])
  
  const handleDeleteSchedule = useCallback((id: string) => {
    if (window.confirm(t('scheduled.delete.description'))) {
      setActingUponIds((prev) => [...prev, id])
      deleteSchedule(id, {
        onSettled: () => {
          setActingUponIds((prev) => prev.filter((x) => x !== id))
        },
      })
    }
  }, [deleteSchedule, t])
  
  const handleViewHistory = useCallback((id: string) => {
    setSelectedScheduleId(id)
    setIsHistoryModalOpen(true)
  }, [])
  
  const handleCloseHistory = useCallback(() => {
    setIsHistoryModalOpen(false)
    setSelectedScheduleId(null)
  }, [])
  
  // Get selected schedule for history modal
  const selectedSchedule = schedules.find((s) => s.id === selectedScheduleId)
  
  // Manual scraping results
  const manualResults: ScrapedItem[] = manualData?.items || []
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <TabButton
          active={activeTab === 'manual'}
          onClick={() => setActiveTab('manual')}
        >
          {t('scheduled.tabs.manual')}
        </TabButton>
        <TabButton
          active={activeTab === 'scheduled'}
          onClick={() => setActiveTab('scheduled')}
        >
          {t('scheduled.tabs.scheduled')}
        </TabButton>
      </div>
      
      {/* Manual Tab */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-primary">{t('title')}</h2>
            <p className="mt-1 text-muted">{t('subtitle')}</p>
          </div>
          
          {/* Error Alert */}
          {manualError && (
            <div className="rounded-lg bg-error-muted p-4 text-error">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{manualError.message || t('errors.unknown')}</span>
              </div>
            </div>
          )}
          
          {/* Form */}
          <ScrapingForm onSubmit={handleManualSubmit} isLoading={isManualLoading} />
          
          {/* Results */}
          <ScrapingResults items={manualResults} isLoading={isManualLoading} />
        </div>
      )}
      
      {/* Scheduled Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">{t('scheduled.title')}</h2>
              <p className="mt-1 text-muted">{t('scheduled.description')}</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('scheduled.form.createTitle')}
            </Button>
          </div>
          
          {/* Schedules List */}
          <Card className="p-4">
            <SchedulesList
              schedules={schedules}
              isLoading={isSchedulesLoading}
              onPause={handlePauseSchedule}
              onResume={handleResumeSchedule}
              onDelete={handleDeleteSchedule}
              onViewHistory={handleViewHistory}
              actingUponIds={actingUponIds}
            />
          </Card>
        </div>
      )}
      
      {/* Create Schedule Modal */}
      <ScheduleForm
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSchedule}
        isLoading={isCreating}
      />
      
      {/* Execution History Modal */}
      <ExecutionHistory
        open={isHistoryModalOpen}
        onClose={handleCloseHistory}
        executions={historyData?.executions || []}
        isLoading={isHistoryLoading}
        scheduleName={selectedSchedule?.product}
        hasMore={historyData?.hasMore || false}
        onLoadMore={() => refetchHistory()}
      />
    </div>
  )
}