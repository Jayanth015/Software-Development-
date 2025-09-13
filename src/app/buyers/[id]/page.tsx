import { Suspense } from 'react'
import { BuyerDetail } from '@/components/buyers/buyer-detail'
import { BuyerHistory } from '@/components/buyers/buyer-history'

interface BuyerPageProps {
  params: { id: string }
  searchParams: { edit?: string }
}

export default function BuyerPage({ params, searchParams }: BuyerPageProps) {
  const isEdit = searchParams.edit === 'true'

  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading...</div>}>
        <BuyerDetail buyerId={params.id} isEdit={isEdit} />
      </Suspense>
      
      {!isEdit && (
        <Suspense fallback={<div>Loading history...</div>}>
          <BuyerHistory buyerId={params.id} />
        </Suspense>
      )}
    </div>
  )
}

