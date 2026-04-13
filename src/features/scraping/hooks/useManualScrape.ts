import { useMutation, useQueryClient } from '@tanstack/react-query'
import { manualScrapeApi } from '../api/manualScrapeApi'
import type { ManualScrapeRequest, ManualScrapeResponse } from '../types'

/**
 * React Query mutation hook for manual scraping
 * 
 * @returns Mutation object with mutate, isLoading, error, and data
 * 
 * @example
 * ```tsx
 * const { mutate, isLoading, error, data } = useManualScrape()
 * 
 * const handleSubmit = (formData: ManualScrapeRequest) => {
 *   mutate(formData, {
 *     onSuccess: (response) => console.log('Scraped:', response),
 *     onError: (error) => console.error('Failed:', error),
 *   })
 * }
 * ```
 */
export function useManualScrape() {
  const queryClient = useQueryClient()

  return useMutation<ManualScrapeResponse, Error, ManualScrapeRequest>({
    mutationFn: manualScrapeApi.submit,
    
    onSuccess: (data) => {
      // Cache the successful result under a predictable key
      queryClient.setQueryData<ManualScrapeResponse>(
        ['scraping', 'manual', 'latest'],
        data
      )
    },
    
    onError: (error) => {
      // Log error for debugging (in production, this would go to Error tracking)
      console.error('Manual scrape failed:', error.message)
    },
  })
}

/**
 * Query key factory for scraping-related queries
 */
export const scrapingKeys = {
  all: ['scraping'] as const,
  manual: () => [...scrapingKeys.all, 'manual'] as const,
  latest: () => [...scrapingKeys.manual(), 'latest'] as const,
}