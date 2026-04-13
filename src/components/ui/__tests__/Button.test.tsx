import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should render as primary variant by default', () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole('button')
      
      // Primary variant has accent background
      expect(button).toHaveClass('bg-accent')
      expect(button).toHaveClass('text-white')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('bg-secondary')
      expect(button).toHaveClass('border')
    })

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('bg-transparent')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('bg-transparent')
    })

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('bg-error')
    })
  })

  describe('Sizes', () => {
    it('should render medium size by default', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('px-4')
    })

    it('should render small size', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('h-8')
      expect(button).toHaveClass('px-3')
      expect(button).toHaveClass('text-sm')
    })

    it('should render large size', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('h-12')
      expect(button).toHaveClass('px-6')
      expect(button).toHaveClass('text-lg')
    })

    it('should render icon size', () => {
      render(<Button size="icon">Icon</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('h-10')
      expect(button).toHaveClass('w-10')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should be disabled when isLoading is true', () => {
      render(<Button isLoading>Loading</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('should show loading spinner when isLoading', () => {
      render(<Button isLoading>Loading</Button>)
      
      // Spinner is present
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
      
      // Screen reader text
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have focus-visible styles', () => {
      render(<Button>Focus</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('focus-visible:outline-none')
      expect(button).toHaveClass('focus-visible:ring-2')
    })
  })

  describe('Custom className', () => {
    it('should merge custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('bg-accent') // Still has default classes
    })
  })
})