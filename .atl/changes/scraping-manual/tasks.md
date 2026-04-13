# Tasks: Manual Scraping

## Phase 1: Types (Foundation)

- [ ] 1.1 Create `src/features/scraping/types/index.ts` with `ManualScrapeRequest`, `ManualScrapeResponse`, `ScrapeResult`, `ErrorResponse`, `FormData`, `FormErrors` interfaces per design
- [ ] 1.2 Create `src/features/scraping/index.ts` barrel file exporting all public interfaces and components

**Acceptance**: Types compile without errors; no circular dependencies with other feature types

## Phase 2: API Client

- [ ] 2.1 Create `src/features/scraping/api/manualScrapeApi.ts` using `apiClient` from `src/shared/api/axiosInstance.ts`
- [ ] 2.2 Implement `submitManualScrape(request: ManualScrapeRequest): Promise<ManualScrapeResponse>` function
- [ ] 2.3 Export the API function for use by the hook

**Acceptance**: API client sends POST to `/scraping/manual`, handles errors correctly

## Phase 3: Hooks

- [ ] 3.1 Create `src/features/scraping/hooks/useManualScrape.ts`
- [ ] 3.2 Implement `useMutation` with `mutationFn: submitManualScrape`
- [ ] 3.3 Configure `onSuccess` to cache result under `['scraping', 'manual']` query key
- [ ] 3.4 Return `{ mutate, isLoading, error, data, reset }` per spec

**Acceptance**: Hook works with React Query devtools; data cached correctly after success

## Phase 4: Components

- [ ] 4.1 Create `src/features/scraping/components/ScrapingForm.tsx` with:
  - Input for product (required)
  - Select for month (1-12)
  - Input type="number" for year (2020 to currentYear+1)
  - Input for customUrl (optional)
  - Button with isLoading state
- [ ] 4.2 Implement `validateForm(data: FormData, t): FormErrors` function per design validation rules
- [ ] 4.3 Add inline error messages with `role="alert"` for accessibility
- [ ] 4.4 Create `src/features/scraping/components/ScrapingResults.tsx` with:
  - Table component with localized headers
  - Price formatting using `Intl.NumberFormat`
  - Date formatting using `Intl.DateTimeFormat` with locale
  - Source URL as clickable link
  - TableEmpty state for empty results

**Acceptance**: Both components render correctly; form validates before submission; table formats data properly

## Phase 5: Page

- [ ] 5.1 Create `src/features/scraping/pages/ScrapingPage.tsx`
- [ ] 5.2 Compose Card + ScrapingForm + ScrapingResults
- [ ] 5.3 Wire `useManualScrape` hook to form submission
- [ ] 5.4 Handle loading/error/success states with appropriate UI feedback
- [ ] 5.5 Implement focus management: move focus to error alert on API failure

**Acceptance**: Page renders with form and results; state transitions work correctly; no memory leaks

## Phase 6: Router Integration

- [ ] 6.1 Update `src/app/router/AppRouter.tsx`
- [ ] 6.2 Import `ScrapingPage` from `@/features/scraping/pages`
- [ ] 6.3 Replace inline `ScrapingPage` placeholder with feature import on `/scraping` route
- [ ] 6.4 Verify route remains inside `ProtectedRoute` wrapper

**Acceptance**: Navigating to `/scraping` renders new ScrapingPage; unauthenticated users redirect to `/login`

## Phase 7: i18n

- [ ] 7.1 Create `src/i18n/locales/es/scraping.json` with all Spanish keys from spec
- [ ] 7.2 Create `src/i18n/locales/en/scraping.json` with all English keys from spec
- [ ] 7.3 Update `src/i18n/index.ts` to import and register scraping namespace
- [ ] 7.4 Verify interpolation works for `{{maxYear}}` and `{{count}}` placeholders

**Acceptance**: All 26 i18n keys present in both locales; translations render correctly in components

## Phase 8: Testing

- [ ] 8.1 Create `src/features/scraping/__tests__/useManualScrape.test.ts`
  - Test mutation calls API with correct payload
  - Test caching updates on success
  - Test error handling
- [ ] 8.2 Create `src/features/scraping/__tests__/ScrapingForm.test.tsx`
  - Test required field validation (product, month, year)
  - Test URL validation for customUrl
  - Test submit button disabled during loading
  - Test error messages display
- [ ] 8.3 Create `src/features/scraping/__tests__/ScrapingResults.test.tsx`
  - Test empty state renders
  - Test results render with formatted data
  - Test date and price formatting per locale
- [ ] 8.4 Create `src/features/scraping/__tests__/ScrapingPage.test.tsx`
  - Test integration: fill form → submit → display results
  - Test error state shows alert and preserves form

**Acceptance**: All tests pass; coverage includes validation, API integration, and rendering

## Implementation Order

1. **Types first** (1.1-1.2) — all other modules depend on TypeScript interfaces
2. **API client** (2.1-2.3) — hook needs this to make requests
3. **Hook** (3.1-3.4) — components need mutation to submit
4. **Components** (4.1-4.4) — form needs hook, results needs types
5. **Page** (5.1-5.5) — needs all components composed
6. **Router** (6.1-6.4) — wires page into app
7. **i18n** (7.1-7.4) — can parallelize with components, needs final integration
8. **Testing** (8.1-8.4) — run after all implementation complete

## Dependencies Summary

```
Types ──┬── API ──── Hook ──── Form ──── Page ──── Router
        │                           │
        └── Results ─────────────────┘
        │
        └── i18n (parallel throughout)
        │
        └── Tests (after all implementation)
```
