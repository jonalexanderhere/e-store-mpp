import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority";

export async function GET(request: NextRequest) {
  let client;
  
  try {
    console.log('🔍 Fetching products from MongoDB...')
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('website-service');
    
    // Fetch products from MongoDB
    const products = await db.collection('products').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    
    console.log(`✅ Found ${products.length} products`);
    
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
  } finally {
    if (client) {
      await client.close();
    }
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
