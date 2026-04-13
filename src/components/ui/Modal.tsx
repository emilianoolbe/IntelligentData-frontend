import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/utils'

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Modal title */
  title?: string
  /** Modal description (for accessibility) */
  description?: string
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Whether to show close button */
  showClose?: boolean
  /** Whether clicking backdrop closes modal */
  closeOnBackdrop?: boolean
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean
  /** Modal content */
  children: ReactNode
}

/**
 * Modal Component
 * 
 * A focus-trapped modal dialog with backdrop and keyboard accessibility.
 * 
 * @example
 * // Basic modal
 * <Modal open={isOpen} onClose={() => setIsOpen(false)}>
 *   <p>Modal content</p>
 * </Modal>
 * 
 * @example
 * // Modal with title and size
 * <Modal 
 *   open={isOpen} 
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="sm"
 * >
 *   <p>Are you sure?</p>
 * </Modal>
 * 
 * @example
 * // Controlled modal behavior
 * <Modal 
 *   open={isOpen} 
 *   onClose={handleClose}
 *   closeOnBackdrop={false}
 *   closeOnEscape={false}
 * >
 *   <form>...</form>
 * </Modal>
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  children,
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<Element | null>(null)

  // Handle Escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, closeOnEscape, onClose])

  // Focus trap
  useEffect(() => {
    if (!open) return

    // Store previous active element
    previousActiveElement.current = document.activeElement

    // Focus the modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    // Focus first element or modal itself
    if (firstElement) {
      firstElement.focus()
    } else {
      modalRef.current?.focus()
    }

    // Trap focus within modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab: go to last element if on first
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: go to first element if on last
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      // Restore focus
      ;(previousActiveElement.current as HTMLElement)?.focus?.()
    }
  }, [open])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[90vw]',
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-50 w-full rounded-xl border border-border bg-elevated p-6 shadow-xl',
          'animate-in fade-in-0 zoom-in-95',
          sizeClasses[size],
          className
        )}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="mb-4 flex items-center justify-between">
            {title && (
              <h2 
                id="modal-title" 
                className="text-lg font-semibold text-primary"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  'text-muted hover:text-primary hover:bg-secondary',
                  'focus:outline-none focus:ring-2 focus:ring-accent'
                )}
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p 
            id="modal-description" 
            className="mb-4 text-sm text-muted"
          >
            {description}
          </p>
        )}

        {/* Content */}
        {children}
      </div>
    </div>,
    document.body
  )
}

Modal.displayName = 'Modal'