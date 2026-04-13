# Tasks: Scheduled Scraping Feature

## Phase 1: Setup & Dependencies

- [x] 1.1 Add `sonner` to `package.json` dependencies
- [x] 1.2 Verify `Toaster` component placement in app entry point (add if missing)
- [x] 1.3 Create directory structure: `api/`, `hooks/` subdirectories in `src/features/scraping/`

## Phase 2: Types & Contracts

- [x] 2.1 Add `CreateScheduleRequest`, `ScheduleResponse`, `ScheduleListResponse` types to `src/features/scraping/types/index.ts`
- [x] 2.2 Add `ExecutionResponse`, `ExecutionListResponse` types to `src/features/scraping/types/index.ts`
- [x] 2.3 Add `scheduleKeys` query key factory to `src/features/scraping/types/index.ts`
- [x] 2.4 Add `ScheduleFilters` type and constants (`ScheduleStatus`, `ExecutionStatus`)

## Phase 3: API Layer

- [x] 3.1 Create `src/features/scraping/api/scheduledScrapeApi.ts` with `fetchSchedules()` GET endpoint
- [x] 3.2 Add `createSchedule()` POST endpoint with DTO mapping
- [x] 3.3 Add `pauseSchedule()` and `resumeSchedule()` PATCH endpoints
- [x] 3.4 Add `deleteSchedule()` DELETE endpoint
- [x] 3.5 Add `fetchExecutionHistory()` GET endpoint with pagination params
- [x] 3.6 Export all API functions from the module

## Phase 4: React Query Hooks

- [x] 4.1 Create `src/features/scraping/hooks/useSchedules.ts` with list query and conditional 30s polling
- [x] 4.2 Create `src/features/scraping/hooks/useScheduleMutations.ts` with create, pause, resume, delete mutations
- [x] 4.3 Create `src/features/scraping/hooks/useExecutionHistory.ts` with pagination support
- [x] 4.4 Create `src/features/scraping/hooks/useJobNotifications.ts` with `Map<jobId, lastSeenStatus>` tracking and toast triggers

## Phase 5: UI Components

- [x] 5.1 Create `src/features/scraping/components/ScheduleForm.tsx` modal with cron validation
- [x] 5.2 Create `src/features/scraping/components/SchedulesList.tsx` with status badges and action buttons
- [x] 5.3 Create `src/features/scraping/components/ExecutionHistory.tsx` panel/modal with pagination
- [x] 5.4 Create `src/features/scraping/components/ScrapingWorkspace.tsx` tabbed container (Manual | Scheduled)

## Phase 6: Integration

- [x] 6.1 Modify `src/features/scraping/pages/ScrapingPage.tsx` to use `ScrapingWorkspace`
- [x] 6.2 Modify `src/features/scraping/index.ts` to export new hooks and components
- [x] 6.3 Add `sonner` toast integration to mutation success/error handlers

## Phase 7: i18n

- [x] 7.1 Add scheduled scraping keys to `src/i18n/locales/es/scraping.json`
- [x] 7.2 Add scheduled scraping keys to `src/i18n/locales/en/scraping.json`

## Phase 8: Testing

- [x] 8.1 Write `useSchedules.test.ts` - test polling starts/stops based on active jobs
- [x] 8.2 Write `useScheduleMutations.test.ts` - test create/pause/resume/delete mutations
- [x] 8.3 Write `useExecutionHistory.test.ts` - test pagination and data mapping
- [x] 8.4 Write `useJobNotifications.test.ts` - test status transition detection and deduplication
- [x] 8.5 Write `ScheduleForm.test.tsx` - test cron validation and form submission
- [x] 8.6 Write `SchedulesList.test.tsx` - test status badges and action buttons
- [x] 8.7 Write `ExecutionHistory.test.tsx` - test history panel rendering
- [x] 8.8 Write `ScrapingWorkspace.test.tsx` - test tab navigation and state preservation

## Implementation Order

1. **Setup first** (sonner, Toaster) — needed by components
2. **Types second** — all other files depend on types
3. **API third** — hooks depend on API layer
4. **Hooks fourth** — components depend on hooks
5. **Components fifth** — integration depends on components
6. **Integration sixth** — ties everything together
7. **i18n seventh** — components reference translation keys
8. **Testing last** — verify all pieces work together

## Related Files

| Action | File |
|--------|------|
| Create | `src/features/scraping/api/scheduledScrapeApi.ts` |
| Create | `src/features/scraping/hooks/useScheduledScrape.ts` |
| Create | `src/features/scraping/hooks/useJobNotifications.ts` |
| Create | `src/features/scraping/components/ScheduleForm.tsx` |
| Create | `src/features/scraping/components/SchedulesList.tsx` |
| Create | `src/features/scraping/components/ExecutionHistory.tsx` |
| Create | `src/features/scraping/components/ScrapingWorkspace.tsx` |
| Create | `src/features/scraping/__tests__/useSchedules.test.ts` |
| Create | `src/features/scraping/__tests__/useScheduleMutations.test.ts` |
| Create | `src/features/scraping/__tests__/useJobNotifications.test.ts` |
| Create | `src/features/scraping/__tests__/ScheduleForm.test.tsx` |
| Create | `src/features/scraping/__tests__/SchedulesList.test.tsx` |
| Create | `src/features/scraping/__tests__/ExecutionHistory.test.tsx` |
| Create | `src/features/scraping/__tests__/ScrapingWorkspace.test.tsx` |
| Modify | `src/features/scraping/types/index.ts` |
| Modify | `src/features/scraping/pages/ScrapingPage.tsx` |
| Modify | `src/features/scraping/index.ts` |
| Modify | `src/i18n/locales/es/scraping.json` |
| Modify | `src/i18n/locales/en/scraping.json` |
| Modify | `package.json` |
| Modify | `README.md` |

## Status: ✅ COMPLETE

All tasks have been implemented and tested.212 tests passing.