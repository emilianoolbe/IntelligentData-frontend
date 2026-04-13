import { describe, it, expect, beforeEach } from 'vitest'
import { authSlice, setCredentials, setUser, clearError } from '../authSlice'
import type { AuthState, User, Tokens } from '../types'

describe('authSlice', () => {
  let initialState: AuthState

  beforeEach(() => {
    initialState = {
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }
  })

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = authSlice.reducer(undefined, { type: 'unknown' })
      expect(state).toEqual(initialState)
    })
  })

  describe('setCredentials', () => {
    it('should set credentials and mark as authenticated', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      }
      const tokens: Tokens = {
        access: 'access-token',
        refresh: 'refresh-token',
      }

      const state = authSlice.reducer(initialState, setCredentials({ user, tokens }))

      expect(state.user).toEqual(user)
      expect(state.tokens).toEqual(tokens)
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBeNull()
    })
  })

  describe('setUser', () => {
    it('should update user', () => {
      const user: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
      }

      const state = authSlice.reducer(initialState, setUser(user))

      expect(state.user).toEqual(user)
    })
  })

  describe('clearError', () => {
    it('should clear error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error message',
      }

      const state = authSlice.reducer(stateWithError, clearError())

      expect(state.error).toBeNull()
    })
  })
})