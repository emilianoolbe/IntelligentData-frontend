// ============================================
// Scraping Types
// ============================================

/** Product options for scraping */
export type ScrapingProduct = 'mercadolibre' | 'amazon' | 'fravega'

/** Available months for scraping */
export type ScrapingMonth = 
  | '01' | '02' | '03' | '04' | '05' | '06'
  | '07' | '08' | '09' | '10' | '11' | '12'

/** Available years for scraping (current and previous years) */
export type ScrapingYear = string // e.g., '2024', '2025'

// ============================================
// API Request/Response Types
// ============================================

/** Manual scraping request payload */
export interface ManualScrapeRequest {
  /** Product to scrape */
  product: ScrapingProduct
  /** Month (01-12) */
  month: ScrapingMonth
  /** Year (YYYY) */
  year: ScrapingYear
  /** Optional custom URL for scraping */
  customUrl?: string
}

/** Individual scraped result item */
export interface ScrapedItem {
  /** Unique identifier */
  id: string
  /** Product title */
  title: string
  /** Price in local currency */
  price: number
  /** Currency code (e.g., 'ARS', 'USD') */
  currency: string
  /** Product URL */
  url: string
  /** Source platform */
  source: ScrapingProduct
  /** Availability status */
  available: boolean
  /** Scraped timestamp */
  scrapedAt: string
  /** Optional: Product image URL */
  imageUrl?: string
  /** Optional: Seller name */
  seller?: string
}

/** Manual scraping response */
export interface ManualScrapeResponse {
  /** Success flag */
  success: boolean
  /** Number of items scraped */
  count: number
  /** Scraped items */
  items: ScrapedItem[]
  /** Scraping timestamp */
  scrapedAt: string
  /** Optional: Error message if partial failure */
  message?: string
}

// ============================================
// Form Types
// ============================================

/** Form state for manual scraping form */
export interface ScrapingFormState {
  product: ScrapingProduct | ''
  month: ScrapingMonth | ''
  year: ScrapingYear | ''
  customUrl: string
}

/** Form validation errors */
export interface ScrapingFormErrors {
  product?: string
  month?: string
  year?: string
  customUrl?: string
}

// ============================================
// Constants
// ============================================

/** Product display names */
export const PRODUCT_LABELS: Record<ScrapingProduct, string> = {
  mercadolibre: 'MercadoLibre',
  amazon: 'Amazon',
  fravega: 'Fravega',
}

/** Month labels */
export const MONTH_LABELS: Record<ScrapingMonth, string> = {
  '01': 'Enero',
  '02': 'Febrero',
  '03': 'Marzo',
  '04': 'Abril',
  '05': 'Mayo',
  '06': 'Junio',
  '07': 'Julio',
  '08': 'Agosto',
  '09': 'Septiembre',
  '10': 'Octubre',
  '11': 'Noviembre',
  '12': 'Diciembre',
}

/** Get available years (current year and 2 previous years) */
export function getAvailableYears(): ScrapingYear[] {
  const currentYear = new Date().getFullYear()
  return [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString(),
  ]
}

/** Available products for selector */
export const AVAILABLE_PRODUCTS: ScrapingProduct[] = ['mercadolibre', 'amazon', 'fravega']

/** Available months */
export const AVAILABLE_MONTHS: ScrapingMonth[] = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12',
]

// ============================================
// Scheduled Scraping Types
// ============================================

/** Schedule frequency options */
export type ScheduleFrequency = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom'

/** Schedule status - whether schedule is enabled/paused */
export type ScheduleStatus = 'active' | 'paused'

/** Execution status - result of a single execution */
export type ExecutionStatus = 'success' | 'failed' | 'running'

/** Schedule configuration for periodic scraping */
export interface ScrapingSchedule {
  /** Unique identifier */
  id: string
  /** Product to scrape */
  product: ScrapingProduct
  /** Frequency type */
  frequency: ScheduleFrequency
  /** Custom cron expression (if frequency is 'custom') */
  cronExpression?: string
  /** Whether the schedule is active */
  isActive: boolean
  /** Creation timestamp */
  createdAt: string
  /** Last modification timestamp */
  updatedAt: string
  /** Next scheduled execution */
  nextRunAt?: string
  /** Last execution timestamp */
  lastRunAt?: string
  /** Last execution status (success/failed/running) */
  lastStatus?: ExecutionStatus
}

/** Create schedule request payload */
export interface CreateScheduleRequest {
  product: ScrapingProduct
  frequency: ScheduleFrequency
  cronExpression?: string
}

/** Update schedule request payload */
export interface UpdateScheduleRequest {
  frequency?: ScheduleFrequency
  cronExpression?: string
  isActive?: boolean
}

/** Execution history item */
export interface ExecutionHistoryItem {
  /** Unique execution ID */
  id: string
  /** Associated schedule ID */
  scheduleId: string
  /** Execution start timestamp */
  startedAt: string
  /** Execution completion timestamp */
  completedAt?: string
  /** Execution status */
  status: ExecutionStatus
  /** Number of items scraped */
  itemsCount: number
  /** Error message if failed */
  errorMessage?: string
  /** Duration in milliseconds */
  duration?: number
}

/** List schedules response */
export interface ListSchedulesResponse {
  schedules: ScrapingSchedule[]
  total: number
}

/** Execution history response */
export interface ExecutionHistoryResponse {
  executions: ExecutionHistoryItem[]
  total: number
  hasMore: boolean
}

// ============================================
// React Query Keys
// ============================================

/** Query keys for scraping-related queries */
export const scrapingKeys = {
  all: ['scraping'] as const,
  manual: () => [...scrapingKeys.all, 'manual'] as const,
  manualLatest: () => [...scrapingKeys.manual(), 'latest'] as const,
  schedules: () => [...scrapingKeys.all, 'schedules'] as const,
  schedule: (id: string) => [...scrapingKeys.schedules(), id] as const,
  executions: (scheduleId: string) => [...scrapingKeys.all, 'executions', scheduleId] as const,
}