# Manual Scraping Specification

## Purpose

Enable authenticated users to trigger manual scraping operations via a dedicated page at `/scraping`, with form validation, API integration through React Query, localized UX (Spanish/English), and results visualization in a table format.

---

## Requirements

### Requirement: Manual Scraping Page

The system MUST provide a protected page at `/scraping` with a form to submit manual scrape requests and display results.

#### Scenario: Authenticated Access Only

- GIVEN an unauthenticated user
- WHEN they navigate to `/scraping`
- THEN the system MUST redirect to `/login`
- AND the scraping page MUST NOT render

#### Scenario: Page Structure

- GIVEN an authenticated user navigates to `/scraping`
- WHEN the page loads
- THEN the page MUST display a Card component containing a form
- AND the form MUST include product selector, month, year, and optional URL fields
- AND a results section MUST appear below the form
- AND all text MUST use i18n translation keys

---

### Requirement: Form Fields and Validation

The form MUST collect product, month, year, and optional custom URL with client-side validation before submission.

#### Scenario: Required Field Validation

- GIVEN the user has not entered a product
- WHEN the user attempts to submit the form
- THEN the system MUST display the error message from `scraping.errors.productRequired`
- AND the form MUST NOT submit

#### Scenario: Month Validation

- GIVEN the user enters an invalid month value
- WHEN the user attempts to submit the form
- THEN the system MUST display the error message from `scraping.errors.monthInvalid`
- AND the form MUST NOT submit

#### Scenario: Year Validation

- GIVEN the user enters a year outside the range 2020–current year + 1
- WHEN the user attempts to submit the form
- THEN the system MUST display the error message from `scraping.errors.yearInvalid`
- AND the form MUST NOT submit

#### Scenario: Custom URL Validation

- GIVEN the user provides a custom URL
- WHEN the URL is not a valid HTTP/HTTPS URL
- THEN the system MUST display the error message from `scraping.errors.urlInvalid`
- AND the form MUST NOT submit

#### Scenario: Optional URL Field

- GIVEN the user leaves the custom URL field empty
- WHEN the user submits the form with valid required fields
- THEN the system MUST proceed with submission
- AND the request body MUST NOT include the URL field

---

### Requirement: API Request Types

The system MUST define TypeScript types for the manual scraping API contract.

#### Scenario: Request Type Definition

- GIVEN the scraping types module
- WHEN types are defined
- THEN the `ManualScrapeRequest` type MUST include:
  | Field | Type | Required |
  |-------|------|----------|
  | `product` | `string` | Yes |
  | `month` | `number` (1-12) | Yes |
  | `year` | `number` | Yes |
  | `customUrl` | `string` | No |

#### Scenario: Response Type Definition

- GIVEN a successful scrape response
- THEN the `ManualScrapeResponse` type MUST include:
  | Field | Type | Description |
  |-------|------|-------------|
  | `id` | `string` | Unique scrape operation ID |
  | `status` | `'pending' \| 'completed' \| 'failed'` | Operation status |
  | `data` | `ScrapeResult[] \| null` | Results array (null if pending/failed) |
  | `error` | `string \| null` | Error message if failed |
  | `createdAt` | `string` (ISO 8601) | Timestamp |

#### Scenario: Scrape Result Type

- GIVEN results are returned
- THEN each `ScrapeResult` MUST include:
  | Field | Type |
  |-------|------|
  | `title` | `string` |
  | `price` | `number` |
  | `currency` | `string` |
  | `sourceUrl` | `string` |
  | `extractedAt` | `string` (ISO 8601) |

---

### Requirement: React Query Integration

The system MUST use React Query's `useMutation` hook for the scraping API call with proper state management.

#### Scenario: Mutation Hook Structure

- GIVEN the `useManualScrape` hook
- WHEN invoked
- THEN it MUST return `{ mutate, isLoading, error, data, reset }`
- AND `mutate` MUST accept `ManualScrapeRequest` as payload
- AND `data` MUST be typed as `ManualScrapeResponse | null`

#### Scenario: Successful Submission

- GIVEN the user submits a valid form
- WHEN the API responds successfully
- THEN the system MUST cache the response under query key `['scraping', 'manual']`
- AND the results table MUST display the returned data
- AND the form fields MUST be reset

#### Scenario: Error Handling

- GIVEN the API call fails
- WHEN an error is received
- THEN the system MUST display the localized error message
- AND the submit button MUST be re-enabled
- AND the form fields MUST retain their values

