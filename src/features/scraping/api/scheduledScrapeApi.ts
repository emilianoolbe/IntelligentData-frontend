// ============================================
// Scheduled Scraping API Client
// ============================================

import axiosInstance from '@/shared/api/axiosInstance'
import type {
  ScrapingSchedule,
  CreateScheduleRequest,
  UpdateScheduleRequest,
  ExecutionHistoryItem,
  ListSchedulesResponse,
  ExecutionHistoryResponse,
} from '../types'

// ============================================
// Schedule CRUD Operations
// ============================================

/** List all schedules */
export async function listSchedules(): Promise<ListSchedulesResponse> {
  const response = await axiosInstance.get<ListSchedulesResponse>('/scraping/schedules')
  return response.data
}

/** Get a single schedule by ID */
export async function getSchedule(id: string): Promise<ScrapingSchedule> {
  const response = await axiosInstance.get<ScrapingSchedule>(`/scraping/schedules/${id}`)
  return response.data
}

/** Create a new schedule */
export async function createSchedule(data: CreateScheduleRequest): Promise<ScrapingSchedule> {
  const response = await axiosInstance.post<ScrapingSchedule>('/scraping/schedules', data)
  return response.data
}

/** Update a schedule */
export async function updateSchedule(id: string, data: UpdateScheduleRequest): Promise<ScrapingSchedule> {
  const response = await axiosInstance.patch<ScrapingSchedule>(`/scraping/schedules/${id}`, data)
  return response.data
}

/** Delete a schedule */
export async function deleteSchedule(id: string): Promise<void> {
  await axiosInstance.delete(`/scraping/schedules/${id}`)
}

/** Pause a schedule */
export async function pauseSchedule(id: string): Promise<ScrapingSchedule> {
  const response = await axiosInstance.patch<ScrapingSchedule>(`/scraping/schedules/${id}/pause`)
  return response.data
}

/** Resume a schedule */
export async function resumeSchedule(id: string): Promise<ScrapingSchedule> {
  const response = await axiosInstance.patch<ScrapingSchedule>(`/scraping/schedules/${id}/resume`)
  return response.data
}

// ============================================
// Execution History
// ============================================

/** Get execution history for a schedule */
export async function getExecutionHistory(
  scheduleId: string,
  params?: { limit?: number; offset?: number }
): Promise<ExecutionHistoryResponse> {
  const response = await axiosInstance.get<ExecutionHistoryResponse>(
    `/scraping/schedules/${scheduleId}/executions`,
    { params }
  )
  return response.data
}

/** Get a single execution detail */
export async function getExecutionDetail(
  scheduleId: string,
  executionId: string
): Promise<ExecutionHistoryItem> {
  const response = await axiosInstance.get<ExecutionHistoryItem>(
    `/scraping/schedules/${scheduleId}/executions/${executionId}`
  )
  return response.data
}

// ============================================
// API Object Export
// ============================================

export const scheduledScrapeApi = {
  list: listSchedules,
  get: getSchedule,
  create: createSchedule,
  update: updateSchedule,
  delete: deleteSchedule,
  pause: pauseSchedule,
  resume: resumeSchedule,
  getHistory: getExecutionHistory,
  getExecution: getExecutionDetail,
}