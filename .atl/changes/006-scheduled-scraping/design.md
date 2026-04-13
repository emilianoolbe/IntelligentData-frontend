# Design: Scheduled Scraping Feature

## Technical Approach

Extend `src/features/scraping` to support scheduled scraping alongside manual scraping. Implement a tabbed workspace (`ScrapingWorkspace`) that composes both flows while keeping manual scraping unchanged. Use React Query for all server state (CRUD operations, polling) and local state for UI concerns (modals, transition tracking). Add polling only for active jobs to detect status transitions and trigger in-app notifications via a toast library.

---

## Architecture Decisions

| Decision | Choice | Alternatives Rejected | Rationale |
|----------|--------|----------------------|-----------|
| **State Management** | React Query for server state, local state for UI | Redux slice for scheduled data | Spec mandates React Query; keeps consistency with `useManualScrape` pattern; caching and polling built-in |
| **Polling Strategy** | `refetchInterval` enabled only when active jobs exist | WebSocket/SSE | Out of scope per proposal; polling simpler for MVP; stops on terminal states to reduce traffic |
| **Notifications** | Sonner toast library | Custom toast, Redux notifications | Lightweight, React 19 compatible, no Redux needed; matches existing UI patterns |
| **Component Composition** | Tabbed workspace with `hidden` (not unmount) | Separate routes, accordion | Preserves manual form state; cleaner UX; spec requires tab persistence |
| **API Layer** | DTO mapping in `scheduledScrapeApi.ts` | Direct API consumption | Mitigates backend contract drift risk; centralizes mapping logic |
| **Transition Tracking** | `Map<jobId, lastSeenStatus>` in `useJobNotifications` hook | Redux, localStorage | Ephemeral per session; no persistence needed; simple and performant |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ScrapingWorkspace                         │
│  ┌──────────────┐    ┌──────────────────┐                      │
│  │  Manual Tab  │    │  Scheduled Tab   │                      │
│  │  (existing)  │    │                  │                      │
│  └──────────────┘    └──────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     React Query Cache Layer                      │
│  ['schedules', 'list'] ──────► ScheduleList data                │
│  ['schedules', 'detail', id] ► Individual schedule              │
│  ['schedules', 'detail', id, 'executions'] ► History            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useJobNotifications Hook                       │
│  • Polls when active jobs detected                              │
│  • Tracks Map<jobId, lastSeenStatus>                            │
│  • Detects transitions: running ► completed/failed              │
│  • Triggers toast notifications                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/features/scraping/api/scheduledScrapeApi.ts` | Create | API layer with DTO mapping for schedules, job actions, history |
| `src/features/scraping/hooks/useSchedules.ts` | Create | React Query query for schedule list with conditional polling |
| `src/features/scraping/hooks/useScheduleMutations.ts` | Create | Mutations for create, pause, resume, delete operations |
| `src/features/scraping/hooks/useExecutionHistory.ts` | Create | Query for execution history with pagination |
| `src/features/scraping/hooks/useJobNotifications.ts` | Create | Polling + transition detection + toast triggers |
| `src/features/scraping/components/ScheduleForm.tsx` | Create | Modal form for schedule creation with cron validation |
| `src/features/scraping/components/SchedulesList.tsx` | Create | Table of jobs with status badges and action buttons |
| `src/features/scraping/components/ExecutionHistory.tsx` | Create | Modal/panel for viewing execution records |
| `src/features/scraping/components/ScrapingWorkspace.tsx` | Create | Tabbed container composing manual + scheduled |
| `src/features/scraping/pages/ScrapingPage.tsx` | Modify | Replace content with ScrapingWorkspace |
| `src/features/scraping/types/index.ts` | Modify | Add scheduled scraping TypeScript types |
| `src/features/scraping/index.ts` | Modify | Export new hooks and components |
| `src/i18n/locales/es/scraping.json` | Modify | Add Spanish translations for scheduled features |
| `src/i18n/locales/en/scraping.json` | Modify | Add English translations for scheduled features |
| `package.json` | Modify | Add `sonner` dependency for toast notifications |

---

## Interfaces / Contracts

### API Types (src/features/scraping/types/index.ts additions)

```typescript
// Schedule Types
export interface CreateScheduleRequest {
  product: ScrapingProduct
  month: ScrapingMonth
  year: ScrapingYear
  cronExpression: string
  customUrl?: string
  label?: string
}

export interface ScheduleResponse {
  id: string
  product: ScrapingProduct
  month: ScrapingMonth
  year: ScrapingYear
  cronExpression: string
  customUrl?: string
  label?: string
  status: 'active' | 'paused' | 'disabled'
  nextRunAt: string | null
  lastRunAt: string | null
  lastRunStatus?: 'completed' | 'failed' | 'running'
  createdAt: string
  updatedAt: string
}

export interface ScheduleListResponse {
  schedules: ScheduleResponse[]
  total: number
}

// Execution Types
export interface ExecutionResponse {
  id: string
  scheduleId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt: string | null
  itemsCount: number
  error?: string
}

export interface ExecutionListResponse {
  executions: ExecutionResponse[]
  total: number
  page: number
  totalPages: number
}

// Query Key Factory
export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters?: ScheduleFilters) => [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
  executions: (id: string) => [...scheduleKeys.detail(id), 'executions'] as const,
}
```

### Polling Configuration

```typescript
// useSchedules.ts - conditional polling
const hasActiveJobs = schedules.some(
  s => s.status === 'active' || s.lastRunStatus === 'running'
)

