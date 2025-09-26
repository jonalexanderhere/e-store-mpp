import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb-simple'
import { Product } from '@/lib/mongodb-models'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Test MongoDB connection by fetching products
    const products = await Product.find({ isActive: true }).limit(5)
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connected successfully',
      products: products,
      count: products.length
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
    await connectDB()
    
    const body = await request.json()
    const { name, description, price, category, features } = body
    
    // Create a test product
    const product = new Product({
      name: name || 'Test Product',
      description: description || 'Test Description',
      price: price || 10000,
      category: category || 'Test',
      features: features || ['Feature 1', 'Feature 2'],
      isActive: true
    })
    
    await product.save()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product: product
    })
  } catch (error: any) {
    console.error('MongoDB create error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
