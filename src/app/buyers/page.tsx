import { Suspense } from 'react'
import { BuyersList } from '@/components/buyers/buyers-list'
import { BuyersFilters } from '@/components/buyers/buyers-filters'
import { BuyersSearch } from '@/components/buyers/buyers-search'
import { BuyersActions } from '@/components/buyers/buyers-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface SearchParams {
  city?: string
  propertyType?: string
  status?: string
  timeline?: string
  search?: string
  page?: string
  sortBy?: string
  sortOrder?: string
}

interface BuyersPageProps {
  searchParams: SearchParams
}

export default function BuyersPage({ searchParams }: BuyersPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Buyer Leads</h1>
        <Link href="/buyers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <BuyersSearch />
          <BuyersFilters />
          <BuyersActions />
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <BuyersList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

