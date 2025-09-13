import { NextRequest, NextResponse } from 'next/server'
import { getBuyer, updateBuyer, deleteBuyer } from '@/lib/db/operations/buyers'
import { buyerUpdateSchema } from '@/lib/validations/buyer'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    const buyer = await getBuyer(params.id, user.id)

    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(buyer)
  } catch (error) {
    console.error('Error fetching buyer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyer' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    const body = await request.json()
    
    const validatedData = buyerUpdateSchema.parse({
      ...body,
      id: params.id,
    })
    
    const buyer = await updateBuyer(
      params.id,
      validatedData,
      user.id,
      validatedData.updatedAt
    )

    return NextResponse.json(buyer)
  } catch (error) {
    console.error('Error updating buyer:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update buyer' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    await deleteBuyer(params.id, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting buyer:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete buyer' },
      { status: 500 }
    )
  }
}