#### Scenario: Loading State

- GIVEN the mutation is in progress
- WHEN `isLoading` is `true`
- THEN the submit button MUST show `isLoading={true}`
- AND the submit button MUST be disabled
- AND a loading indicator MUST be visible to the user

---

### Requirement: Loading States and UX

The form MUST provide clear visual feedback during all states: idle, loading, success, and error.

#### Scenario: Idle State

- GIVEN no submission has occurred
- WHEN the page loads
- THEN the submit button MUST be enabled
- AND no error or success messages MUST be displayed
- AND the results section MUST show empty state if no cached data

#### Scenario: Loading State Visual Feedback

- GIVEN the user submits the form
- WHEN the request is in progress
- THEN the submit button MUST display a spinner
- AND the button text MUST change to the loading translation key
- AND all form inputs MUST be disabled

#### Scenario: Success State

- GIVEN the API returns successfully
- WHEN results are available
- THEN a success alert MUST display `scraping.success.subtitle`
- AND the results table MUST render with returned data
- AND the submit button MUST return to enabled state

#### Scenario: Error State with Retry

- GIVEN the API call fails
- WHEN an error is displayed
- THEN the error message MUST use i18n key `scraping.errors.submitFailed` or the specific backend error
- AND the user MUST be able to retry submission immediately
- AND form values MUST persist for correction

---

### Requirement: Results Table Specification

The system MUST render scraping results in a Table component with localized headers and formatted data.

#### Scenario: Table Columns

- GIVEN results are available
- WHEN the table renders
- THEN columns MUST be in order:
  | Column | i18n Key | Data Field |
  |--------|----------|------------|
  | Title | `scraping.table.title` | `title` |
  | Price | `scraping.table.price` | `price` + `currency` |
  | Source | `scraping.table.source` | `sourceUrl` (as link) |
  | Extracted | `scraping.table.extracted` | `extractedAt` (formatted) |

#### Scenario: Price Formatting

- GIVEN a result has price and currency
- WHEN the price cell renders
- THEN the system MUST format as: `{currency} {price.toLocaleString()}`
- AND the currency MUST display as symbol (e.g., `$`, `€`) when possible

#### Scenario: Date Formatting

- GIVEN a result has `extractedAt` ISO date
- WHEN the cell renders
- THEN the system MUST format the date according to the active locale:
  - Spanish: `DD/MM/YYYY HH:mm`
  - English: `MM/DD/YYYY HH:mm`

#### Scenario: Empty Results State

- GIVEN the API returns an empty `data` array
- WHEN the table renders
- THEN the system MUST use `TableEmpty` component
- AND display `scraping.table.empty` translation key

#### Scenario: No Cached Results

- GIVEN no submission has occurred
- WHEN the results section renders
- THEN the system MUST display a placeholder Card
- AND show `scraping.results.emptyTitle` and `scraping.results.emptySubtitle`

---

### Requirement: i18n Keys Required

All user-facing text MUST be internationalized with Spanish and English translations.

#### Scenario: Spanish Keys

- GIVEN the locale is `es`
- WHEN scraping page renders
- THEN the following keys MUST exist with Spanish values:

| Key | Spanish Value |
|-----|---------------|
| `scraping.title` | "Scraping Manual" |
| `scraping.subtitle` | "Extrae datos de productos manualmente" |
| `scraping.form.product` | "Producto" |
| `scraping.form.productPlaceholder` | "Nombre del producto" |
| `scraping.form.month` | "Mes" |
| `scraping.form.year` | "Año" |
| `scraping.form.customUrl` | "URL Personalizada (opcional)" |
| `scraping.form.customUrlPlaceholder` | "https://..." |
| `scraping.form.submit` | "Iniciar Scraping" |
| `scraping.form.submitting` | "Procesando..." |
| `scraping.errors.productRequired` | "El producto es requerido" |
| `scraping.errors.monthInvalid` | "Selecciona un mes válido" |
| `scraping.errors.yearInvalid` | "El año debe estar entre 2020 y {{maxYear}}" |
| `scraping.errors.urlInvalid` | "Ingresa una URL válida (http o https)" |
| `scraping.errors.submitFailed` | "Error al procesar el scraping. Intenta nuevamente." |
| `scraping.success.title` | "Scraping Completado" |
| `scraping.success.subtitle` | "Se encontraron {{count}} resultados" |
| `scraping.table.title` | "Título" |
| `scraping.table.price` | "Precio" |
| `scraping.table.source` | "Fuente" |
| `scraping.table.extracted` | "Extraído" |
| `scraping.table.empty` | "No se encontraron resultados" |
| `scraping.results.emptyTitle` | "Sin Resultados" |
| `scraping.results.emptySubtitle` | "Completa el formulario y presiona 'Iniciar Scraping' para ver los resultados" |

