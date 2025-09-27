import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching orders from MongoDB with enhanced TLS config...')
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray()
    
    console.log(`✅ Found ${orders.length} orders from MongoDB`)
    
    return NextResponse.json({
      success: true,
      orders: orders,
      count: orders.length,
      source: 'mongodb'
    })
  } catch (error: any) {
    console.error('MongoDB orders fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}