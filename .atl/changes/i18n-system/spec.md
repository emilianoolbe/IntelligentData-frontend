# Frontend Localization Specification

## Purpose

Define the internationalization (i18n) system for the IntelligentData frontend, enabling Spanish as the default language with English support, runtime language switching, and persisted locale preference.

---

## Requirements

### Requirement: I18n Configuration

The system MUST initialize i18next with Spanish (`es`) as the default language and support English (`en`) as an alternative, using `react-i18next` for React integration.

#### Scenario: Default Language on First Visit

- GIVEN a new user with no stored language preference
- WHEN the application loads
- THEN the system MUST initialize with Spanish (`es`) as the active language
- AND all UI text MUST render in Spanish

#### Scenario: Persisted Language Preference

- GIVEN a returning user with a language preference stored in localStorage
- WHEN the application loads
- THEN the system MUST restore the user's persisted language preference
- AND all UI text MUST render in the persisted language

#### Scenario: Language Detection Fallback

- GIVEN a user with no stored preference and a browser language other than Spanish or English
- WHEN the application loads
- THEN the system MUST fall back to Spanish as the default language

---

### Requirement: Translation Resource Structure

The system MUST organize translation keys in a structured namespace hierarchy with separate JSON files for each locale.

#### Scenario: Namespace Organization

- GIVEN the translation resources directory
- WHEN translations are loaded
- THEN keys MUST be organized into namespaces: `common`, `auth`, `navigation`, `errors`
- AND each namespace MUST have corresponding `es.json` and `en.json` files

#### Scenario: Key Naming Convention

- GIVEN any translation key
- WHEN a developer adds a new key
- THEN the key MUST follow `camelCase` format
- AND the key MUST be semantically descriptive (e.g., `login.submitButton`, not `login.btn1`)
- AND nested paths MUST use dot notation for lookup (e.g., `auth.errors.emailRequired`)

#### Scenario: Fallback Key Resolution

- GIVEN a translation key that exists in Spanish but not in English
- WHEN the English locale is active
- THEN the system MUST fall back to the Spanish translation
- AND no placeholder or key name MUST be displayed to the user

---

### Requirement: Language Persistence

The system MUST persist the user's language preference in localStorage and restore it on subsequent visits.

#### Scenario: Persist Language Selection

- GIVEN a user viewing the application in any language
- WHEN the user switches the language via the language switcher
- THEN the selected language MUST be stored in localStorage with key `i18nextLng`
- AND the preference MUST persist across browser sessions

#### Scenario: Clear Preference on Logout (Optional)

- GIVEN a user who has set a language preference
- WHEN the user logs out
- THEN the language preference MAY remain persisted for convenience
- AND the next login MUST restore the previously selected language

---

### Requirement: Language Switcher Component

The Header MUST include a language switcher allowing users to toggle between Spanish and English.

#### Scenario: Display Language Options

- GIVEN the Header component is rendered
- WHEN the language switcher is visible
- THEN it MUST display the current language as the trigger text
- AND clicking the trigger MUST show available languages (Español, English)

#### Scenario: Switch Language

- GIVEN the language switcher dropdown is open
- WHEN the user selects a different language
- THEN the UI MUST immediately update to reflect the new language
- AND the selection MUST be persisted to localStorage
- AND the dropdown MUST close

#### Scenario: Keyboard Accessibility

- GIVEN the language switcher has focus
- WHEN the user presses `Enter` or `Space`
- THEN the dropdown MUST toggle open/closed
- AND arrow keys MUST navigate between language options

---

### Requirement: Auth Pages Translation

All hardcoded strings in LoginPage and RegisterPage MUST be migrated to translation keys.

#### Scenario: LoginPage Spanish Rendering

