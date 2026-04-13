# Design: I18n System

## Technical Approach

Implement a centralized i18n module using `i18next` + `react-i18next` with browser language detection. The system will mirror the existing ThemeProvider pattern for consistency—initializing before app render, persisting to localStorage, and providing a hook-based API. Navigation labels will be stored as translation keys in config, resolved at render time via `t()`.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| i18n Library | i18next + react-i18next | react-intl, lingui | Mature ecosystem, excellent TypeScript support, browser detection plugin, aligns with spec requirements |
| Persistence | localStorage (i18nextLng) | Cookies, sessionStorage | Consistent with ThemeProvider pattern; i18next-browser-languagedetector handles this natively |
| Translation Structure | Namespace-per-domain JSON | Single large file | Better organization, lazy loading potential, matches spec's 4 namespaces (common, auth, navigation, accessibility) |
| Key Resolution | Runtime via `t()` in components | Build-time extraction | Simpler setup, no extra build tooling, adequate for current scope |
| Default Language | Spanish (`es`) | English, browser-detected | Preserves current UX; spec requires Spanish default |
| Navigation Config | Keep `id`, resolve `label` via key | Store full translations | Maintains stable IDs for routes; labels become dynamic |
| Test Mocking | Wrapper with I18nextProvider | Global mock | Matches existing test patterns; allows per-test locale control |

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  main.tsx                                                       │
│  └── import '@/i18n' (initializes before createRoot)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  i18n/index.ts                                                  │
│  ├── i18next.use(initReactI18next)                              │
│  ├── .use(LanguageDetector) → reads localStorage                 │
│  ├── .init({ fallbackLng: 'es', resources })                    │
│  └── export i18n instance                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Components                                                     │
│  ├── useTranslation('namespace') → t('key')                     │
│  ├── LanguageSwitcher → i18n.changeLanguage('en')               │
│  └── Navigation → t(navItem.translationKey)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  localStorage                                                   │
│  └── i18nextLng = 'es' | 'en' (auto-persisted by detector)      │
└─────────────────────────────────────────────────────────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add `i18next`, `react-i18next`, `i18next-browser-languagedetector` dependencies |
| `src/main.tsx` | Modify | Add `import '@/i18n'` before AppProviders import |
| `src/i18n/index.ts` | Create | i18next initialization with detector, resources, config |
| `src/i18n/locales/es/common.json` | Create | Spanish common translations |
| `src/i18n/locales/es/auth.json` | Create | Spanish auth translations |
| `src/i18n/locales/es/navigation.json` | Create | Spanish navigation translations |
| `src/i18n/locales/es/accessibility.json` | Create | Spanish accessibility translations |
| `src/i18n/locales/en/common.json` | Create | English common translations |
| `src/i18n/locales/en/auth.json` | Create | English auth translations |
| `src/i18n/locales/en/navigation.json` | Create | English navigation translations |
| `src/i18n/locales/en/accessibility.json` | Create | English accessibility translations |
| `src/config/navigation.ts` | Modify | Replace `label` strings with `translationKey` references |
| `src/config/types.ts` | Modify | Update `NavItem` interface: `translationKey: string` instead of `label: string` |
| `src/components/navigation/LanguageSwitcher.tsx` | Create | Dropdown component for language selection |
| `src/components/navigation/Header.tsx` | Modify | Import and render LanguageSwitcher component |
| `src/components/navigation/Sidebar.tsx` | Modify | Use `t(item.translationKey)` instead of `item.label` |
| `src/components/navigation/MobileDrawer.tsx` | Modify | Use `t(item.translationKey)` instead of `item.label` |
| `src/features/auth/pages/LoginPage.tsx` | Modify | Replace all hardcoded strings with `t()` calls |
| `src/features/auth/pages/RegisterPage.tsx` | Modify | Replace all hardcoded strings with `t()` calls |
| `src/layouts/PrivateLayout.tsx` | Modify | Translate footer using `t('common.footer.copyright')` |
| `src/test/setup.ts` | Modify | Add i18n mock or initialize for tests |
| `src/test/i18n-test-utils.tsx` | Create | Test wrapper with I18nextProvider and locale switching helpers |

## Interfaces / Contracts

### I18n Configuration (`src/i18n/index.ts`)

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import esCommon from './locales/es/common.json'
import esAuth from './locales/es/auth.json'
import esNavigation from './locales/es/navigation.json'
import esAccessibility from './locales/es/accessibility.json'

import enCommon from './locales/en/common.json'
import enAuth from './locales/en/auth.json'
import enNavigation from './locales/en/navigation.json'
import enAccessibility from './locales/en/accessibility.json'

export const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    navigation: esNavigation,
    accessibility: esAccessibility,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    navigation: enNavigation,
    accessibility: enAccessibility,
  },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

export default i18n
```

### Updated NavItem Interface (`src/config/types.ts`)

```typescript
export interface NavItem {
  id: string
  translationKey: string  // Changed from 'label: string'
  path: string
  icon?: string
  badge?: number
  children?: NavItem[]
}
```

### LanguageSwitcher Component Interface

```typescript
interface LanguageSwitcherProps {
  className?: string
}

