import { BuyerForm } from '@/components/buyers/buyer-form'

export default function NewBuyerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Buyer Lead</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to create a new buyer lead.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BuyerForm />
      </div>
    </div>
  )
}

