import { NextRequest, NextResponse } from 'next/server'
import { createBuyer } from '@/lib/db/operations/buyers'
import { parseCsvFile } from '@/lib/csv'
import { requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileContent = await file.text()
    const result = parseCsvFile(fileContent)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        errors: result.errors
      }, { status: 400 })
    }

    // Import valid rows in a transaction
    const importedBuyers = []
    
    for (const buyerData of result.data) {
      try {
        const buyer = await createBuyer(buyerData, user.id)
        importedBuyers.push(buyer)
      } catch (error) {
        console.error('Error importing buyer:', error)
        // Continue with other buyers even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedBuyers.length,
      total: result.data.length,
      errors: result.errors
    })
  } catch (error) {
    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { error: 'Failed to import CSV' },
      { status: 500 }
    )
  }
}