// Component uses useTranslation() hook internally
// Calls i18n.changeLanguage() on selection
```

### Test Utilities (`src/test/i18n-test-utils.tsx`)

```typescript
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

export function createI18nTestWrapper(locale: 'es' | 'en' = 'es') {
  // Clone i18n instance and set language
  const testI18n = i18n.cloneInstance()
  testI18n.changeLanguage(locale)
  
  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <I18nextProvider i18n={testI18n}>
        {children}
      </I18nextProvider>
    )
  }
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | i18n initialization | Test that i18n instance initializes with correct default language and resources |
| Unit | Language detection | Mock localStorage to verify persistence and restoration of language preference |
| Unit | LanguageSwitcher | Test dropdown opens/closes, selecting language calls changeLanguage, keyboard navigation works |
| Integration | Navigation rendering | Render Sidebar/MobileDrawer with test wrapper, verify labels translate correctly in both languages |
| Integration | Auth pages | Test LoginPage and RegisterPage render correct translations for each locale |
| Integration | Footer translation | Verify PrivateLayout footer displays translated copyright |
| E2E | Full user flow | (If applicable) Test switching language updates all UI text immediately |

### Test Pattern Example

```typescript
// src/components/navigation/__tests__/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { createI18nTestWrapper } from '@/test/i18n-test-utils'
import { Header } from '../Header'

describe('Header i18n', () => {
  it('should render language switcher with current language', () => {
    const TestWrapper = createI18nTestWrapper('es')
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )
    
    expect(screen.getByText('Español')).toBeInTheDocument()
  })
  
  it('should switch language when selecting English', () => {
    const TestWrapper = createI18nTestWrapper('es')
    render(
      <TestWrapper>
        <Header />
      </TestWrapper>
    )
    
    fireEvent.click(screen.getByText('Español'))
    fireEvent.click(screen.getByText('English'))
    
    expect(screen.getByText('English')).toBeInTheDocument()
  })
})
```

## Migration / Rollout

1. **Phase 1**: Add i18n dependencies and initialization (no UI changes)
   - Add packages, create i18n module, verify build passes
2. **Phase 2**: Create LanguageSwitcher component (not yet integrated)
   - Build and test in isolation
3. **Phase 3**: Refactor navigation config and components
   - Update types, config, Sidebar, MobileDrawer
4. **Phase 4**: Translate auth pages
   - LoginPage, RegisterPage
5. **Phase 5**: Integrate LanguageSwitcher into Header
   - Add to Header, verify persistence works
6. **Phase 6**: Add tests and verify coverage
   - Update existing tests with i18n wrappers

**Rollback**: Remove i18n import from main.tsx, revert components to hardcoded labels, remove packages.

## Open Questions

- [ ] Should we add interpolation for dynamic values (e.g., `{{year}}` in footer) or keep static strings?
- [ ] Do we want to support language detection from browser settings beyond Spanish/English fallback?
- [ ] Should missing translations show the key or Spanish fallback in development mode?

## File Structure Diagram

```
src/
├── i18n/
│   ├── index.ts                    # i18next initialization
│   └── locales/
│       ├── es/
│       │   ├── common.json         # appName, footer.copyright
│       │   ├── auth.json           # login.*, register.*, fields.*, errors.*
│       │   ├── navigation.json     # dashboard, scraping, filters, charts, settings
│       │   └── accessibility.json  # openMenu, closeMenu, etc.
│       └── en/
│           ├── common.json
│           ├── auth.json
│           ├── navigation.json
│           └── accessibility.json
├── components/
│   └── navigation/
│       ├── Header.tsx              # + LanguageSwitcher integration
│       ├── LanguageSwitcher.tsx    # NEW: Language dropdown
│       ├── Sidebar.tsx             # MODIFIED: Use translation keys
│       ├── MobileDrawer.tsx        # MODIFIED: Use translation keys
│       └── __tests__/
│           ├── Header.test.tsx     # MODIFIED: Add i18n wrapper
│           ├── LanguageSwitcher.test.tsx  # NEW
│           ├── Sidebar.test.tsx    # MODIFIED: Add i18n wrapper
│           └── MobileDrawer.test.tsx      # MODIFIED: Add i18n wrapper
├── config/
│   ├── navigation.ts               # MODIFIED: translationKey instead of label
│   └── types.ts                    # MODIFIED: NavItem interface
├── features/
│   └── auth/
│       └── pages/
│           ├── LoginPage.tsx       # MODIFIED: Use t() for all text
│           ├── RegisterPage.tsx    # MODIFIED: Use t() for all text
│           └── __tests__/          # NEW/Modified: Add i18n tests
├── layouts/
│   ├── PrivateLayout.tsx           # MODIFIED: Translate footer
│   └── __tests__/
│       └── PrivateLayout.test.tsx  # MODIFIED: Add i18n wrapper
├── test/
│   ├── setup.ts                    # MODIFIED: Add i18n setup
│   └── i18n-test-utils.tsx         # NEW: Test helpers
├── main.tsx                        # MODIFIED: Import i18n before app
└── package.json                    # MODIFIED: Add i18n deps
```
