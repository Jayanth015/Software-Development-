import { NextRequest, NextResponse } from 'next/server'
import { getBuyers, createBuyer } from '@/lib/db/operations/buyers'
import { buyerCreateSchema, buyerFiltersSchema } from '@/lib/validations/buyer'
import { requireAuth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    
    const filters = {
      city: searchParams.get('city') || undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      status: searchParams.get('status') || undefined,
      timeline: searchParams.get('timeline') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: (searchParams.get('sortBy') as any) || 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    }

    const validatedFilters = buyerFiltersSchema.parse(filters)
    const result = await getBuyers(validatedFilters, user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching buyers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch buyers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for create operations
    const rateLimitResult = rateLimit(request, { windowMs: 15 * 60 * 1000, maxRequests: 20 })
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const user = await requireAuth(request)
    const body = await request.json()
    
    const validatedData = buyerCreateSchema.parse(body)
    const buyer = await createBuyer(validatedData, user.id)

    return NextResponse.json(buyer, { status: 201 })
  } catch (error) {
    console.error('Error creating buyer:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create buyer' },
      { status: 500 }
    )
  }
}
