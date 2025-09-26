import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    
    // For now, allow all requests to pass through
    // TODO: Implement proper authentication middleware with MongoDB
    // This is a temporary solution to prevent Supabase errors
    
    return res
  } catch (error) {
    // If middleware fails completely, allow request to pass through
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}

