# Delta for Scheduled Scraping Feature

## Purpose

Enable authenticated users to create recurring scraping jobs, manage job lifecycle (pause/resume/delete), view execution history, and receive notifications when jobs complete or fail—all within the existing `/scraping` workspace alongside manual scraping.

---

# ADDED: Scheduled Scraping Specification

## Requirements

### Requirement: Schedule Creation

The system MUST allow authenticated users to create periodic scraping jobs from the `/scraping` page.

#### Scenario: Create Schedule Form Access

- GIVEN an authenticated user on `/scraping`
- WHEN the user selects the "Scheduled" tab
- THEN the system MUST display a "Create Schedule" button
- AND clicking the button MUST open a schedule creation modal

#### Scenario: Schedule Form Fields

- GIVEN the schedule creation modal is open
- WHEN the form renders
- THEN the system MUST display:
  | Field | Type | Required | Validation |
  |-------|------|----------|------------|
  | Product | Select | Yes | One of `mercadolibre`, `amazon`, `fravega` |
  | Month | Select | Yes | 01-12 |
  | Year | Select | Yes | Current year ± 2 |
  | Cron Expression | Input | Yes | Valid cron format |
  | Custom URL | Input | No | Valid HTTP/HTTPS URL |
  | Label | Input | No | Max 100 chars |

#### Scenario: Cron Expression Validation

- GIVEN the user enters a cron expression
- WHEN the expression is invalid
- THEN the system MUST display `scraping.scheduled.errors.invalidCron`
- AND the form MUST NOT submit

#### Scenario: Successful Schedule Creation

- GIVEN valid form submission
- WHEN the API responds successfully
- THEN the system MUST add the schedule to the jobs list
- AND display `scraping.scheduled.created` toast notification
- AND close the modal

---

### Requirement: Schedule Listing

The system MUST display all scheduled jobs with their status, next run, last run, and actions.

#### Scenario: Job List Display

- GIVEN the user is on the "Scheduled" tab
- WHEN jobs exist
- THEN the system MUST render a table with columns:
  | Column | i18n Key | Data |
  |--------|----------|------|
  | Label | `scraping.scheduled.table.label` | Schedule label or product |
  | Product | `scraping.scheduled.table.product` | Product name |
  | Status | `scraping.scheduled.table.status` | `active` \| `paused` \| `disabled` |
  | Next Run | `scraping.scheduled.table.nextRun` | Formatted datetime |
  | Last Run | `scraping.scheduled.table.lastRun` | Formatted datetime or "—" |
  | Actions | `scraping.scheduled.table.actions` | Pause/Resume/Delete buttons |

#### Scenario: Empty State

- GIVEN no scheduled jobs exist
- WHEN the "Scheduled" tab renders
- THEN the system MUST display `scraping.scheduled.empty` message
- AND show "Create Schedule" button

#### Scenario: Status Badge Colors

- GIVEN a job's status field
- WHEN rendered:
- IF status is `active`: MUST use green badge with i18n `scraping.scheduled.status.active`
- IF status is `paused`: MUST use yellow badge with i18n `scraping.scheduled.status.paused`
- IF status is `disabled`: MUST use gray badge with i18n `scraping.scheduled.status.disabled`

---

### Requirement: Job Lifecycle Management

The system MUST allow users to pause, resume, and delete scheduled jobs.

#### Scenario: Pause Active Job

- GIVEN an active job
- WHEN the user clicks "Pause"
- THEN the system MUST call `PATCH /scraping/schedules/:id/pause`
- AND update the job status to `paused`
- AND display `scraping.scheduled.paused` toast

#### Scenario: Resume Paused Job

- GIVEN a paused job
- WHEN the user clicks "Resume"
- THEN the system MUST call `PATCH /scraping/schedules/:id/resume`
- AND update the job status to `active`
- AND display `scraping.scheduled.resumed` toast

#### Scenario: Delete Job Confirmation

- GIVEN any job
- WHEN the user clicks "Delete"
- THEN the system MUST display a confirmation dialog
- AND show `scraping.scheduled.deleteConfirm` message

#### Scenario: Confirm Deletion

- GIVEN the delete confirmation dialog
- WHEN the user confirms
- THEN the system MUST call `DELETE /scraping/schedules/:id`
- AND remove the job from the list
- AND display `scraping.scheduled.deleted` toast

#### Scenario: Cancel Deletion

- GIVEN the delete confirmation dialog
- WHEN the user cancels
- THEN the dialog MUST close without API call

---

### Requirement: Execution History

The system MUST display execution history for each scheduled job.

