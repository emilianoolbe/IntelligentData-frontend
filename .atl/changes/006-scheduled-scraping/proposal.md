# Proposal: Scheduled Scraping Feature

## Intent

Move scraping from a purely manual action to an operational workflow so authenticated users can program recurring jobs, track execution health, and react to failures without re-running scrapes by hand.

## Scope

### In Scope
- Add UI to create periodic scraping jobs from the existing protected scraping area.
- List scheduled jobs with status, next run, last run, and actions to pause, resume, and delete.
- Show per-job execution history and surface completion/failure notifications.
- Integrate schedule creation and job management with backend scheduling endpoints using the shared authenticated API client and React Query.

### Out of Scope
- Backend scheduler implementation or cron infrastructure changes.
- Real-time push channels; frontend may use polling until websocket/SSE support exists.
- Advanced analytics, bulk job editing, or exported history reports.

## Capabilities

### New Capabilities
- `scheduled-scraping`: Recurring scrape creation, job lifecycle management, execution history, and completion/failure notifications.

### Modified Capabilities
- `manual-scraping`: Evolve `/scraping` into a shared scraping workspace so manual and scheduled flows coexist without breaking the current manual path.

## Approach

Extend `src/features/scraping` instead of creating a parallel feature. Add typed schedule/job/history contracts, React Query queries + mutations for CRUD/job actions, and a workspace composition that keeps manual scraping intact while adding a scheduled jobs section or tab. Poll only active jobs, detect status transitions from cached data, and trigger localized in-app notifications when a run completes or fails. Keep server state in React Query; avoid a new Redux slice.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/features/scraping/api/**` | Modified/New | Schedule, job action, and history API adapters |
| `src/features/scraping/hooks/**` | New | Queries/mutations for jobs, polling, notification triggers |
| `src/features/scraping/components/**` | New/Modified | Schedule form, jobs table, history panel, workspace composition |
| `src/features/scraping/pages/ScrapingPage.tsx` | Modified | Host manual + scheduled scraping experience |
| `src/i18n/locales/{es,en}/scraping.json` | Modified | Scheduled labels, statuses, history, notification copy |
| `src/components/ui/**` | Reused/Modified | Table/card/alert patterns; toast primitive only if needed |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend contract differs from assumed job model | Med | Isolate DTO mapping in one API layer |
| Polling causes noisy UX or extra traffic | Med | Poll active jobs only and stop on terminal states |
| Notifications duplicate on refresh/navigation | Med | Track status transitions by job id + last seen state |

## Rollback Plan

Remove scheduled workspace additions, polling, and notifications; restore `/scraping` to the current manual-only experience; keep manual scraping API/types unchanged.

## Dependencies

- Backend endpoints for schedule CRUD, pause/resume, history, and job status.
- Existing React Query provider, authenticated Axios client, protected routing, and i18n namespaces.

## Success Criteria

- [ ] Users can create, view, pause, resume, and delete scheduled scraping jobs.
- [ ] Active jobs expose localized status, next run, and execution history in the scraping workspace.
- [ ] Completion/failure notifications appear once per detected terminal transition.
- [ ] Manual scraping remains available and functional inside the updated `/scraping` experience.
