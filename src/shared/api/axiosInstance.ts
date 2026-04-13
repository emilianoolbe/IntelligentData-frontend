import axios from 'axios'

// Get API URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor types
export interface QueueItem {
  resolve: (token: string) => void
  reject: (error: Error) => void
}

// Export for testing
export let isRefreshing = false
export let failedQueue: QueueItem[] = []

export const setRefreshing = (value: boolean) => {
  isRefreshing = value
}

export const setFailedQueue = (queue: QueueItem[]) => {
  failedQueue = queue
}

// Request interceptor - attach access token
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth')
    if (authStorage) {
      try {
        const { tokens } = JSON.parse(authStorage)
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`
        }
      } catch {
        // Invalid stored auth, ignore
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Get refresh token from storage
      const authStorage = localStorage.getItem('auth')
      if (!authStorage) {
        throw new Error('No auth storage')
      }

      const { tokens } = JSON.parse(authStorage)
      if (!tokens?.refresh) {
        throw new Error('No refresh token')
      }

      // Request new access token
      const response = await axios.post(`${API_URL}/auth/refresh/`, {
        refresh: tokens.refresh,
      })

      const { access, refresh } = response.data

      // Update stored tokens
      const updatedAuth = {
        ...JSON.parse(authStorage),
        tokens: { access, refresh },
      }
      localStorage.setItem('auth', JSON.stringify(updatedAuth))

      // Process queued requests
      failedQueue.forEach(({ resolve }) => resolve(access))
      failedQueue = []

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${access}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      // Refresh failed - clear auth and redirect to login
      localStorage.removeItem('auth')
      failedQueue.forEach(({ reject }) => reject(refreshError as Error))
      failedQueue = []
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient