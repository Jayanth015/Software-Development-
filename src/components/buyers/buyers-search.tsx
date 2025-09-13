'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { debounce } from '@/lib/utils'

export function BuyersSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const debouncedSearch = debounce((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    params.delete('page') // Reset to first page
    router.push(`/buyers?${params.toString()}`)
  }, 300)

  useEffect(() => {
    debouncedSearch(search)
  }, [search, debouncedSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

