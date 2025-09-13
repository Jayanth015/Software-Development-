import { buyerSchema, csvRowSchema } from './buyer'

describe('Buyer Validation', () => {
  describe('buyerSchema', () => {
    it('should validate a complete buyer object', () => {
      const validBuyer = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 1000000,
        budgetMax: 2000000,
        timeline: '3-6m',
        source: 'Website',
        notes: 'Interested in 2BHK apartment',
        tags: ['urgent', 'premium'],
      }

      const result = buyerSchema.safeParse(validBuyer)
      expect(result.success).toBe(true)
    })

    it('should require BHK for Apartment and Villa', () => {
      const invalidBuyer = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      }

      const result = buyerSchema.safeParse(invalidBuyer)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['bhk'])
      }
    })

    it('should not require BHK for non-residential properties', () => {
      const validBuyer = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Office',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      }

      const result = buyerSchema.safeParse(validBuyer)
      expect(result.success).toBe(true)
    })

    it('should validate budget constraints', () => {
      const invalidBuyer = {
        fullName: 'John Doe',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: 2000000,
        budgetMax: 1000000, // Max < Min
        timeline: '3-6m',
        source: 'Website',
      }

      const result = buyerSchema.safeParse(invalidBuyer)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['budgetMax'])
      }
    })

    it('should validate phone number format', () => {
      const invalidBuyer = {
        fullName: 'John Doe',
        phone: '123', // Too short
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        timeline: '3-6m',
        source: 'Website',
      }

      const result = buyerSchema.safeParse(invalidBuyer)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['phone'])
      }
    })
  })

  describe('csvRowSchema', () => {
    it('should parse CSV row correctly', () => {
      const csvRow = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Apartment',
        bhk: '2',
        purpose: 'Buy',
        budgetMin: '1000000',
        budgetMax: '2000000',
        timeline: '3-6m',
        source: 'Website',
        notes: 'Interested in 2BHK apartment',
        tags: 'urgent,premium',
        status: 'New',
      }

      const result = csvRowSchema.safeParse(csvRow)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.budgetMin).toBe(1000000)
        expect(result.data.budgetMax).toBe(2000000)
        expect(result.data.tags).toEqual(['urgent', 'premium'])
      }
    })

    it('should handle empty optional fields', () => {
      const csvRow = {
        fullName: 'John Doe',
        email: '',
        phone: '1234567890',
        city: 'Chandigarh',
        propertyType: 'Office',
        bhk: '',
        purpose: 'Buy',
        budgetMin: '',
        budgetMax: '',
        timeline: '3-6m',
        source: 'Website',
        notes: '',
        tags: '',
        status: 'New',
      }

      const result = csvRowSchema.safeParse(csvRow)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('')
        expect(result.data.bhk).toBeUndefined()
        expect(result.data.budgetMin).toBeUndefined()
        expect(result.data.budgetMax).toBeUndefined()
        expect(result.data.tags).toEqual([])
      }
    })
  })
})

