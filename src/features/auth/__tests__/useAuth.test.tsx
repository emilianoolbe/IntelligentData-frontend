/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { BrowserRouter } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authSlice } from '../authSlice'
import type { AuthSlice } from '../types'

// Create a test wrapper
function createTestWrapper(preloadedState?: Partial<AuthSlice>) {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: preloadedState as AuthSlice,
  })

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }
}

// Test component that uses useAuth
function TestComponent() {
  const { user, isAuthenticated, isLoading, error } = useAuth()
  return (
    <div>
      <span data-testid="is-authenticated">{isAuthenticated.toString()}</span>
      <span data-testid="is-loading">{isLoading.toString()}</span>
      <span data-testid="user">{user?.username || 'null'}</span>
      <span data-testid="error">{error || 'null'}</span>
    </div>
  )
}

describe('useAuth', () => {
  describe('initial state', () => {
    it('should return default auth state', () => {
      const TestWrapper = createTestWrapper()
      
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('is-authenticated').textContent).toBe('false')
      expect(screen.getByTestId('is-loading').textContent).toBe('false')
      expect(screen.getByTestId('user').textContent).toBe('null')
      expect(screen.getByTestId('error').textContent).toBe('null')
    })
  })

  describe('authenticated state', () => {
    it('should return authenticated state', () => {
      const TestWrapper = createTestWrapper({
        auth: {
          user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser',
          },
          tokens: {
            access: 'access-token',
            refresh: 'refresh-token',
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      })

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('is-authenticated').textContent).toBe('true')
      expect(screen.getByTestId('user').textContent).toBe('testuser')
    })
  })

  describe('loading state', () => {
    it('should return loading state', () => {
      const TestWrapper = createTestWrapper({
        auth: {
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: true,
          error: null,
        },
      })

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('is-loading').textContent).toBe('true')
    })
  })

  describe('error state', () => {
    it('should return error state', () => {
      const TestWrapper = createTestWrapper({
        auth: {
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid credentials',
        },
      })

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )

      expect(screen.getByTestId('error').textContent).toBe('Invalid credentials')
    })
  })
})