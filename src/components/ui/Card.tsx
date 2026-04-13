import type { ReactNode, HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card header content */
  header?: ReactNode
  /** Card footer content */
  footer?: ReactNode
  /** Whether to apply hover effect */
  hoverable?: boolean
}

/**
 * Card Component
 * 
 * A container component for grouping related content.
 * Supports optional header and footer slots.
 * 
 * @example
 * // Basic card
 * <Card>
 *   <p>Card content</p>
 * </Card>
 * 
 * @example
 * // Card with header and footer
 * <Card 
 *   header={<h3>Card Title</h3>}
 *   footer={<Button>Action</Button>}
 * >
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * @example
 * // Hoverable card
 * <Card hoverable onClick={handleClick}>
 *   Clickable card
 * </Card>
 */
export function Card({
  children,
  header,
  footer,
  hoverable = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-xl border border-border bg-elevated',
        // Shadow
        'shadow-sm',
        // Transition
        'transition-all duration-200',
        // Hover state
        hoverable && 'hover:shadow-md hover:border-border-hover hover:cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Header */}
      {header && (
        <div className="border-b border-border px-6 py-4">
          {header}
        </div>
      )}
      
      {/* Body */}
      <div className="px-6 py-4">
        {children}
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="border-t border-border px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  )
}

Card.displayName = 'Card'