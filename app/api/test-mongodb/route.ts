import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority&ssl=true&authSource=admin";

export async function GET(request: NextRequest) {
  let client;
  
  try {
    console.log('🔍 Testing MongoDB connection...')
    console.log('Environment MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set')
    console.log('Using URI:', MONGODB_URI ? 'Available' : 'Not available')
    
    const options = {
      ssl: true,
      sslValidate: true,
      authSource: 'admin',
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 1
    };
    
    client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    const db = client.db('website-service');
    
    // Test connection
    await db.admin().ping();
    console.log('✅ MongoDB ping successful')
    
    // Count collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name))
    
    // Count products
    const productCount = await db.collection('products').countDocuments();
    console.log(`Products count: ${productCount}`)
    
    // Get sample products
    const sampleProducts = await db.collection('products').find({}).limit(3).toArray();
    console.log('Sample products:', sampleProducts.map(p => ({ name: p.name, price: p.price })))
    
    return NextResponse.json({ 
      success: true,
      message: 'MongoDB connection successful',
      environment: {
        mongodb_uri_set: !!process.env.MONGODB_URI,
        fallback_uri_used: !process.env.MONGODB_URI
      },
      database: {
        name: db.databaseName,
        collections: collections.map(c => c.name),
        productCount: productCount
      },
      sampleProducts: sampleProducts.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        isActive: p.isActive
      }))
    })
  } catch (error: any) {
    console.error('MongoDB test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.toString(),
      environment: {
        mongodb_uri_set: !!process.env.MONGODB_URI,
        fallback_uri_used: !process.env.MONGODB_URI
      }
    }, { status: 500 })
  } finally {
    if (client) {
      await client.close();
    }
  }
}