#### Scenario: View History Action

- GIVEN a job in the list
- WHEN the user clicks "View History"
- THEN the system MUST open a history panel/modal
- AND fetch execution records from `GET /scraping/schedules/:id/executions`

#### Scenario: History Record Fields

- GIVEN execution history data
- WHEN rendered
- THEN each record MUST display:
  | Field | i18n Key | Format |
  |-------|----------|--------|
  | Execution ID | `scraping.history.id` | Truncated UUID |
  | Started At | `scraping.history.startedAt` | Locale datetime |
  | Completed At | `scraping.history.completedAt` | Locale datetime or "—" |
  | Status | `scraping.history.status` | Badge |
  | Items Count | `scraping.history.items` | Number |
  | Error | `scraping.history.error` | Truncated if long |

#### Scenario: History Status Colors

- GIVEN an execution's status
- WHEN rendered:
- IF `completed`: MUST use green badge
- IF `failed`: MUST use red badge
- IF `running`: MUST use blue badge with spinner

#### Scenario: History Pagination

- GIVEN more than 20 records exist
- WHEN the history panel renders
- THEN pagination controls MUST appear
- AND load 20 records per page

---

### Requirement: Active Job Polling

The system MUST poll active jobs to detect status transitions and trigger notifications.

#### Scenario: Start Polling

- GIVEN at least one active job exists
- WHEN the "Scheduled" tab is active
- THEN the system MUST start polling `GET /scraping/schedules` every 30 seconds
- AND use React Query's `refetchInterval`

#### Scenario: Stop Polling

- GIVEN no active jobs exist
- WHEN the "Scheduled" tab renders
- THEN polling MUST NOT occur

#### Scenario: Detect Status Transition

- GIVEN a job transitions from `running` to `completed` or `failed`
- WHEN the poll response is received
- THEN the system MUST compare previous vs current status
- AND trigger a notification ONCE per transition
- AND mark the transition as "seen" in local state

#### Scenario: Transition Tracking

- GIVEN job status tracking
- WHEN tracking transitions
- THEN the system MUST use `Map<jobId, lastSeenStatus>` in local state
- AND update on each successful poll

---

### Requirement: Completion/Failure Notifications

The system MUST display in-app notifications when jobs complete or fail.

#### Scenario: Success Notification

- GIVEN a job transitions to `completed`
- WHEN detected via polling
- THEN the system MUST display a success toast with:
  - Title: `scraping.notifications.completed.title`
  - Body: `scraping.notifications.completed.body` with `{{label}}` interpolation
- AND sound MUST NOT play (respect browser notification preferences)

#### Scenario: Failure Notification

- GIVEN a job transitions to `failed`
- WHEN detected via polling
- THEN the system MUST display an error toast with:
  - Title: `scraping.notifications.failed.title`
  - Body: `scraping.notifications.failed.body` with `{{label}}` and `{{error}}` interpolation

#### Scenario: No Duplicate Notifications

- GIVEN a job has already transitioned
- WHEN the same status is seen again
- THEN the system MUST NOT duplicate notifications
- AND use `lastSeenStatus` map to prevent duplicates

#### Scenario: Notification on Tab Background

- GIVEN the user navigates away from `/scraping`
- WHEN a job completes or fails
- THEN the notification MUST still display
- AND be visible when the user returns

---

### Requirement: API Request Types

The system MUST define TypeScript types for all scheduled scraping API contracts.

#### Scenario: Create Schedule Request

- GIVEN the schedule creation form
- WHEN types are defined
- THEN `CreateScheduleRequest` MUST include:

```typescript
interface CreateScheduleRequest {
  product: ScrapingProduct
  month: ScrapingMonth
  year: ScrapingYear
  cronExpression: string
  customUrl?: string
  label?: string
}
```

#### Scenario: Schedule Response

- GIVEN API responses
- THEN `ScheduleResponse` MUST include:

```typescript
interface ScheduleResponse {
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
```

#### Scenario: Execution Response

- GIVEN history API responses
- THEN `ExecutionResponse` MUST include:

```typescript
interface ExecutionResponse {
  id: string
  scheduleId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt: string
  completedAt: string | null
  itemsCount: number
  error?: string
}
```

---

### Requirement: React Query Query Keys

The system MUST define stable query keys for scheduled scraping data.

#### Scenario: Query Key Factory

- GIVEN `src/features/scraping/hooks/useScheduledScrape.ts`
- WHEN query keys are defined
- THEN the following keys MUST exist:

