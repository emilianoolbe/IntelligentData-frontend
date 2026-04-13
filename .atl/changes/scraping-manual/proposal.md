# Proposal: Manual Scraping

## Intent

Replace the `/scraping` placeholder with a working manual scraping flow so authenticated users can trigger a backend scrape, monitor progress, and review returned data without leaving the frontend.

## Scope

### In Scope
- Add a protected manual scraping page at `/scraping` with product, month, year, and optional custom URL inputs.
- Submit `POST /scraping/manual` through the shared Axios client and manage request lifecycle with React Query.
- Render loading, success, empty, and error states plus a results table using existing UI components and i18n.
- Cover the page behavior with Vitest + Testing Library.

### Out of Scope
- Bulk scraping, scheduling, polling, or scraping history.
- New backend endpoints, server-side validation changes, or data export actions.

## Capabilities

### New Capabilities
- `manual-scraping`: Manual scrape submission, localized form UX, API integration, and results visualization for the scraping workspace.

### Modified Capabilities
- None.

## Approach

Create a dedicated scraping feature module with typed API client, React Query mutation, and presentational sections for form and results. Reuse `Button`, `Input`, `Card`, and `Table`, add route wiring from `AppRouter`, and store UI copy in `es`/`en` locale files. Cache the latest successful response by query key so the page can preserve the most recent result during navigation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/app/router/AppRouter.tsx` | Modified | Replace placeholder route page with feature page |
| `src/features/scraping/**` | New | Page, form, table, hooks, types, API adapter |
| `src/shared/api/axiosInstance.ts` | Reused | Authenticated API transport for manual scrape request |
| `src/components/ui/**` | Reused/Modified | Existing primitives used for form/table states; small extensions only if required |
| `src/i18n/locales/{es,en}/*.json` | Modified | Add scraping labels, errors, and status copy |
| `src/**/*.test.tsx` | New/Modified | Add localized interaction and state coverage |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend payload/response shape is undefined | Med | Define frontend types around the API contract early and isolate mapping in one service |
| Product selector source is unspecified | Med | Keep selector data source behind an adapter so static or API-fed options can be swapped safely |
| Long-running scrape causes confusing UX | Low | Show explicit pending state, disable resubmission, and preserve latest successful table |

## Rollback Plan

Revert the `/scraping` route to the current placeholder, remove the scraping feature module and locale keys, and stop calling `POST /scraping/manual`.

## Dependencies

- Backend contract for `POST /scraping/manual` request/response.
- Existing React Query provider and authenticated Axios instance.

## Success Criteria

- [ ] Authenticated users can open `/scraping`, complete the form, and submit a manual scrape.
- [ ] The frontend sends the request through the shared authenticated client and shows pending/error/success states.
- [ ] Successful responses render in a localized table and remain available as the latest cached result.
- [ ] Spanish and English translations cover form labels, buttons, statuses, and errors.
- [ ] Vitest coverage validates submission flow, loading UX, error handling, and rendered results.
