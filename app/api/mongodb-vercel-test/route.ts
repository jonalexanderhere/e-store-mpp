import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb-vercel'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("website-service")
    
    // Test MongoDB connection by fetching from products collection
    const products = await db.collection("products").find({}).limit(5).toArray()
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully with Vercel Functions optimization',
      products: products,
      count: products.length,
      database: "website-service"
    })
  } catch (error: any) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("website-service")
    
    const body = await request.json()
    const { name, description, price, category, features } = body
    
    // Create a test product
    const product = {
      name: name || 'Test Product',
      description: description || 'Test Description',
      price: price || 10000,
      category: category || 'Test',
      features: features || ['Feature 1', 'Feature 2'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("products").insertOne(product)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      productId: result.insertedId
    })
  } catch (error: any) {
    console.error('MongoDB create error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
