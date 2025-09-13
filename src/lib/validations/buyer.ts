import { z } from 'zod'

export const cityEnum = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'])
export const propertyTypeEnum = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail'])
export const bhkEnum = z.enum(['1', '2', '3', '4', 'Studio'])
export const purposeEnum = z.enum(['Buy', 'Rent'])
export const timelineEnum = z.enum(['0-3m', '3-6m', '>6m', 'Exploring'])
export const sourceEnum = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other'])
export const statusEnum = z.enum(['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'])

export const buyerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be at most 80 characters'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10-15 digits'),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional(),
  purpose: purposeEnum,
  budgetMin: z.number().int().positive('Budget minimum must be positive').optional(),
  budgetMax: z.number().int().positive('Budget maximum must be positive').optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  status: statusEnum.default('New'),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  // BHK is required for Apartment and Villa
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false
  }
  return true
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
}).refine((data) => {
  // Budget max must be >= budget min if both present
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false
  }
  return true
}, {
  message: 'Budget maximum must be greater than or equal to budget minimum',
  path: ['budgetMax']
})

export const buyerUpdateSchema = buyerSchema.partial().extend({
  id: z.string().uuid(),
  updatedAt: z.date(),
})

export const buyerCreateSchema = buyerSchema.omit({
  status: true,
})

export const buyerFiltersSchema = z.object({
  city: cityEnum.optional(),
  propertyType: propertyTypeEnum.optional(),
  status: statusEnum.optional(),
  timeline: timelineEnum.optional(),
  search: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.enum(['updatedAt', 'fullName', 'createdAt']).default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const csvRowSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/),
  city: cityEnum,
  propertyType: propertyTypeEnum,
  bhk: bhkEnum.optional().or(z.literal('')),
  purpose: purposeEnum,
  budgetMin: z.string().transform((val) => val ? parseInt(val) : undefined).optional(),
  budgetMax: z.string().transform((val) => val ? parseInt(val) : undefined).optional(),
  timeline: timelineEnum,
  source: sourceEnum,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().transform((val) => val ? val.split(',').map(t => t.trim()) : []).optional(),
  status: statusEnum.default('New'),
}).refine((data) => {
  if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
    return false
  }
  return true
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
}).refine((data) => {
  if (data.budgetMin && data.budgetMax && data.budgetMax < data.budgetMin) {
    return false
  }
  return true
}, {
  message: 'Budget maximum must be greater than or equal to budget minimum',
  path: ['budgetMax']
})

export type Buyer = z.infer<typeof buyerSchema>
export type BuyerCreate = z.infer<typeof buyerCreateSchema>
export type BuyerUpdate = z.infer<typeof buyerUpdateSchema>
export type BuyerFilters = z.infer<typeof buyerFiltersSchema>
export type CsvRow = z.infer<typeof csvRowSchema>