```typescript
const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters?: ScheduleFilters) => [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...scheduleKeys.details(), id] as const,
  executions: (id: string) => [...scheduleKeys.detail(id), 'executions'] as const,
}
```

---

### Requirement: Workspace Composition

The `/scraping` page MUST compose manual and scheduled scraping in a tabbed interface.

#### Scenario: Tab Navigation

- GIVEN the user navigates to `/scraping`
- WHEN the page renders
- THEN two tabs MUST be visible:
  - "Manual" with i18n key `scraping.tabs.manual`
  - "Scheduled" with i18n key `scraping.tabs.scheduled`
- AND the "Manual" tab MUST be active by default

#### Scenario: Tab State Preservation

- GIVEN the user switches tabs
- WHEN returning to a previous tab
- THEN form state for "Manual" MUST persist
- AND scroll position for "Scheduled" list MUST restore

#### Scenario: URL Tab Parameter (Optional Enhancement)

- GIVEN the user navigates to `/scraping?scheduled=true`
- WHEN the page loads
- THEN the "Scheduled" tab MUST be active
- AND this is OPTIONAL (not required for MVP)

---

### Requirement: State Management Strategy

The system MUST use React Query for server state and local state for UI transitions.

#### Scenario: React Query for Server State

- GIVEN schedule and execution data
- WHEN fetching/updating
- THEN React Query MUST handle:
  - Schedule list fetching
  - Schedule creation mutations
  - Pause/Resume/Delete mutations
  - Execution history queries

#### Scenario: Local State for Transition Tracking

- GIVEN notification deduplication needs
- WHEN tracking job transitions
- THEN local `useState` or `useRef` MUST store:
  ```typescript
  type TransitionState = Map<string, 'running' | 'completed' | 'failed' | null>
  ```

#### Scenario: No Redux for Scheduled Scraping

- GIVEN the proposal guidance
- WHEN implementing state
- THEN NO new Redux slice MUST be created
- AND existing React Query patterns MUST be reused

---

## i18n Keys Required

All scheduled scraping text MUST be internationalized.

### Spanish Keys (es)

| Key| Spanish Value |
|-----|---------------|
| `scraping.tabs.manual` | "Manual" |
| `scraping.tabs.scheduled` | "Programado" |
| `scraping.scheduled.title` | "Scraping Programado" |
| `scraping.scheduled.subtitle` | "Crea y gestiona trabajos de scraping recurrentes" |
| `scraping.scheduled.create` | "Crear Programación" |
| `scraping.scheduled.created` | "Programación creada exitosamente" |
| `scraping.scheduled.empty` | "No hay trabajos programados. Crea uno para comenzar." |
| `scraping.scheduled.table.label` | "Etiqueta" |
| `scraping.scheduled.table.product` | "Producto" |
| `scraping.scheduled.table.status` | "Estado" |
| `scraping.scheduled.table.nextRun` | "Próxima Ejecución" |
| `scraping.scheduled.table.lastRun` | "Última Ejecución" |
| `scraping.scheduled.table.actions` | "Acciones" |
| `scraping.scheduled.status.active` | "Activo" |
| `scraping.scheduled.status.paused` | "Pausado" |
| `scraping.scheduled.status.disabled` | "Desactivado" |
| `scraping.scheduled.pause` | "Pausar" |
| `scraping.scheduled.resume` | "Reanudar" |
| `scraping.scheduled.delete` | "Eliminar" |
| `scraping.scheduled.paused` | "Programación pausada" |
| `scraping.scheduled.resumed` | "Programación reanudada" |
| `scraping.scheduled.deleted` | "Programación eliminada" |
| `scraping.scheduled.deleteConfirm` | "¿Estás seguro de que deseas eliminar esta programación?" |
| `scraping.scheduled.errors.invalidCron` | "La expresión cron no es válida" |
| `scraping.history.title` | "Historial de Ejecuciones" |
| `scraping.history.id` | "ID" |
| `scraping.history.startedAt` | "Inicio" |
| `scraping.history.completedAt` | "Fin" |
| `scraping.history.status` | "Estado" |
| `scraping.history.items` | "Elementos" |
| `scraping.history.error` | "Error" |
| `scraping.history.status.completed` | "Completado" |
| `scraping.history.status.failed` | "Fallido" |
| `scraping.history.status.running` | "Ejecutando" |
| `scraping.history.empty` | "No hay ejecuciones para esta programación" |
| `scraping.history.view` | "Ver Historial" |
| `scraping.history.close` | "Cerrar" |
| `scraping.notifications.completed.title` | "Scraping Completado" |
| `scraping.notifications.completed.body` | "El trabajo '{{label}}' ha finalizado exitosamente" |
| `scraping.notifications.failed.title` | "Scraping Fallido" |
| `scraping.notifications.failed.body` | "El trabajo '{{label}}' ha fallado: {{error}}" |

