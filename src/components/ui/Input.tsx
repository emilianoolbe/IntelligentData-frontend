import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error message to display below input */
  error?: string
  /** Helper text shown below input (superseded by error) */
  helperText?: string
  /** Label for the input */
  label?: string
  /** Whether the input takes full width */
  fullWidth?: boolean
}

/**
 * Input Component
 * 
 * A styled input component with support for labels, error states,
 * and helper text.
 * 
 * @example
 * // Basic input
 * <Input placeholder="Enter your email" />
 * 
 * @example
 * // Input with label and error
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   error="Invalid email address" 
 * />
 * 
 * @example
 * // Full width input
 * <Input fullWidth placeholder="Search..." />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    error, 
    helperText, 
    label, 
    id,
    fullWidth = false,
    'aria-describedby': ariaDescribedBy,
    ...props 
  }, ref) => {
    const inputId = id || props.name
    
    // Generate description ID for accessibility
    const descriptionId = error 
      ? `${inputId}-error` 
      : helperText 
        ? `${inputId}-helper` 
        : undefined
    
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-sm font-medium text-primary"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            // Base styles
            'flex h-10 w-full rounded-lg border bg-transparent px-3 py-2',
            'text-base text-primary placeholder:text-muted',
            'transition-all duration-200',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'focus:border-accent focus:ring-accent/20',
            // Border styles
            'border-border hover:border-border-hover',
            // Error state
            error && 'border-error focus:border-error focus:ring-error/20',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy || descriptionId}
          {...props}
        />
        {/* Error message takes priority over helper text */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p 
            id={`${inputId}-helper`}
            className="text-sm text-muted"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'