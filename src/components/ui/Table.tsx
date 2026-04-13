import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

// ============================================
// Table Root
// ============================================

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the table should have a fixed header */
  stickyHeader?: boolean
}

/**
 * Table Component
 * 
 * A responsive table component with hoverable rows and sticky header support.
 * 
 * @example
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>john@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 */
export function Table({
  children,
  className,
  stickyHeader = false,
  ...props
}: TableProps) {
  return (
    <div 
      className={cn('w-full overflow-auto rounded-lg border border-border', className)}
      {...props}
    >
      <table className={cn(
        'w-full caption-bottom text-sm',
        stickyHeader && '[&_thead]:sticky [&_thead]:top-0'
      )}>
        {children}
      </table>
    </div>
  )
}

Table.displayName = 'Table'

// ============================================
// Table Header
// ============================================

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('bg-secondary text-secondary-foreground', className)}
    {...props}
  />
))

TableHeader.displayName = 'TableHeader'

// ============================================
// Table Body
// ============================================

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))

TableBody.displayName = 'TableBody'

// ============================================
// Table Row
// ============================================

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Whether the row is in a selected state */
  selected?: boolean
}

export const TableRow = forwardRef<
  HTMLTableRowElement,
  TableRowProps
>(({ className, selected, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border transition-colors',
      'hover:bg-secondary/50',
      selected && 'bg-accent-muted',
      className
    )}
    {...props}
  />
))

TableRow.displayName = 'TableRow'

// ============================================
// Table Head (Header Cell)
// ============================================

export const TableHead = forwardRef<
  HTMLTableCellElement,
  ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-semibold text-primary',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))

TableHead.displayName = 'TableHead'

// ============================================
// Table Cell
// ============================================

export const TableCell = forwardRef<
  HTMLTableCellElement,
  TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-secondary', className)}
    {...props}
  />
))

TableCell.displayName = 'TableCell'

// ============================================
// Empty State
// ============================================

export interface TableEmptyProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Message to display when table is empty */
  message?: string
  /** Number of columns for the empty cell to span */
  colSpan?: number
}

export function TableEmpty({
  message = 'No data available',
  colSpan = 1,
  className,
  ...props
}: TableEmptyProps) {
  return (
    <TableRow className={cn('hover:bg-transparent', className)} {...props}>
      <TableCell colSpan={colSpan} className="h-24 text-center text-muted">
        {message}
      </TableCell>
    </TableRow>
  )
}

TableEmpty.displayName = 'TableEmpty'