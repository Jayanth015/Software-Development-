'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit, ArrowLeft } from 'lucide-react'
import { BuyerForm } from './buyer-form'
import { Buyer } from '@/lib/validations/buyer'

interface BuyerDetailProps {
  buyerId: string
  isEdit?: boolean
}

export function BuyerDetail({ buyerId, isEdit = false }: BuyerDetailProps) {
  const router = useRouter()
  const [buyer, setBuyer] = useState<Buyer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit) {
      fetchBuyer()
    }
  }, [buyerId, isEdit])

  const fetchBuyer = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/buyers/${buyerId}`)
      
      if (response.ok) {
        const data = await response.json()
        setBuyer(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch buyer')
      }
    } catch (err) {
      setError('Failed to fetch buyer')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    router.push(`/buyers/${buyerId}?edit=true`)
  }

  const handleUpdate = () => {
    fetchBuyer()
    router.push(`/buyers/${buyerId}`)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push('/buyers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Buyers
        </Button>
      </div>
    )
  }

  if (!buyer) {
    return <div className="text-center py-8">Buyer not found</div>
  }

  if (isEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Edit Buyer</h1>
          <Button variant="outline" onClick={() => router.push(`/buyers/${buyerId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to View
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <BuyerForm
            initialData={buyer}
            isEdit={true}
            buyerId={buyerId}
            onSuccess={handleUpdate}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{buyer.fullName}</h1>
          <p className="text-gray-600">Buyer Lead Details</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => router.push('/buyers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buyers
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-sm text-gray-900">{buyer.fullName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-sm text-gray-900">{buyer.email || '-'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-sm text-gray-900">{buyer.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">City</label>
            <p className="text-sm text-gray-900">{buyer.city}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Property Details</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Property Type</label>
            <p className="text-sm text-gray-900">{buyer.propertyType}</p>
          </div>
          {buyer.bhk && (
            <div>
              <label className="text-sm font-medium text-gray-500">BHK</label>
              <p className="text-sm text-gray-900">{buyer.bhk}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-500">Purpose</label>
            <p className="text-sm text-gray-900">{buyer.purpose}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Timeline</label>
            <p className="text-sm text-gray-900">{buyer.timeline}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Budget & Source</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Budget Range</label>
            <p className="text-sm text-gray-900">
              {buyer.budgetMin && buyer.budgetMax
                ? `${formatCurrency(buyer.budgetMin)} - ${formatCurrency(buyer.budgetMax)}`
                : buyer.budgetMin
                ? `From ${formatCurrency(buyer.budgetMin)}`
                : buyer.budgetMax
                ? `Up to ${formatCurrency(buyer.budgetMax)}`
                : 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Source</label>
            <p className="text-sm text-gray-900">{buyer.source}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
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
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Last Updated</label>
            <p className="text-sm text-gray-900">{formatDate(buyer.updatedAt)}</p>
          </div>
        </div>
      </div>

      {buyer.notes && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
          </div>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{buyer.notes}</p>
          </div>
        </div>
      )}

      {buyer.tags && buyer.tags.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tags</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {buyer.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

