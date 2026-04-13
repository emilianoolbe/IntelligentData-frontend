import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState, AppDispatch } from '@/app/store'
import { loginUser, logoutUser, clearError } from '@/features/auth/authSlice'
import type { LoginCredentials } from '@/features/auth/types'

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  
  // Selectors
  const user = useSelector((state: RootState) => state.auth.user)
  const tokens = useSelector((state: RootState) => state.auth.tokens)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const isLoading = useSelector((state: RootState) => state.auth.isLoading)
  const error = useSelector((state: RootState) => state.auth.error)

  // Actions
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginUser(credentials))
      if (loginUser.fulfilled.match(result)) {
        navigate('/dashboard')
        return { success: true }
      }
      return { success: false, error: result.payload as string }
    },
    [dispatch, navigate]
  )

  const logout = useCallback(async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }, [dispatch, navigate])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    // State
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    // Actions
    login,
    logout,
    clearAuthError,
  }
}