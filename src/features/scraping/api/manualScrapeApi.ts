import axiosInstance from '@/shared/api/axiosInstance'
import type { ManualScrapeRequest, ManualScrapeResponse } from '../types'

/**
 * Submit a manual scraping request to the backend
 * @param data - The scraping request payload
 * @returns Promise resolving to the scraping response
 */
export async function submitManualScrape(
  data: ManualScrapeRequest
): Promise<ManualScrapeResponse> {
  const response = await axiosInstance.post<ManualScrapeResponse>(
    '/scraping/manual',
    data
  )
  return response.data
}

/**
 * API endpoints for manual scraping
 */
export const manualScrapeApi = {
  submit: submitManualScrape,
}