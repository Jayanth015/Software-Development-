import { eq, and, desc, asc, ilike, or, sql } from 'drizzle-orm'
import { db } from '../index'
import { buyers, buyerHistory, users } from '../schema'
import { BuyerCreate, BuyerUpdate, BuyerFilters } from '@/lib/validations/buyer'
import { v4 as uuidv4 } from 'uuid'

export async function createBuyer(data: BuyerCreate, ownerId: string) {
  const [buyer] = await db.insert(buyers).values({
    ...data,
    ownerId,
    id: uuidv4(),
  }).returning()

  // Create history entry
  await db.insert(buyerHistory).values({
    id: uuidv4(),
    buyerId: buyer.id,
    changedBy: ownerId,
    diff: { created: { old: null, new: 'New buyer created' } }
  })

  return buyer
}

export async function updateBuyer(id: string, data: Partial<BuyerUpdate>, ownerId: string, currentUpdatedAt: Date) {
  // Check if record exists and hasn't been modified
  const existing = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1)
  
  if (existing.length === 0) {
    throw new Error('Buyer not found')
  }

  if (existing[0].updatedAt.getTime() !== currentUpdatedAt.getTime()) {
    throw new Error('Record has been modified by another user. Please refresh and try again.')
  }

  // Check ownership
  if (existing[0].ownerId !== ownerId) {
    throw new Error('You can only edit your own buyers')
  }

  // Calculate diff
  const diff: Record<string, { old: any; new: any }> = {}
  Object.keys(data).forEach(key => {
    if (key !== 'id' && key !== 'updatedAt' && existing[0][key as keyof typeof existing[0]] !== data[key as keyof typeof data]) {
      diff[key] = {
        old: existing[0][key as keyof typeof existing[0]],
        new: data[key as keyof typeof data]
      }
    }
  })

  const [updated] = await db.update(buyers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(buyers.id, id), eq(buyers.ownerId, ownerId)))
    .returning()

  // Create history entry if there are changes
  if (Object.keys(diff).length > 0) {
    await db.insert(buyerHistory).values({
      id: uuidv4(),
      buyerId: id,
      changedBy: ownerId,
      diff
    })
  }

  return updated
}

export async function getBuyer(id: string, ownerId: string) {
  const [buyer] = await db.select()
    .from(buyers)
    .where(and(eq(buyers.id, id), eq(buyers.ownerId, ownerId)))
    .limit(1)

  return buyer
}

export async function getBuyers(filters: BuyerFilters, ownerId: string) {
  const { page, limit, sortBy, sortOrder, search, ...filterFields } = filters
  const offset = (page - 1) * limit

  let query = db.select({
    id: buyers.id,
    fullName: buyers.fullName,
    email: buyers.email,
    phone: buyers.phone,
    city: buyers.city,
    propertyType: buyers.propertyType,
    bhk: buyers.bhk,
    purpose: buyers.purpose,
    budgetMin: buyers.budgetMin,
    budgetMax: buyers.budgetMax,
    timeline: buyers.timeline,
    source: buyers.source,
    status: buyers.status,
    notes: buyers.notes,
    tags: buyers.tags,
    ownerId: buyers.ownerId,
    updatedAt: buyers.updatedAt,
  }).from(buyers)

  // Apply filters
  const conditions = [eq(buyers.ownerId, ownerId)]

  if (filterFields.city) {
    conditions.push(eq(buyers.city, filterFields.city))
  }
  if (filterFields.propertyType) {
    conditions.push(eq(buyers.propertyType, filterFields.propertyType))
  }
  if (filterFields.status) {
    conditions.push(eq(buyers.status, filterFields.status))
  }
  if (filterFields.timeline) {
    conditions.push(eq(buyers.timeline, filterFields.timeline))
  }

  // Apply search
  if (search) {
    conditions.push(
      or(
        ilike(buyers.fullName, `%${search}%`),
        ilike(buyers.email, `%${search}%`),
        ilike(buyers.phone, `%${search}%`)
      )!
    )
  }

  query = query.where(and(...conditions))

  // Apply sorting
  const sortColumn = buyers[sortBy as keyof typeof buyers]
  if (sortOrder === 'asc') {
    query = query.orderBy(asc(sortColumn))
  } else {
    query = query.orderBy(desc(sortColumn))
  }

  // Apply pagination
  query = query.limit(limit).offset(offset)

  const results = await query

  // Get total count
  const countQuery = db.select({ count: sql<number>`count(*)` })
    .from(buyers)
    .where(and(...conditions))

  const [{ count }] = await countQuery

  return {
    data: results,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    }
  }
}

export async function deleteBuyer(id: string, ownerId: string) {
  // Check ownership
  const existing = await db.select().from(buyers).where(eq(buyers.id, id)).limit(1)
  
  if (existing.length === 0) {
    throw new Error('Buyer not found')
  }

  if (existing[0].ownerId !== ownerId) {
    throw new Error('You can only delete your own buyers')
  }

  await db.delete(buyers).where(and(eq(buyers.id, id), eq(buyers.ownerId, ownerId)))
}

export async function getBuyerHistory(buyerId: string, ownerId: string) {
  // Verify ownership
  const buyer = await getBuyer(buyerId, ownerId)
  if (!buyer) {
    throw new Error('Buyer not found')
  }

  const history = await db.select({
    id: buyerHistory.id,
    changedBy: buyerHistory.changedBy,
    changedAt: buyerHistory.changedAt,
    diff: buyerHistory.diff,
    changedByName: users.name,
  })
    .from(buyerHistory)
    .leftJoin(users, eq(buyerHistory.changedBy, users.id))
    .where(eq(buyerHistory.buyerId, buyerId))
    .orderBy(desc(buyerHistory.changedAt))
    .limit(5)

  return history
}

export async function getBuyersForExport(filters: Omit<BuyerFilters, 'page' | 'limit'>, ownerId: string) {
  const { sortBy, sortOrder, search, ...filterFields } = filters

  let query = db.select().from(buyers)

  // Apply filters
  const conditions = [eq(buyers.ownerId, ownerId)]

  if (filterFields.city) {
    conditions.push(eq(buyers.city, filterFields.city))
  }
  if (filterFields.propertyType) {
    conditions.push(eq(buyers.propertyType, filterFields.propertyType))
  }
  if (filterFields.status) {
    conditions.push(eq(buyers.status, filterFields.status))
  }
  if (filterFields.timeline) {
    conditions.push(eq(buyers.timeline, filterFields.timeline))
  }

  // Apply search
  if (search) {
    conditions.push(
      or(
        ilike(buyers.fullName, `%${search}%`),
        ilike(buyers.email, `%${search}%`),
        ilike(buyers.phone, `%${search}%`)
      )!
    )
  }

  query = query.where(and(...conditions))

  // Apply sorting
  const sortColumn = buyers[sortBy as keyof typeof buyers]
  if (sortOrder === 'asc') {
    query = query.orderBy(asc(sortColumn))
  } else {
    query = query.orderBy(desc(sortColumn))
  }

  return await query
}