#### Scenario: English Keys

- GIVEN the locale is `en`
- WHEN scraping page renders
- THEN the following keys MUST exist with English values:

| Key | English Value |
|-----|---------------|
| `scraping.title` | "Manual Scraping" |
| `scraping.subtitle` | "Extract product data manually" |
| `scraping.form.product` | "Product" |
| `scraping.form.productPlaceholder` | "Product name" |
| `scraping.form.month` | "Month" |
| `scraping.form.year` | "Year" |
| `scraping.form.customUrl` | "Custom URL (optional)" |
| `scraping.form.customUrlPlaceholder` | "https://..." |
| `scraping.form.submit` | "Start Scraping" |
| `scraping.form.submitting` | "Processing..." |
| `scraping.errors.productRequired` | "Product is required" |
| `scraping.errors.monthInvalid` | "Select a valid month" |
| `scraping.errors.yearInvalid` | "Year must be between 2020 and {{maxYear}}" |
| `scraping.errors.urlInvalid` | "Enter a valid URL (http or https)" |
| `scraping.errors.submitFailed` | "Scraping failed. Please try again." |
| `scraping.success.title` | "Scraping Complete" |
| `scraping.success.subtitle` | "Found {{count}} results" |
| `scraping.table.title` | "Title" |
| `scraping.table.price` | "Price" |
| `scraping.table.source` | "Source" |
| `scraping.table.extracted` | "Extracted" |
| `scraping.table.empty` | "No results found" |
| `scraping.results.emptyTitle` | "No Results" |
| `scraping.results.emptySubtitle` | "Complete the form and click 'Start Scraping' to see results" |

---

### Requirement: File Structure

The scraping feature MUST follow the established feature-based architecture.

#### Scenario: Feature Module Structure

- GIVEN the `src/features/scraping/` directory
- WHEN the feature is implemented
- THEN the following structure MUST exist:

```
src/features/scraping/
├── api/
│   └── manualScrapeApi.ts          # API client using apiClient
├── components/
│   ├── ScrapingForm.tsx            # Form component with validation
│   └── ScrapingResults.tsx         # Results table component
├── hooks/
│   └── useManualScrape.ts          # React Query mutation hook
├── pages/
│   └── ScrapingPage.tsx            # Main page component
├── types/
│   └── index.ts                    # Request/Response types
└── index.ts                        # Public exports
```

---

### Requirement: Router Integration

The `/scraping` route MUST use the existing `ScrapingPage` component within the protected layout.

#### Scenario: Route Registration

- GIVEN the `AppRouter` configuration
- WHEN routes are defined
- THEN the `/scraping` path MUST render `ScrapingPage` component
- AND the route MUST be inside the `ProtectedRoute` wrapper

---

### Requirement: Accessibility

The scraping page MUST meet WCAG 2.2 AA accessibility standards.

#### Scenario: Form Labels

- GIVEN any form input
- WHEN the component renders
- THEN each input MUST have an associated `<label>` element
- AND the label MUST use translation keys

#### Scenario: Error Announcements

- GIVEN a validation or API error
- WHEN the error is displayed
- THEN the error message MUST have `role="alert"`
- AND screen readers MUST announce the error

#### Scenario: Focus Management

- GIVEN the user submits the form
- WHEN the API responds
- IF an error occurs:
  - THEN focus MUST move to the error alert
- IF results are returned:
  - THEN focus MAY optionally move to the results section

---

## Test Scenarios

### Test Files Required

```
src/features/scraping/__tests__/
├── useManualScrape.test.ts         # Hook tests
├── ScrapingForm.test.tsx           # Form component tests
├── ScrapingResults.test.tsx        # Results table tests
└── ScrapingPage.test.tsx          # Integration tests
```

### Test Case: Form Validation

#### Scenario: Product Required Validation

