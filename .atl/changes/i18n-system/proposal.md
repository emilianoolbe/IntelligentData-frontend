# Proposal: I18n System

## Intent

Implement a frontend internationalization foundation so the app can keep Spanish as the default UX while supporting English, avoiding scattered hardcoded strings and enabling consistent locale switching.

## Scope

### In Scope
- Add `i18next`, `react-i18next`, and browser language detection/persistence wiring with Spanish default and localStorage-backed preference.
- Introduce translation resources for `es` and `en`, plus a thin app wrapper/hook for typed, centralized usage.
- Replace hardcoded UI copy in auth, navigation, header, mobile drawer, and footer; add a header language switcher.
- Add Vitest coverage for locale initialization, persistence, and translated rendering; keep `build` green.

### Out of Scope
- Backend/API message localization.
- Route/path localization, date/number formatting, or CMS-driven translations.

## Capabilities

### New Capabilities
- `frontend-localization`: Centralized translation resources, runtime language switching, and persisted locale selection for shared UI text.

### Modified Capabilities
- None.

## Approach

Create a dedicated `src/i18n` setup loaded from app bootstrap, define namespace-based `es`/`en` resources, and store navigation labels as translation keys instead of literal text. Use `react-i18next` in UI components and keep Spanish fallback/default to preserve current behavior.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add i18n runtime dependencies |
| `src/main.tsx` | Modified | Initialize i18n before app render |
| `src/i18n/**` | New | Config, resources, optional wrapper hook/constants |
| `src/config/navigation.ts` | Modified | Replace labels with translation keys |
| `src/features/auth/pages/*.tsx` | Modified | Translate auth copy and validation strings |
| `src/components/navigation/*.tsx` | Modified | Translate labels, aria text, and language switcher |
| `src/layouts/PrivateLayout.tsx` | Modified | Translate footer copy |
| `src/**/*test*.tsx` | Modified/New | Add i18n-aware tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Missing keys cause mixed-language UI | Med | Centralize keys, add fallback language, cover key screens in tests |
| Tests become brittle with translated text | Med | Add shared i18n test render helpers and assert by locale-specific expectations |
| Navigation/config coupling leaks raw strings | Low | Store stable ids/keys in config, resolve labels at render time |

## Rollback Plan

Remove i18n bootstrap/dependencies, restore literal labels in affected components/config, and drop the language preference key/tests.

## Dependencies

- `i18next`
- `react-i18next`
- `i18next-browser-languagedetector` (or equivalent localStorage-aware browser detector)

## Success Criteria

- [ ] Spanish remains the default language on first load.
- [ ] Users can switch between Spanish and English from the header and the choice persists across reloads.
- [ ] Listed pages/components render translated copy from resource files, not hardcoded literals.
- [ ] Vitest coverage validates initialization, switching, and persisted preference.
- [ ] `pnpm build` completes successfully after the implementation.
