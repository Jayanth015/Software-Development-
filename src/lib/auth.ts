import { NextRequest } from 'next/server'
import { db } from './db'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export interface User {
  id: string
  email: string
  name?: string
}

// Simple demo authentication - in production, use NextAuth.js or similar
export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  // For demo purposes, we'll use a simple session approach
  // In production, implement proper session management
  const userId = request.cookies.get('user-id')?.value
  
  if (!userId) {
    return null
  }

  // For demo purposes, return a demo user if no user found
  if (userId === 'demo-user-id') {
    return {
      id: 'demo-user-id',
      email: 'demo@example.com',
      name: 'Demo User'
    }
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  return user || null
}

export async function createOrGetUser(email: string, name?: string): Promise<User> {
  // Check if user exists
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  
  if (existing) {
    return existing
  }

  // Create new user
  const [user] = await db.insert(users).values({
    id: uuidv4(),
    email,
    name,
  }).returning()

  return user
}

export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getCurrentUser(request)
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}