### English Keys (en)

| Key | English Value |
|-----|---------------|
| `scraping.tabs.manual` | "Manual" |
| `scraping.tabs.scheduled` | "Scheduled" |
| `scraping.scheduled.title` | "Scheduled Scraping" |
| `scraping.scheduled.subtitle` | "Create and manage recurring scraping jobs" |
| `scraping.scheduled.create` | "Create Schedule" |
| `scraping.scheduled.created` | "Schedule created successfully" |
| `scraping.scheduled.empty` | "No scheduled jobs. Create one to get started." |
| `scraping.scheduled.table.label` | "Label" |
| `scraping.scheduled.table.product` | "Product" |
| `scraping.scheduled.table.status` | "Status" |
| `scraping.scheduled.table.nextRun` | "Next Run" |
| `scraping.scheduled.table.lastRun` | "Last Run" |
| `scraping.scheduled.table.actions` | "Actions" |
| `scraping.scheduled.status.active` | "Active" |
| `scraping.scheduled.status.paused` | "Paused" |
| `scraping.scheduled.status.disabled` | "Disabled" |
| `scraping.scheduled.pause` | "Pause" |
| `scraping.scheduled.resume` | "Resume" |
| `scraping.scheduled.delete` | "Delete" |
| `scraping.scheduled.paused` | "Schedule paused" |
| `scraping.scheduled.resumed` | "Schedule resumed" |
| `scraping.scheduled.deleted` | "Schedule deleted" |
| `scraping.scheduled.deleteConfirm` | "Are you sure you want to delete this schedule?" |
| `scraping.scheduled.errors.invalidCron` | "Invalid cron expression" |
| `scraping.history.title` | "Execution History" |
| `scraping.history.id` | "ID" |
| `scraping.history.startedAt` | "Started" |
| `scraping.history.completedAt` | "Completed" |
| `scraping.history.status` | "Status" |
| `scraping.history.items` | "Items" |
| `scraping.history.error` | "Error" |
| `scraping.history.status.completed` | "Completed" |
| `scraping.history.status.failed` | "Failed" |
| `scraping.history.status.running` | "Running" |
| `scraping.history.empty` | "No executions for this schedule" |
| `scraping.history.view` | "View History" |
| `scraping.history.close` | "Close" |
| `scraping.notifications.completed.title` | "Scraping Completed" |
| `scraping.notifications.completed.body` | "Job '{{label}}' completed successfully" |
| `scraping.notifications.failed.title` | "Scraping Failed" |
| `scraping.notifications.failed.body` | "Job '{{label}}' failed: {{error}}" |

---

# MODIFIED: Manual Scraping Specification

### Requirement: Scraping Page Workspace Evolution

(Previously: The system MUST provide a protected page at `/scraping` with a form to submit manual scrape requests and display results.)

The system MUST provide a protected page at `/scraping` with a tabbed interface containing both manual scraping form and scheduled jobs management.

#### Scenario: Tabbed Interface Structure

- GIVEN an authenticated user navigates to `/scraping`
- WHEN the page loads
- THEN a tab navigation MUST appear at the top
- AND the "Manual" tab MUST be active by default
- AND the manual scraping form and results MUST render unchanged

#### Scenario: Manual Tab Unchanged

- GIVEN the "Manual" tab is active
- WHEN the form renders
- THEN all existing manual scraping functionality MUST work exactly as before
- AND the form, validation, submission, and results MUST be identical to the previous implementation

#### Scenario: Scheduled Tab Integration

- GIVEN the user clicks the "Scheduled" tab
- WHEN the tab becomes active
- THEN the scheduled jobs interface MUST render
- AND the manual form MUST be hidden (not unmounted)
- AND tab state MUST persist while navigating within `/scraping`

---

## File Structure

The scheduled scraping feature MUST extend the existing feature structure.