useQuery({
  queryKey: scheduleKeys.list(),
  queryFn: fetchSchedules,
  refetchInterval: hasActiveJobs ? 30000 : false, // 30s only when active
})
```

---

## Component Hierarchy

```
ScrapingPage
└── ScrapingWorkspace
    ├── TabNavigation (Manual | Scheduled)
    ├── ManualTab (existing, hidden when not active)
    │   ├── ScrapingForm
    │   └── ScrapingResults
    └── ScheduledTab
        ├── Header (title + Create button)
        ├── SchedulesList
        │   └── Table with:
        │       ├── StatusBadge (green/yellow/gray)
        │       ├── ActionButtons (Pause/Resume/Delete)
        │       └── ViewHistory button
        ├── ScheduleForm (modal)
        └── ExecutionHistory (modal/panel)
```

---

## State Management Strategy

### Server State (React Query)
- **Schedule list**: Cached with `staleTime: 60s`, refetched on mount and window focus
- **Individual schedule**: Cached when editing/viewing details
- **Execution history**: Paginated, cached per schedule ID
- **Mutations**: Optimistic updates for pause/resume, invalidate list on success

### Local State
- **Active tab**: Controlled by `ScrapingWorkspace` (URL param optional enhancement)
- **Modal states**: `isCreateOpen`, `isHistoryOpen`, `selectedScheduleId`
- **Transition tracking**: `Map<string, string>` in `useJobNotifications` hook

### No Redux
Per spec requirements, no new Redux slice created. Existing Redux (if any) for auth remains unchanged.

---

## Error Handling Strategy

| Layer | Strategy | Implementation |
|-------|----------|----------------|
| **API** | Axios interceptors | Existing `axiosInstance.ts` handles 401, token refresh |
| **Query/Mutation** | React Query error states | `isError`, `error` returned from hooks; toast on mutation error |
| **Form** | Field-level validation | Zod schema for cron validation, inline error messages |
| **Network** | Retry logic | React Query default retry (3 attempts) |
| **Polling** | Silent failures | Poll failures don't show toast; logged to console |

---

## i18n Integration

Namespace: `scraping` (extends existing)

Structure additions:
```json
{
  "tabs": {
    "manual": "Manual",
    "scheduled": "Programado"
  },
  "scheduled": {
    "title": "Scraping Programado",
    "create": "Crear Programación",
    "table": { "label": "Etiqueta", "status": "Estado", ... },
    "status": { "active": "Activo", "paused": "Pausado", ... },
    "errors": { "invalidCron": "La expresión cron no es válida" }
  },
  "history": {
    "title": "Historial de Ejecuciones",
    "status": { "completed": "Completado", ... }
  },
  "notifications": {
    "completed": { "title": "Scraping Completado", "body": "..." },
    "failed": { "title": "Scraping Fallido", "body": "..." }
  }
}
```

---

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| **Unit** | Hooks | `@testing-library/react` with `renderHook`, mock React Query, test polling logic, transition detection |
| **Unit** | Components | `@testing-library/react`, test form validation, modal open/close, table rendering |
| **Integration** | Feature workflows | Test schedule creation flow: open modal → fill form → submit → verify list updates |
| **Integration** | Polling + notifications | Mock server responses, simulate status transitions, verify toast calls |
| **E2E** | Critical paths | (Optional) Playwright/Cypress for create → pause → resume → delete flow |

### Test Files Required
```
src/features/scraping/__tests__/
├── useSchedules.test.ts
├── useScheduleMutations.test.ts
├── useExecutionHistory.test.ts
├── useJobNotifications.test.ts
├── ScheduleForm.test.tsx
├── SchedulesList.test.tsx
├── ExecutionHistory.test.tsx
└── ScrapingWorkspace.test.tsx
```

---

## Migration / Rollback

### Migration
1. Install `sonner` dependency
2. Add toast provider to app root (if not already present)
3. Deploy new components alongside existing (feature flag optional)
4. Switch `ScrapingPage` to use `ScrapingWorkspace`

### Rollback
1. Revert `ScrapingPage.tsx` to previous implementation
2. Remove new imports/exports from feature index
3. Manual scraping continues to work unchanged
4. No data migration needed (backend owns schedule data)

---

## Open Questions

- [ ] **Toast Library**: Confirm `sonner` choice or preference for alternative (e.g., `react-hot-toast`)?
- [ ] **Cron Validation**: Frontend-only regex or call backend validation endpoint?
- [ ] **URL Params**: Include `?tab=scheduled` in MVP or defer to enhancement?
- [ ] **Polling Interval**: Is 30s acceptable or should it adapt based on job count?

---

## Dependencies to Add

```json
{
  "dependencies": {
    "sonner": "^1.7.0"
  }
}
```

Toast provider setup in app entry point:
```tsx
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      {/* ... */}
    </>
  )
}
```

---

## Implementation Notes

1. **Keep manual scraping untouched**: The existing `ScrapingForm` and `ScrapingResults` remain unchanged; they're just wrapped in `ScrapingWorkspace`

2. **Polling efficiency**: Only poll when:
   - User is on Scheduled tab (optional: poll in background)
   - At least one job has `status === 'active'` or `lastRunStatus === 'running'`

3. **Notification deduplication**: The `useJobNotifications` hook maintains a `Ref` with `Map<jobId, lastSeenStatus>`; only triggers toast when status transitions to terminal state (completed/failed) AND the previous state was different

4. **Modal state preservation**: Use `hidden` class or `display: none` rather than conditional rendering to preserve form state when switching tabs

5. **DTO isolation**: All backend response mapping happens in `scheduledScrapeApi.ts`; hooks work with clean domain types
