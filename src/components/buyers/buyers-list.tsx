'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Buyer } from '@/lib/validations/buyer'

interface BuyersListProps {
  searchParams: Record<string, string | undefined>
}

export function BuyersList({ searchParams }: BuyersListProps) {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchBuyers()
  }, [searchParams])

  const fetchBuyers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.set(key, value)
      })

      const response = await fetch(`/api/buyers?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setBuyers(data.data)
        setPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch buyers')
      }
    } catch (err) {
      setError('Failed to fetch buyers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this buyer?')) return

    try {
      const response = await fetch(`/api/buyers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchBuyers()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete buyer')
      }
    } catch (err) {
      alert('Failed to delete buyer')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  if (buyers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No buyers found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buyers.map((buyer) => (
              <tr key={buyer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {buyer.fullName}
                    </div>
                    {buyer.email && (
                      <div className="text-sm text-gray-500">{buyer.email}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {buyer.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {buyer.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {buyer.propertyType}
                  {buyer.bhk && ` (${buyer.bhk} BHK)`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {buyer.budgetMin && buyer.budgetMax
                    ? `${formatCurrency(buyer.budgetMin)} - ${formatCurrency(buyer.budgetMax)}`
                    : buyer.budgetMin
                    ? `From ${formatCurrency(buyer.budgetMin)}`
                    : buyer.budgetMax
                    ? `Up to ${formatCurrency(buyer.budgetMax)}`
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {buyer.timeline}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    buyer.status === 'New' ? 'bg-blue-100 text-blue-800' :
                    buyer.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                    buyer.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                    buyer.status === 'Visited' ? 'bg-purple-100 text-purple-800' :
                    buyer.status === 'Negotiation' ? 'bg-orange-100 text-orange-800' :
                    buyer.status === 'Converted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {buyer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(buyer.updatedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/buyers/${buyer.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/buyers/${buyer.id}?edit=true`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(buyer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set('page', (pagination.page - 1).toString())
                router.push(`/buyers?${params.toString()}`)
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.set('page', (pagination.page + 1).toString())
                router.push(`/buyers?${params.toString()}`)
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