```
src/features/scraping/
├── api/
│   ├── manualScrapeApi.ts          # Existing - unchanged
│   └── scheduledScrapeApi.ts       # NEW - schedule CRUD, job actions, history
├── components/
│   ├── ScrapingForm.tsx            # Existing - unchanged
│   ├── ScrapingResults.tsx         # Existing - unchanged
│   ├── ScheduleForm.tsx            # NEW - schedule creation modal
│   ├── SchedulesList.tsx           # NEW - jobs table with actions
│   ├── ExecutionHistory.tsx        # NEW - history panel/modal
│   └── ScrapingWorkspace.tsx       # NEW - tabbed container
├── hooks/
│   ├── useManualScrape.ts          # Existing - unchanged
│   ├── useSchedules.ts             # NEW - React Query query for schedule list
│   ├── useScheduleMutations.ts     # NEW - create/pause/resume/delete mutations
│   ├── useExecutionHistory.ts      # NEW - React Query query for history
│   └── useJobNotifications.ts      # NEW - polling + transition detection
├── pages/
│   └── ScrapingPage.tsx            # MODIFIED - uses new ScrapingWorkspace
├── types/
│   └── index.ts                    # MODIFIED - adds scheduled types
└── index.ts                        # MODIFIED - exports new hooks/components
```

---

## API Contract Summary

### GET /scraping/schedules

**Response (200 OK):**
```typescript
interface ScheduleListResponse {
  schedules: ScheduleResponse[]
  total: number
}
```

### POST /scraping/schedules

**Request:**
```typescript
interface CreateScheduleRequest {
  product: ScrapingProduct
  month: ScrapingMonth
  year: ScrapingYear
  cronExpression: string
  customUrl?: string
  label?: string
}
```

**Response (201 Created):** `ScheduleResponse`

### PATCH /scraping/schedules/:id/pause

**Response (200 OK):** `ScheduleResponse`

### PATCH /scraping/schedules/:id/resume

**Response (200 OK):** `ScheduleResponse`

### DELETE /scraping/schedules/:id

**Response (204 No Content)**

### GET /scraping/schedules/:id/executions

**Query Parameters:**
- `page`: number (default 1)- `limit`: number (default 20)

**Response (200 OK):**
```typescript
interface ExecutionListResponse {
  executions: ExecutionResponse[]
  total: number
  page: number
  totalPages: number
}
```

---

## Test Scenarios

### Test Files Required

```
src/features/scraping/__tests__/
├── useSchedules.test.ts           # NEW
├── useScheduleMutations.test.ts   # NEW
├── useExecutionHistory.test.ts    # NEW
├── useJobNotifications.test.ts    # NEW
├── ScheduleForm.test.tsx          # NEW
├── SchedulesList.test.tsx         # NEW
├── ExecutionHistory.test.tsx      # NEW
└── ScrapingWorkspace.test.tsx    # NEW
```

### Test Case: Schedule Creation

#### Scenario: Valid Schedule Creation

- GIVEN valid form data
- WHEN the user submits
- THEN `createSchedule` mutation MUST be called
- AND on success, the schedule MUST appear in the list
- AND a success toast MUST display

#### Scenario: Invalid Cron Expression

- GIVEN an invalid cron expression
- WHEN the user submits
- THEN validation error MUST display
- AND mutation MUST NOT be called

### Test Case: Job Actions

#### Scenario: Pause Job

- GIVEN an active job
- WHEN "Pause" is clicked
- THEN `pauseSchedule` mutation MUST be called
- AND status MUST update to `paused`

#### Scenario: Resume Job

- GIVEN a paused job
- WHEN "Resume" is clicked
- THEN `resumeSchedule` mutation MUST be called
- AND status MUST update to `active`

#### Scenario: Delete Job

- GIVEN any job
- WHEN "Delete" is clicked and confirmed
- THEN `deleteSchedule` mutation MUST be called
- AND the job MUST be removed from the list

### Test Case: Polling and Notifications

#### Scenario: Active Job Polling

- GIVEN at least one active job
- WHEN the Scheduled tab is active
- THEN polling MUST start at 30-second intervals

#### Scenario: No Active Jobs

- GIVEN no active jobs
- WHEN the Scheduled tab is active
- THEN polling MUST NOT occur

#### Scenario: Status Transition Detection

- GIVEN job status is `running`
- WHEN poll returns `completed`
- THEN a success notification MUST display
- AND `lastSeenStatus` MUST update to `completed`

#### Scenario: Duplicate Prevention

- GIVEN job already transitioned to `completed`
- WHEN subsequent polls return `completed`
- THEN NO notification MUST display

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Backend contract differs from assumed model | Isolate DTO mapping in `scheduledScrapeApi.ts` |
| Polling causes noisy UX | Poll active jobs only; stop on terminal states |
| Notifications duplicate on refresh/navigation | Track transitions by id + lastSeenStatus |
| Modal/panel state lost on tab switch | Preserve React state; use `hidden` instead of unmount |