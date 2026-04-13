import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import type { ScrapedItem } from '../types'
import { PRODUCT_LABELS } from '../types'

interface ScrapingResultsProps {
  items: ScrapedItem[]
  isLoading?: boolean
}

export function ScrapingResults({ items, isLoading = false }: ScrapingResultsProps) {
  const { t } = useTranslation('scraping')

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="mt-4 text-muted">{t('status.loading')}</p>
        </div>
      </Card>
    )
  }

  if (!items || items.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="h-12 w-12 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-muted">{t('results.noResults')}</p>
        </div>
      </Card>
    )
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-primary">{t('results.title')}</h2>
        <p className="text-sm text-muted">
          {t('results.count', { count: items.length })}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <thead>
            <tr>
              <th>{t('results.table.title')}</th>
              <th>{t('results.table.price')}</th>
              <th>{t('results.table.source')}</th>
              <th>{t('results.table.available')}</th>
              <th>{t('results.table.seller')}</th>
              <th>{t('results.table.scrapedAt')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent"
                      >
                        {item.title}
                      </a>
                    </div>
                  </div>
                </td>
                <td className="font-medium">
                  {formatPrice(item.price, item.currency)}
                </td>
                <td>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs text-primary">
                    {PRODUCT_LABELS[item.source]}
                  </span>
                </td>
                <td>
                  {item.available ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                      {t('results.table.yes')}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                      {t('results.table.no')}
                    </span>
                  )}
                </td>
                <td className="text-muted">
                  {item.seller || '-'}
                </td>
                <td className="text-muted text-sm">
                  {formatDate(item.scrapedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Card>
  )
}