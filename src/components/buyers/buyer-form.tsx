'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buyerCreateSchema, BuyerCreate } from '@/lib/validations/buyer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface BuyerFormProps {
  initialData?: Partial<BuyerCreate>
  isEdit?: boolean
  buyerId?: string
  onSuccess?: () => void
}

export function BuyerForm({ initialData, isEdit = false, buyerId, onSuccess }: BuyerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors }
  } = useForm<BuyerCreate>({
    resolver: zodResolver(buyerCreateSchema),
    defaultValues: initialData
  })

  const propertyType = watch('propertyType')

  const onSubmit = async (data: BuyerCreate) => {
    setIsSubmitting(true)
    setErrors({})

    try {
      const url = isEdit ? `/api/buyers/${buyerId}` : '/api/buyers'
      const method = isEdit ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/buyers')
        }
      } else {
        const errorData = await response.json()
        if (errorData.error) {
          setErrors({ general: errorData.error })
        } else {
          setErrors({ general: 'An error occurred. Please try again.' })
        }
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            className={formErrors.fullName ? 'border-red-500' : ''}
          />
          {formErrors.fullName && (
            <p className="text-red-500 text-sm mt-1">{formErrors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={formErrors.email ? 'border-red-500' : ''}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            {...register('phone')}
            className={formErrors.phone ? 'border-red-500' : ''}
          />
          {formErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{formErrors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Select onValueChange={(value) => setValue('city', value as any)}>
            <SelectTrigger className={formErrors.city ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chandigarh">Chandigarh</SelectItem>
              <SelectItem value="Mohali">Mohali</SelectItem>
              <SelectItem value="Zirakpur">Zirakpur</SelectItem>
              <SelectItem value="Panchkula">Panchkula</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.city && (
            <p className="text-red-500 text-sm mt-1">{formErrors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="propertyType">Property Type *</Label>
          <Select onValueChange={(value) => setValue('propertyType', value as any)}>
            <SelectTrigger className={formErrors.propertyType ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Plot">Plot</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.propertyType && (
            <p className="text-red-500 text-sm mt-1">{formErrors.propertyType.message}</p>
          )}
        </div>

        {(propertyType === 'Apartment' || propertyType === 'Villa') && (
          <div>
            <Label htmlFor="bhk">BHK *</Label>
            <Select onValueChange={(value) => setValue('bhk', value as any)}>
              <SelectTrigger className={formErrors.bhk ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 BHK</SelectItem>
                <SelectItem value="2">2 BHK</SelectItem>
                <SelectItem value="3">3 BHK</SelectItem>
                <SelectItem value="4">4 BHK</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.bhk && (
              <p className="text-red-500 text-sm mt-1">{formErrors.bhk.message}</p>
            )}
          </div>
        )}

        <div>
          <Label htmlFor="purpose">Purpose *</Label>
          <Select onValueChange={(value) => setValue('purpose', value as any)}>
            <SelectTrigger className={formErrors.purpose ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">Buy</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.purpose && (
            <p className="text-red-500 text-sm mt-1">{formErrors.purpose.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="timeline">Timeline *</Label>
          <Select onValueChange={(value) => setValue('timeline', value as any)}>
            <SelectTrigger className={formErrors.timeline ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-3m">0-3 months</SelectItem>
              <SelectItem value="3-6m">3-6 months</SelectItem>
              <SelectItem value=">6m">More than 6 months</SelectItem>
              <SelectItem value="Exploring">Exploring</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.timeline && (
            <p className="text-red-500 text-sm mt-1">{formErrors.timeline.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="source">Source *</Label>
          <Select onValueChange={(value) => setValue('source', value as any)}>
            <SelectTrigger className={formErrors.source ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Website">Website</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Walk-in">Walk-in</SelectItem>
              <SelectItem value="Call">Call</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {formErrors.source && (
            <p className="text-red-500 text-sm mt-1">{formErrors.source.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budgetMin">Budget Min (INR)</Label>
          <Input
            id="budgetMin"
            type="number"
            {...register('budgetMin', { valueAsNumber: true })}
            className={formErrors.budgetMin ? 'border-red-500' : ''}
          />
          {formErrors.budgetMin && (
            <p className="text-red-500 text-sm mt-1">{formErrors.budgetMin.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budgetMax">Budget Max (INR)</Label>
          <Input
            id="budgetMax"
            type="number"
            {...register('budgetMax', { valueAsNumber: true })}
            className={formErrors.budgetMax ? 'border-red-500' : ''}
          />
          {formErrors.budgetMax && (
            <p className="text-red-500 text-sm mt-1">{formErrors.budgetMax.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          className={formErrors.notes ? 'border-red-500' : ''}
          rows={4}
        />
        {formErrors.notes && (
          <p className="text-red-500 text-sm mt-1">{formErrors.notes.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Buyer' : 'Create Buyer'}
        </Button>
      </div>
    </form>
  )
}
