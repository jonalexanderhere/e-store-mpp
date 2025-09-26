import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching products from MongoDB...')
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const products = await db.collection('products').find({ isActive: true }).sort({ createdAt: -1 }).toArray()
    
    console.log(`✅ Found ${products.length} products from MongoDB`)
    
    return NextResponse.json({ 
      success: true, 
      products: products,
      count: products.length,
      source: 'mongodb'
    })
  } catch (error: any) {
    console.error('MongoDB products fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}