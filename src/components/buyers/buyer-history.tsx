'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

interface HistoryEntry {
  id: string
  changedBy: string
  changedAt: string
  diff: Record<string, { old: any; new: any }>
  changedByName?: string
}

interface BuyerHistoryProps {
  buyerId: string
}

export function BuyerHistory({ buyerId }: BuyerHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [buyerId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/buyers/${buyerId}/history`)
      
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch history')
      }
    } catch (err) {
      setError('Failed to fetch history')
    } finally {
      setLoading(false)
    }
  }

  const formatFieldName = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  if (loading) {
    return <div className="text-center py-4">Loading history...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change History</h2>
        <p className="text-gray-500">No changes recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Change History</h2>
        <p className="text-sm text-gray-500">Last 5 changes</p>
      </div>
      <div className="divide-y divide-gray-200">
        {history.map((entry) => (
          <div key={entry.id} className="px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {entry.changedByName || 'Unknown User'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(entry.changedAt)}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              {Object.entries(entry.diff).map(([field, change]) => (
                <div key={field} className="text-sm">
                  <span className="font-medium text-gray-700">
                    {formatFieldName(field)}:
                  </span>{' '}
                  <span className="text-gray-500">
                    {formatValue(change.old)} → {formatValue(change.new)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