- GIVEN the application is set to Spanish
- WHEN the LoginPage renders
- THEN all text MUST match the Spanish translation values:
  | Element | Spanish Value |
  |---------|---------------|
  | Title | "Iniciar Sesión" |
  | Subtitle | "Ingresa tus credenciales para continuar" |
  | Email Label | "Correo Electrónico" |
  | Password Label | "Contraseña" |
  | Submit Button | "Iniciar Sesión" |
  | Register Link | "Regístrate" |
  | Register Prompt | "¿No tienes cuenta?" |

#### Scenario: RegisterPage English Rendering

- GIVEN the application is set to English
- WHEN the RegisterPage renders
- THEN all text MUST match the English translation values:
  | Element | English Value |
  |---------|---------------|
  | Title | "Create Account" |
  | Subtitle | "Sign up to get started" |
  | Username Label | "Username" |
  | Email Label | "Email" |
  | Password Label | "Password" |
  | Confirm Password Label | "Confirm Password" |
  | Submit Button | "Create Account" |
  | Login Link | "Log In" |
  | Login Prompt | "Already have an account?" |

#### Scenario: Validation Error Messages

- GIVEN any form validation failure on auth pages
- WHEN an error message is displayed
- THEN the error message MUST be translated according to the active language
- AND the following keys MUST exist:
  - `auth.errors.emailRequired`
  - `auth.errors.emailInvalid`
  - `auth.errors.passwordRequired`
  - `auth.errors.passwordMinLength`
  - `auth.errors.passwordMismatch`
  - `auth.errors.usernameRequired`
  - `auth.errors.loginFailed`

---

### Requirement: Navigation Translation

All navigation labels in Sidebar, MobileDrawer, and Header MUST use translation keys instead of hardcoded strings.

#### Scenario: Navigation Labels Spanish

- GIVEN the application is set to Spanish
- WHEN navigation items render
- THEN labels MUST match:
  | Navigation ID | Spanish Label |
  |---------------|---------------|
  | dashboard | "Dashboard" |
  | scraping | "Scraping" |
  | filters | "Filtros" |
  | charts | "Gráficos" |
  | settings | "Configuración" |

#### Scenario: Navigation Labels English

- GIVEN the application is set to English
- WHEN navigation items render
- THEN labels MUST match:
  | Navigation ID | English Label |
  |---------------|---------------|
  | dashboard | "Dashboard" |
  | scraping | "Scraping" |
  | filters | "Filters" |
  | charts | "Charts" |
  | settings | "Settings" |

#### Scenario: aria-label Accessibility

- GIVEN any interactive element with an aria-label
- WHEN the component renders
- THEN aria-label attributes MUST use the `t()` function for translation
- AND the following aria keys MUST exist:
  - `accessibility.openMenu`
  - `accessibility.closeMenu`
  - `accessibility.collapseSidebar`
  - `accessibility.expandSidebar`
  - `accessibility.switchToLightMode`
  - `accessibility.switchToDarkMode`
  - `accessibility.logout`

---

### Requirement: Footer Translation

The PrivateLayout footer MUST display the copyright notice in the active language.

#### Scenario: Footer Spanish

- GIVEN the application is set to Spanish
- WHEN the PrivateLayout footer renders
- THEN the footer MUST display "IntelligentData © {year}"

#### Scenario: Footer English

- GIVEN the application is set to English
- WHEN the PrivateLayout footer renders
- THEN the footer MUST display "IntelligentData © {year}"

---

### Requirement: App Bootstrap Integration

i18n initialization MUST occur before React application render to ensure translations are available on first paint.

#### Scenario: Import Order

- GIVEN the application entry point (`src/main.tsx`)
- WHEN the module loads
- THEN the i18n configuration MUST be imported and initialized before `createRoot`
- AND no translation calls MUST fail due to uninitialized i18n

#### Scenario: Missing Translation Key

- GIVEN a component using a translation key that does not exist
- WHEN the component renders
- THEN the system MUST log a warning in development mode
- AND the key name MUST be displayed as fallback text (not crash the app)

---

## Translation Key Catalog

### Namespace: `common`

| Key | Spanish | English |
|-----|---------|---------|
| `appName` | "IntelligentData" | "IntelligentData" |
| `footer.copyright` | "IntelligentData © {{year}}" | "IntelligentData © {{year}}" |

### Namespace: `auth`

| Key | Spanish | English |
|-----|---------|---------|
| `login.title` | "Iniciar Sesión" | "Log In" |
| `login.subtitle` | "Ingresa tus credenciales para continuar" | "Enter your credentials to continue" |
| `login.submit` | "Iniciar Sesión" | "Log In" |
| `login.noAccount` | "¿No tienes cuenta?" | "Don't have an account?" |
| `login.register` | "Regístrate" | "Sign Up" |
| `register.title` | "Crear Cuenta" | "Create Account" |
| `register.subtitle` | "Regístrate para comenzar" | "Sign up to get started" |
| `register.submit` | "Crear Cuenta" | "Create Account" |
| `register.hasAccount` | "¿Ya tienes cuenta?" | "Already have an account?" |
| `register.login` | "Inicia Sesión" | "Log In" |
| `fields.email` | "Correo Electrónico" | "Email" |
| `fields.password` | "Contraseña" | "Password" |
| `fields.username` | "Nombre de Usuario" | "Username" |
| `fields.confirmPassword` | "Confirmar Contraseña" | "Confirm Password" |
| `fields.passwordHint` | "Mínimo 8 caracteres" | "Minimum 8 characters" |
| `errors.emailRequired` | "El correo electrónico es requerido" | "Email is required" |
| `errors.emailInvalid` | "Ingresa un correo electrónico válido" | "Please enter a valid email" |
| `errors.passwordRequired` | "La contraseña es requerida" | "Password is required" |
| `errors.passwordMinLength` | "La contraseña debe tener al menos 8 caracteres" | "Password must be at least 8 characters" |
| `errors.passwordMismatch` | "Las contraseñas no coinciden" | "Passwords do not match" |
| `errors.usernameRequired` | "El nombre de usuario es requerido" | "Username is required" |
| `errors.loginFailed` | "Error al iniciar sesión" | "Login failed" |

### Namespace: `navigation`

| Key | Spanish | English |
|-----|---------|---------|
| `dashboard` | "Dashboard" | "Dashboard" |
| `scraping` | "Scraping" | "Scraping" |
| `filters` | "Filtros" | "Filters" |
| `charts` | "Gráficos" | "Charts" |
| `settings` | "Configuración" | "Settings" |

### Namespace: `accessibility`

| Key | Spanish | English |
|-----|---------|---------|
| `openMenu` | "Abrir menú" | "Open menu" |
| `closeMenu` | "Cerrar menú" | "Close menu" |
| `collapseSidebar` | "Colapsar sidebar" | "Collapse sidebar" |
| `expandSidebar` | "Expandir sidebar" | "Expand sidebar" |
| `switchToLightMode` | "Cambiar a modo claro" | "Switch to light mode" |
| `switchToDarkMode` | "Cambiar a modo oscuro" | "Switch to dark mode" |
| `logout` | "Cerrar sesión" | "Log out" |

---

## File Structure

```
src/i18n/
├── index.ts              # i18n configuration and initialization
├────
├── locales/
│   ├── es/
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── navigation.json
│   │   └── accessibility.json
│   └── en/
│       ├── common.json
│       ├── auth.json
│       ├── navigation.json
│       └── accessibility.json
```

---

## Implementation Notes

1. **Dependencies**: Add `i18next`, `react-i18next`, and `i18next-browser-languagedetector`
2. **Initialization**: Import and call i18n config in `src/main.tsx` before `createRoot`
3. **Hook Usage**: Use `useTranslation()` hook in components; inject `t` function via props for non-hook contexts
4. **Key Resolution**: Use dot notation (`t('auth.login.title')`) for nested keys
5. **Testing**: Mock i18n in Vitest tests; use `t` function spy assertions for key verification