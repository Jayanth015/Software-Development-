import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

const defaultConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per window
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = defaultConfig
): { success: boolean; remaining: number; resetTime: number } {
  const identifier = request.ip || 'anonymous'
  const now = Date.now()
  const windowStart = now - config.windowMs

  // Clean up old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.resetTime < windowStart) {
      requestCounts.delete(key)
    }
  }

  const current = requestCounts.get(identifier)
  
  if (!current || current.resetTime < windowStart) {
    // New window
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  if (current.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime,
    }
  }

  // Increment count
  current.count++
  requestCounts.set(identifier, current)

  return {
    success: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime,
  }
}

