import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For demo purposes, set a demo user ID in cookies
  // In production, implement proper authentication
  const response = NextResponse.next()
  
  if (!request.cookies.get('user-id')) {
    // Set a demo user ID
    response.cookies.set('user-id', 'demo-user-id')
  }
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/buyers/:path*',
  ]
}

