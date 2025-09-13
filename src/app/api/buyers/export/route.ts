import { NextRequest, NextResponse } from 'next/server'
import { getBuyersForExport } from '@/lib/db/operations/buyers'
import { generateCsvData } from '@/lib/csv'
import { requireAuth } from '@/lib/auth'
import { buyerFiltersSchema } from '@/lib/validations/buyer'

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
      sortBy: (searchParams.get('sortBy') as any) || 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    }

    const validatedFilters = buyerFiltersSchema.omit({ page: true, limit: true }).parse(filters)
    const buyers = await getBuyersForExport(validatedFilters, user.id)
    
    const csvData = generateCsvData(buyers)
    
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="buyers.csv"',
      },
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    )
  }
}

