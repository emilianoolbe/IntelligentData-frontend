/// <reference types="vitest" />
import '@testing-library/jest-dom'
import { vi, beforeEach, afterEach } from 'vitest'

// Mock localStorage for tests
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Clean up DOM after each test
afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.classList.remove('dark', 'light')
})