import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Initialize i18n for tests with Spanish as default
export function initTestI18n(language: 'es' | 'en' = 'es') {
  return i18n.use(initReactI18next).init({
    resources: {
      es: {
        common: {
          appName: 'IntelligentData',
          footer: {
            copyright: 'IntelligentData © {{year}}',
          },
          language: {
            switchTo: 'Cambiar idioma',
            current: 'Idioma actual',
          },
        },
        auth: {
          login: {
            title: 'Iniciar Sesión',
            subtitle: 'Ingresa tus credenciales para continuar',
            email: 'Correo electrónico',
            emailPlaceholder: 'tu@email.com',
            password: 'Contraseña',
            passwordPlaceholder: '••••••••',
            rememberMe: 'Recordarme',
            forgotPassword: '¿Olvidaste tu contraseña?',
            noAccount: '¿No tienes cuenta?',
            register: 'Registrarse',
            submit: 'Entrar',
            errors: {
              invalidCredentials: 'Credenciales inválidas',
              emailRequired: 'El correo es requerido',
              emailInvalid: 'El correo no es válido',
              passwordRequired: 'La contraseña es requerida',
              passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
            },
          },
          register: {
            title: 'Crear Cuenta',
            subtitle: 'Regístrate para comenzar',
            username: 'Nombre de usuario',
            usernamePlaceholder: 'tu_usuario',
            email: 'Correo electrónico',
            emailPlaceholder: 'tu@email.com',
            password: 'Contraseña',
            passwordPlaceholder: '••••••••',
            passwordHelper: 'Mínimo 8 caracteres',
            confirmPassword: 'Confirmar contraseña',
            confirmPasswordPlaceholder: '••••••••',
            acceptTerms: 'Acepto los términos y condiciones',
            haveAccount: '¿Ya tienes cuenta?',
            login: 'Iniciar Sesión',
            submit: 'Crear cuenta',
            errors: {
              usernameRequired: 'El nombre de usuario es requerido',
              usernameMinLength: 'El nombre de usuario debe tener al menos 3 caracteres',
              emailRequired: 'El correo es requerido',
              emailInvalid: 'El correo no es válido',
              passwordRequired: 'La contraseña es requerida',
              passwordMinLength: 'La contraseña debe tener al menos 8 caracteres',
              passwordMismatch: 'Las contraseñas no coinciden',
              termsRequired: 'Debes aceptar los términos y condiciones',
              emailExists: 'El correo ya está registrado',
              notAvailable: 'El registro aún no está disponible',
            },
          },
          logout: 'Cerrar sesión',
        },
        navigation: {
          dashboard: 'Dashboard',
          scraping: 'Scraping',
          filters: 'Filtros',
          charts: 'Gráficos',
          settings: 'Configuración',
          profile: 'Perfil',
          notifications: 'Notificaciones',
        },
        accessibility: {
          theme: {
            switchToLight: 'Cambiar a modo claro',
            switchToDark: 'Cambiar a modo oscuro',
          },
          navigation: {
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
            collapseSidebar: 'Colapsar sidebar',
            expandSidebar: 'Expandir sidebar',
          },
          language: {
            switchLanguage: 'Cambiar idioma',
          },
        },
      },
      en: {
        common: {
          appName: 'IntelligentData',
          footer: {
            copyright: 'IntelligentData © {{year}}',
          },
          language: {
            switchTo: 'Switch language',
            current: 'Current language',
          },
        },
        auth: {
          login: {
            title: 'Sign In',
            subtitle: 'Enter your credentials to continue',
            email: 'Email',
            emailPlaceholder: 'your@email.com',
            password: 'Password',
            passwordPlaceholder: '••••••••',
            rememberMe: 'Remember me',
            forgotPassword: 'Forgot your password?',
            noAccount: "Don't have an account?",
            register: 'Sign Up',
            submit: 'Sign In',
            errors: {
              invalidCredentials: 'Invalid credentials',
              emailRequired: 'Email is required',
              emailInvalid: 'Invalid email format',
              passwordRequired: 'Password is required',
              passwordMinLength: 'Password must be at least 6 characters',
            },
          },
          register: {
            title: 'Create Account',
            subtitle: 'Sign up to get started',
            username: 'Username',
            usernamePlaceholder: 'your_username',
            email: 'Email',
            emailPlaceholder: 'your@email.com',
            password: 'Password',
            passwordPlaceholder: '••••••••',
            passwordHelper: 'Minimum 8 characters',
            confirmPassword: 'Confirm password',
            confirmPasswordPlaceholder: '••••••••',
            acceptTerms: 'I accept the terms and conditions',
            haveAccount: 'Already have an account?',
            login: 'Sign In',
            submit: 'Create Account',
            errors: {
              usernameRequired: 'Username is required',
              usernameMinLength: 'Username must be at least 3 characters',
              emailRequired: 'Email is required',
              emailInvalid: 'Invalid email format',
              passwordRequired: 'Password is required',
              passwordMinLength: 'Password must be at least 8 characters',
              passwordMismatch: 'Passwords do not match',
              termsRequired: 'You must accept the terms and conditions',
              emailExists: 'Email already registered',
              notAvailable: 'Registration is not available yet',
            },
          },
          logout: 'Sign Out',
        },
        navigation: {
          dashboard: 'Dashboard',
          scraping: 'Scraping',
          filters: 'Filters',
          charts: 'Charts',
          settings: 'Settings',
          profile: 'Profile',
          notifications: 'Notifications',
        },
        accessibility: {
          theme: {
            switchToLight: 'Switch to light mode',
            switchToDark: 'Switch to dark mode',
          },
          navigation: {
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            collapseSidebar: 'Collapse sidebar',
            expandSidebar: 'Expand sidebar',
          },
          language: {
            switchLanguage: 'Switch language',
          },
        },
      },
    },
    defaultNS: 'common',
    fallbackLng: 'es',
    lng: language,
    interpolation: {
      escapeValue: false,
    },
  })
}

// Re-export render for convenience
export { render } from '@testing-library/react'