import { NextRequest, NextResponse } from 'next/server'
import { getBuyerHistory } from '@/lib/db/operations/buyers'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    const history = await getBuyerHistory(params.id, user.id)

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching buyer history:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch buyer history' },
      { status: 500 }
    )
  }
}

