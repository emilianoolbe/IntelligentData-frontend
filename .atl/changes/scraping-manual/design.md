# Design: Manual Scraping

## Technical Approach

Build a dedicated scraping feature module following the established feature-based architecture. The implementation uses React Query for server state management with mutations, local React state for form handling, and the existing UI component library for consistent UX. Data flow: User fills form → Validation → React Query mutation → API via axios → Cache result → Render table.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| State Management | React Query `useMutation` | Redux slice for scraping | Mutations fit better for one-off operations; no need for global state |
| Form Handling | Local `useState` | React Hook Form | Simple form, no complex validation rules; keeps dependencies minimal |
| Validation | Manual validation functions | Zod/Yup schema | Lightweight, no extra library; validation is straightforward |
| Cache Strategy | Query key `['scraping', 'manual']` | No caching | Preserves latest result during navigation per spec requirement |
| Product Selector | Native `<select>` | Custom dropdown | Accessibility built-in, matches existing Input pattern |
| Date Formatting | `Intl.DateTimeFormat` | date-fns library | Native API sufficient, keeps bundle size down |

## Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  ScrapingPage   │────▶│  ScrapingForm    │────▶│  Validation     │
│   (Container)   │     │  (Local State)   │     │   (Functions)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                          │
         │                       ▼                          ▼
         │              ┌──────────────────┐     ┌─────────────────┐
         │              │ useManualScrape  │◀────│   Valid Input   │
         │              │  (useMutation)   │     └─────────────────┘
         │              └──────────────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │  manualScrapeApi │
         │              │   (axios POST)   │
         │              └──────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│ ScrapingResults │◀────│  React Query     │
│  (Table View)   │     │  Cache + State   │
└─────────────────┘     └──────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/features/scraping/api/manualScrapeApi.ts` | Create | Axios-based API client for POST /scraping/manual |
| `src/features/scraping/hooks/useManualScrape.ts` | Create | React Query mutation hook with caching |
| `src/features/scraping/components/ScrapingForm.tsx` | Create | Form with validation and submission logic |
| `src/features/scraping/components/ScrapingResults.tsx` | Create | Results table with formatting |
| `src/features/scraping/pages/ScrapingPage.tsx` | Create | Main page composing form + results |
| `src/features/scraping/types/index.ts` | Create | TypeScript interfaces for API contract |
| `src/features/scraping/index.ts` | Create | Public exports barrel file |
| `src/app/router/AppRouter.tsx` | Modify | Replace placeholder ScrapingPage with feature import |
| `src/i18n/locales/es/scraping.json` | Create | Spanish translations |
| `src/i18n/locales/en/scraping.json` | Create | English translations |
| `src/i18n/index.ts` | Modify | Import and register scraping namespace |
| `src/features/scraping/__tests__/useManualScrape.test.ts` | Create | Hook tests |
| `src/features/scraping/__tests__/ScrapingForm.test.tsx` | Create | Form component tests |
| `src/features/scraping/__tests__/ScrapingResults.test.tsx` | Create | Results table tests |
| `src/features/scraping/__tests__/ScrapingPage.test.tsx` | Create | Integration tests |

## Interfaces / Contracts

```typescript
// src/features/scraping/types/index.ts

export interface ManualScrapeRequest {
  product: string
  month: number
  year: number
  customUrl?: string
}

export interface ScrapeResult {
  title: string
  price: number
  currency: string
  sourceUrl: string
  extractedAt: string // ISO 8601
}

export interface ManualScrapeResponse {
  id: string
  status: 'pending' | 'completed' | 'failed'
  data: ScrapeResult[] | null
  error: string | null
  createdAt: string // ISO 8601
}

export interface ErrorResponse {
  error: string
  code: string
}

// Form state
export interface FormData {
  product: string
  month: string // Selected value from select
  year: string
  customUrl: string
}

