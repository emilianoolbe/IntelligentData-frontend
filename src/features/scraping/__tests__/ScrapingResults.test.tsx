import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrapingResults } from '../components/ScrapingResults'
import type { ScrapedItem } from '../types'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { count?: number }) => {
      const translations: Record<string, string> = {
        'results.title': 'Results',
        'results.count': '{{count}} products found',
        'results.empty': 'No products found',
        'results.noResults': 'No data extracted yet. Fill the form and press "Extract Data"',
        'results.table.title': 'Title',
        'results.table.price': 'Price',
        'results.table.source': 'Source',
        'results.table.available': 'Available',
        'results.table.seller': 'Seller',
        'results.table.scrapedAt': 'Extracted',
        'results.table.yes': 'Yes',
        'results.table.no': 'No',
        'status.loading': 'Extracting data... Please wait.',
        'products.mercadolibre': 'MercadoLibre',
        'products.amazon': 'Amazon',
        'products.fravega': 'Fravega',
      }
      let result = translations[key] || key
      // Handle interpolation
      if (options?.count !== undefined) {
        result = result.replace('{{count}}', String(options.count))
      }
      return result
    },
  }),
}))

describe('ScrapingResults', () => {
  const mockItems: ScrapedItem[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      price: 1500000,
      currency: 'ARS',
      url: 'https://mercadolibre.com/item/1',
      source: 'mercadolibre',
      available: true,
      scrapedAt: '2024-01-15T10:30:00Z',
      seller: 'TechStore',
      imageUrl: 'https://example.com/image1.jpg',
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24',
      price: 1200000,
      currency: 'ARS',
      url: 'https://mercadolibre.com/item/2',
      source: 'mercadolibre',
      available: false,
      scrapedAt: '2024-01-15T10:30:00Z',
    },
  ]

  describe('Loading State', () => {
    it('should show loading state when isLoading is true', () => {
      render(<ScrapingResults items={[]} isLoading={true} />)

      expect(screen.getByText('Extracting data... Please wait.')).toBeInTheDocument()
    })

    it('should show spinner when loading', () => {
      const { container } = render(<ScrapingResults items={[]} isLoading={true} />)

      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when items array is empty', () => {
      render(<ScrapingResults items={[]} isLoading={false} />)

      expect(screen.getByText('No data extracted yet. Fill the form and press "Extract Data"')).toBeInTheDocument()
    })

    it('should show empty state when items is undefined', () => {
      render(<ScrapingResults items={undefined as unknown as ScrapedItem[]} isLoading={false} />)

      expect(screen.getByText('No data extracted yet. Fill the form and press "Extract Data"')).toBeInTheDocument()
    })
  })

  describe('Results Table', () => {
    it('should render table with items', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      expect(screen.getByText('Results')).toBeInTheDocument()
      expect(screen.getByText('2 products found')).toBeInTheDocument()
    })

    it('should render all item titles', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument()
      expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument()
    })

    it('should show availability status', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      expect(screen.getByText('Yes')).toBeInTheDocument() // available item
      expect(screen.getByText('No')).toBeInTheDocument() // unavailable item
    })

    it('should show seller when present', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      expect(screen.getByText('TechStore')).toBeInTheDocument()
    })

    it('should show dash for missing seller', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      // Samsung item has no seller, should show dash
      const sellerCells = screen.getAllByText('-')
      expect(sellerCells.length).toBeGreaterThan(0)
    })

    it('should render image when present', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      const image = screen.getByAltText('iPhone 15 Pro Max')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
    })

    it('should render links to products', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute('href', 'https://mercadolibre.com/item/1')
      expect(links[1]).toHaveAttribute('href', 'https://mercadolibre.com/item/2')
    })

    it('should show source badge', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      // Both items are from mercadolibre
      const sourceBadges = screen.getAllByText('MercadoLibre')
      expect(sourceBadges).toHaveLength(2)
    })
  })

  describe('Price Formatting', () => {
    it('should format price with currency', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      // Price formatting depends on Intl.NumberFormat locale
      // Check that prices are rendered (exact format may vary)
      expect(screen.getByText(/1,500,000/)).toBeInTheDocument()
      expect(screen.getByText(/1,200,000/)).toBeInTheDocument()
    })
  })

  describe('Date Formatting', () => {
    it('should render scrapedAt date', () => {
      render(<ScrapingResults items={mockItems} isLoading={false} />)

      // Date format depends on locale, but should be present
      // Just check that dates are rendered (exact format may vary)
      // The string is "2024-01-15T10:30:00Z" which in locale format shows Jan 15
      const dateCells = screen.getAllByText(/Jan/)
      expect(dateCells.length).toBeGreaterThan(0)
    })
  })
})