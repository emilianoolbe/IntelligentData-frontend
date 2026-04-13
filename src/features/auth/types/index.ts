// ============================================
// Auth Types
// ============================================

export interface User {
  id: string
  email: string
  username: string
  first_name?: string
  last_name?: string
}

export interface Tokens {
  access: string
  refresh: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  password_confirm: string
}

export interface AuthState {
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthSlice {
  auth: AuthState
}