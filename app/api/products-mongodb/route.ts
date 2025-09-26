import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb-simple'
import { Product } from '@/lib/mongodb-models'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Fetch products from MongoDB
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 })
    
    return NextResponse.json({ 
      success: true, 
      products: products,
      count: products.length
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
    await connectDB()
    
    const body = await request.json()
    const { name, description, price, category, features } = body
    
    const product = new Product({
      name,
      description,
      price,
      category,
      features: features || [],
      isActive: true
    })
    
    await product.save()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product: product
    })
  } catch (error: any) {
    console.error('MongoDB product create error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
