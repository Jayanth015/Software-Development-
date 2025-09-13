import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { csvRowSchema, Buyer } from '@/lib/validations/buyer'

export interface CsvImportResult {
  success: boolean
  data: Buyer[]
  errors: Array<{
    row: number
    message: string
    data: any
  }>
}

export function parseCsvFile(fileContent: string): CsvImportResult {
  const errors: Array<{ row: number; message: string; data: any }> = []
  const validData: Buyer[] = []

  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length > 200) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, message: 'Maximum 200 rows allowed', data: null }]
      }
    }

    records.forEach((record: any, index: number) => {
      try {
        const validated = csvRowSchema.parse(record)
        validData.push(validated)
      } catch (error: any) {
        errors.push({
          row: index + 1,
          message: error.errors?.[0]?.message || 'Validation error',
          data: record
        })
      }
    })

    return {
      success: errors.length === 0,
      data: validData,
      errors
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [{ row: 0, message: 'Invalid CSV format', data: null }]
    }
  }
}

export function generateCsvData(buyers: Buyer[]): string {
  const headers = [
    'fullName',
    'email',
    'phone',
    'city',
    'propertyType',
    'bhk',
    'purpose',
    'budgetMin',
    'budgetMax',
    'timeline',
    'source',
    'notes',
    'tags',
    'status'
  ]

  const data = buyers.map(buyer => ({
    fullName: buyer.fullName,
    email: buyer.email || '',
    phone: buyer.phone,
    city: buyer.city,
    propertyType: buyer.propertyType,
    bhk: buyer.bhk || '',
    purpose: buyer.purpose,
    budgetMin: buyer.budgetMin?.toString() || '',
    budgetMax: buyer.budgetMax?.toString() || '',
    timeline: buyer.timeline,
    source: buyer.source,
    notes: buyer.notes || '',
    tags: buyer.tags?.join(', ') || '',
    status: buyer.status
  }))

  return stringify(data, {
    header: true,
    columns: headers
  })
}

