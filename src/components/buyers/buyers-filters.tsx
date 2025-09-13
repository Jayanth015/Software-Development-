'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export function BuyersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to first page
    router.push(`/buyers?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Label htmlFor="city-filter">City</Label>
        <Select
          value={searchParams.get('city') || ''}
          onValueChange={(value) => updateFilter('city', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Cities</SelectItem>
            <SelectItem value="Chandigarh">Chandigarh</SelectItem>
            <SelectItem value="Mohali">Mohali</SelectItem>
            <SelectItem value="Zirakpur">Zirakpur</SelectItem>
            <SelectItem value="Panchkula">Panchkula</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="property-type-filter">Property Type</Label>
        <Select
          value={searchParams.get('propertyType') || ''}
          onValueChange={(value) => updateFilter('propertyType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
            <SelectItem value="Plot">Plot</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
            <SelectItem value="Retail">Retail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status-filter">Status</Label>
        <Select
          value={searchParams.get('status') || ''}
          onValueChange={(value) => updateFilter('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Visited">Visited</SelectItem>
            <SelectItem value="Negotiation">Negotiation</SelectItem>
            <SelectItem value="Converted">Converted</SelectItem>
            <SelectItem value="Dropped">Dropped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="timeline-filter">Timeline</Label>
        <Select
          value={searchParams.get('timeline') || ''}
          onValueChange={(value) => updateFilter('timeline', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Timelines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Timelines</SelectItem>
            <SelectItem value="0-3m">0-3 months</SelectItem>
            <SelectItem value="3-6m">3-6 months</SelectItem>
            <SelectItem value=">6m">More than 6 months</SelectItem>
            <SelectItem value="Exploring">Exploring</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