- GIVEN the form is rendered
- WHEN the user submits without entering a product
- THEN `scraping.errors.productRequired` MUST be displayed
- AND `mutate` MUST NOT be called

#### Scenario: Invalid URL Format

- GIVEN the user enters "not-a-url" in the custom URL field
- WHEN the user submits
- THEN `scraping.errors.urlInvalid` MUST be displayed
- AND `mutate` MUST NOT be called

### Test Case: API Integration

#### Scenario: Successful Submission Flow

- GIVEN valid form data
- WHEN the user submits
- THEN `useManualScrape.mutate` MUST be called with correct payload
- AND on success, results MUST be cached
- AND the table MUST render returned data

#### Scenario: API Error Handling

- GIVEN the API returns an error
- WHEN the mutation fails
- THEN the error MUST be displayed
- AND the form MUST retain user input
- AND the user MUST be able to resubmit

### Test Case: Loading State

#### Scenario: Button Disabled During Loading

- GIVEN the mutation is in progress
- WHEN `isLoading` is `true`
- THEN the submit button MUST have `disabled` attribute
- AND the button MUST show loading spinner

### Test Case: Results Rendering

#### Scenario: Empty Results Display

- GIVEN the API returns `{ data: [] }`
- WHEN the results section renders
- THEN `TableEmpty` component MUST be used
- AND `scraping.table.empty` translation MUST display

#### Scenario: Results With Data

- GIVEN the API returns results array
- WHEN the table renders
- THEN each row MUST display title, formatted price, source link, and formatted date
- AND rows MUST be clickable (optional future requirement)

### Test Case: i18n Integration

#### Scenario: Spanish Locale Rendering

- GIVEN the locale is set to Spanish
- WHEN the page renders
- THEN all text MUST match Spanish translation values
- AND date format MUST use Spanish locale conventions

#### Scenario: English Locale Rendering

- GIVEN the locale is set to English
- WHEN the page renders
- THEN all text MUST match English translation values
- AND date format MUST use English locale conventions

---

## API Contract Summary

### POST /scraping/manual

**Request:**
```typescript
interface ManualScrapeRequest {
  product: string        // Required: product name to scrape
  month: number          // Required: 1-12
  year: number           // Required: 2020 to current year + 1
  customUrl?: string     // Optional: override URL
}
```

**Response (200 OK):**
```typescript
interface ManualScrapeResponse {
  id: string
  status: 'pending' | 'completed' | 'failed'
  data: ScrapeResult[] | null
  error: string | null
  createdAt: string  // ISO 8601
}

interface ScrapeResult {
  title: string
  price: number
  currency: string
  sourceUrl: string
  extractedAt: string  // ISO 8601
}
```

**Response (400 Bad Request):**
```typescript
interface ErrorResponse {
  error: string
  code: string
}
```

**Response (401 Unauthorized):**
- Handled by axios interceptor (redirect to login)

**Response (500 Internal Server Error):**
```typescript
interface ErrorResponse {
  error: string
  code: 'INTERNAL_ERROR'
}
```

---

## State Management

### React Query Cache

- **Query Key**: `['scraping', 'manual']`
- **Stale Time**: Use default (5 minutes)
- **Cache Time**: Use default
- **Refetch on Window Focus**: false (manual operation)

### Local Form State

- Use React `useState` for form field values
- Reset form on successful submission
- Preserve form values on error for retry

### No Redux Required

- This feature uses React Query for server state
- No need for additional Redux slice
- Auth state accessed via `useAuth` hook

---

## Implementation Notes

1. **API Client Location**: Create `src/features/scraping/api/manualScrapeApi.ts` that imports and uses `apiClient` from `src/shared/api/axiosInstance.ts`

2. **Month Selector**: Consider using a `<select>` with month names translated via i18n, or a number input with validation (1-12)

3. **Year Selector**: Use current year as max + 1, minimum 2020. Consider `<input type="number">` or `<select>`

4. **URL Validation**: Use browser `URL` constructor for validation—no external libraries needed

5. **Date Formatting**: Use `Intl.DateTimeFormat` with locale from i18n for consistent formatting

6. **Price Formatting**: Use `Intl.NumberFormat` with currency code for proper symbol placement

7. **Error Boundary**: Consider wrapping ScrapingPage in an ErrorBoundary for unexpected errors

8. **Future Enhancements** (Out of Scope):
   - Bulk scraping
   - Polling for long-running operations
   - Scraping history
   - Export functionality