# Tasks: I18n System

## Phase 1: Setup & Dependencies

- [ ] 1.1 Add `i18next`, `react-i18next`, `i18next-browser-languagedetector` to `package.json`
- [ ] 1.2 Create `src/i18n/index.ts` with i18next initialization, LanguageDetector, resources import, and `fallbackLng: 'es'` config
- [ ] 1.3 Add `import '@/i18n'` to `src/main.tsx` **before** `createRoot` call
- [ ] 1.4 Update `src/config/types.ts` — change `NavItem.label` to `NavItem.translationKey: string`
- [ ] 1.5 Create `src/test/i18n-test-utils.tsx` with `createI18nTestWrapper(locale)` function

## Phase 2: Translation Resources

- [ ] 2.1 Create `src/i18n/locales/es/common.json` with `appName`, `footer.copyright` keys
- [ ] 2.2 Create `src/i18n/locales/en/common.json` with English translations for common namespace
- [ ] 2.3 Create `src/i18n/locales/es/auth.json` with login, register, fields, errors keys per spec
- [ ] 2.4 Create `src/i18n/locales/en/auth.json` with English translations for auth namespace
- [ ] 2.5 Create `src/i18n/locales/es/navigation.json` with dashboard, scraping, filters, charts, settings keys
- [ ] 2.6 Create `src/i18n/locales/en/navigation.json` with English translations for navigation namespace
- [ ] 2.7 Create `src/i18n/locales/es/accessibility.json` with openMenu, closeMenu, collapseSidebar, etc.
- [ ] 2.8 Create `src/i18n/locales/en/accessibility.json` with English translations for accessibility namespace

## Phase 3: Navigation Infrastructure

- [ ] 3.1 Update `src/config/navigation.ts` — replace all `label` strings with `translationKey` references (e.g., `'navigation.dashboard'`)

## Phase 4: LanguageSwitcher Component

- [ ] 4.1 Create `src/components/navigation/LanguageSwitcher.tsx` with dropdown, `useTranslation()`, keyboard accessibility (Enter/Space/Arrow keys)
- [ ] 4.2 Create `src/components/navigation/__tests__/LanguageSwitcher.test.tsx` — test dropdown open/close, language switch calls `i18n.changeLanguage()`, keyboard nav

## Phase 5: Navigation Components

- [ ] 5.1 Update `src/components/navigation/Sidebar.tsx` — replace hardcoded labels with `t(item.translationKey)` calls
- [ ] 5.2 Update `src/components/navigation/MobileDrawer.tsx` — replace hardcoded labels with `t(item.translationKey)` calls
- [ ] 5.3 Update `src/components/navigation/Sidebar.test.tsx` — wrap with `createI18nTestWrapper`, verify Spanish labels
- [ ] 5.4 Update `src/components/navigation/MobileDrawer.test.tsx` — wrap with `createI18nTestWrapper`, verify English labels

## Phase 6: Header Integration

- [ ] 6.1 Update `src/components/navigation/Header.tsx` — import and render `LanguageSwitcher` component
- [ ] 6.2 Update `src/components/navigation/__tests__/Header.test.tsx` — add i18n tests for language switcher presence

## Phase 7: Auth Pages

- [ ] 7.1 Update `src/features/auth/pages/LoginPage.tsx` — replace all hardcoded strings with `t()` calls (title, subtitle, labels, buttons, links, error messages)
- [ ] 7.2 Update `src/features/auth/pages/RegisterPage.tsx` — replace all hardcoded strings with `t()` calls (title, subtitle, labels, buttons, links, error messages)
- [ ] 7.3 Create/update `src/features/auth/pages/__tests__/LoginPage.test.tsx` — test Spanish default and English rendering
- [ ] 7.4 Create/update `src/features/auth/pages/__tests__/RegisterPage.test.tsx` — test both locales render correct translations

## Phase 8: Footer

- [ ] 8.1 Update `src/layouts/PrivateLayout.tsx` — replace footer copyright with `t('common.footer.copyright', { year })` using interpolation

## Phase 9: Testing & Verification

- [ ] 9.1 Update `src/test/setup.ts` — add i18n mock initialization for Vitest
- [ ] 9.2 Run `pnpm build` to verify no TypeScript errors and build succeeds
- [ ] 9.3 Verify Spanish default on first load (no localStorage preference)
- [ ] 9.4 Verify language switch persists to `localStorage` key `i18nextLng`
- [ ] 9.5 Verify switching to English updates all UI components immediately

## Acceptance Criteria Summary

| Task | Criterion |
|------|-----------|
| 1.1 | `pnpm install` completes without errors |
| 1.2 | i18n initializes with `fallbackLng: 'es'` |
| 1.3 | Translations available on first paint |
| 1.4 | `NavItem` interface updated in types |
| 1.5 | Test wrapper wraps components with `I18nextProvider` |
| 2.1-2.8 | All 8 JSON files exist with keys per spec catalog |
| 3.1 | Navigation config uses translation keys, not hardcoded labels |
| 4.1 | LanguageSwitcher dropdown opens/closes, switches language |
| 5.1-5.4 | Sidebar/MobileDrawer translate in both locales |
| 6.1-6.2 | Header displays LanguageSwitcher, i18n tests pass |
| 7.1-7.4 | Auth pages render correct translations per spec tables |
| 8.1 | Footer displays translated copyright with year interpolation |
| 9.2 | `pnpm build` completes successfully |
| 9.3-9.5 | Language detection, persistence, and switching work end-to-end |