export interface FormErrors {
  product?: string
  month?: string
  year?: string
  customUrl?: string
}
```

## Component Hierarchy

```
ScrapingPage
├── Card (header: title/subtitle)
│   └── ScrapingForm
│       ├── Input (product)
│       ├── select (month - native)
│       ├── Input (year - number type)
│       ├── Input (customUrl - optional)
│       └── Button (submit with isLoading)
│
└── ScrapingResults
    ├── Empty State Card (no data)
    └── Table (has data)
        ├── TableHeader
        │   └── TableRow
        │       ├── TableHead (title)
        │       ├── TableHead (price)
        │       ├── TableHead (source)
        │       └── TableHead (extracted)
        └── TableBody
            ├── TableRow (mapped results)
            │   └── TableCell (x4)
            └── TableEmpty (if data.length === 0)
```

## Error Handling Strategy

| Error Source | Handling Approach | UX Feedback |
|--------------|-------------------|-------------|
| Client validation | Prevent submit, display inline errors | Red border + `role="alert"` message below field |
| API 400 Bad Request | Display backend error message | Alert banner with `scraping.errors.submitFailed` + specific message |
| API 401 Unauthorized | Axios interceptor handles redirect | Redirect to /login (existing behavior) |
| API 500+ | Display generic error, allow retry | Alert banner with `scraping.errors.submitFailed` |
| Network error | React Query retry=1, then show error | Same as API error |

**Focus Management**: On validation error, focus stays on invalid field. On API error, focus moves to error alert via `useEffect`.

## Loading States UX

| State | Visual Indicator | Form State |
|-------|------------------|------------|
| Idle | Standard button | All inputs enabled |
| Submitting (isLoading=true) | Button spinner + "Processing..." | All inputs disabled |
| Success | Success alert + results table | Form reset to empty |
| Error | Error alert (red) | Form preserved for retry |

## Test Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useManualScrape` hook | Mock React Query, test mutation flow, cache updates |
| Unit | `ScrapingForm` | Test validation rules, form submission, error display |
| Unit | `ScrapingResults` | Test empty state, data rendering, formatting |
| Integration | `ScrapingPage` | Test full flow: fill form → submit → display results |
| Integration | i18n | Test Spanish/English translations render correctly |
| E2E | (Optional future) | Full user journey through protected route |

**Testing Utilities**: Use `renderHook` from @testing-library/react for hooks, wrap components with QueryClientProvider and I18nextProvider in tests.

## Migration / Rollout

No migration required. This is a new feature that replaces a placeholder page.

**Rollback**: Revert `AppRouter.tsx` to use the inline placeholder component, remove feature module and locale files.

## Open Questions

- [ ] Backend endpoint `POST /scraping/manual` is confirmed live? (Assumed yes per proposal)
- [ ] Product selector: static list or API-fed? (Will implement adapter pattern for flexibility)

---

## Implementation Notes

### React Query Configuration

```typescript
// Cache configuration for manual scraping
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

// Mutation hook
export function useManualScrape() {
  return useMutation({
    mutationFn: submitManualScrape,
    onSuccess: (data) => {
      queryClient.setQueryData(['scraping', 'manual'], data)
    },
  })
}
```

### Validation Rules

```typescript
const validateForm = (data: FormData, t: TFunction): FormErrors => {
  const errors: FormErrors = {}
  const currentYear = new Date().getFullYear()
  
  if (!data.product.trim()) {
    errors.product = t('scraping.errors.productRequired')
  }
  
  const month = parseInt(data.month, 10)
  if (isNaN(month) || month < 1 || month > 12) {
    errors.month = t('scraping.errors.monthInvalid')
  }
  
  const year = parseInt(data.year, 10)
  if (isNaN(year) || year < 2020 || year > currentYear + 1) {
    errors.year = t('scraping.errors.yearInvalid', { maxYear: currentYear + 1 })
  }
  
  if (data.customUrl) {
    try {
      const url = new URL(data.customUrl)
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        errors.customUrl = t('scraping.errors.urlInvalid')
      }
    } catch {
      errors.customUrl = t('scraping.errors.urlInvalid')
    }
  }
  
  return errors
}
```

### i18n Registration

Add to `src/i18n/index.ts`:

```typescript
import esScraping from './locales/es/scraping.json'
import enScraping from './locales/en/scraping.json'

resources: {
  es: {
    // ... existing namespaces
    scraping: esScraping,
  },
  en: {
    // ... existing namespaces
    scraping: enScraping,
  },
}
```
