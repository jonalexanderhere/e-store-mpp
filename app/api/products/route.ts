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

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating product in MongoDB...')
    
    const body = await request.json()
    const { name, description, price, category, features, isActive } = body
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const product = {
      name,
      description,
      price,
      category,
      features,
      isActive: isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('products').insertOne(product)
    
    console.log(`✅ Product created with ID: ${result.insertedId}`)
    
    return NextResponse.json({ 
      success: true, 
      product: { ...product, _id: result.insertedId },
      message: 'Product created successfully'
    })
  } catch (error: any) {
    console.error('MongoDB product creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Updating product in MongoDB...')
    
    const body = await request.json()
    const { productId, isActive } = body
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const result = await db.collection('products').updateOne(
      { _id: productId },
      { 
        $set: { 
          isActive,
          updatedAt: new Date()
        } 
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    console.log(`✅ Product updated: ${productId}`)
    
    return NextResponse.json({ 
      success: true,
      message: 'Product updated successfully'
    })
  } catch (error: any) {
    console.error('MongoDB product update error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}