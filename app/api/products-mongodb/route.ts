import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority";

export async function GET(request: NextRequest) {
  let client;
  
  try {
    console.log('🔍 Fetching products from MongoDB...')
    console.log('MongoDB URI:', MONGODB_URI ? 'Set' : 'Not set')
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('website-service');
    
    // Fetch products from MongoDB
    const products = await db.collection('products').find({ isActive: true }).sort({ createdAt: -1 }).toArray();
    
    console.log(`✅ Found ${products.length} products from MongoDB`);
    console.log('Products:', products.map(p => ({ name: p.name, price: p.price })));
    
    return NextResponse.json({ 
      success: true, 
      products: products,
      count: products.length,
      source: 'mongodb'
    })
  } catch (error: any) {
    console.error('MongoDB products fetch error:', error)
    console.log('🔄 Falling back to Supabase...')
    
    try {
      // Fallback to Supabase
      const supabase = createRouteHandlerClient({ cookies })
      
      const { data: products, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (supabaseError) {
        throw supabaseError
      }
      
      console.log(`✅ Found ${products?.length || 0} products from Supabase fallback`)
      
      return NextResponse.json({ 
        success: true, 
        products: products || [],
        count: products?.length || 0,
        source: 'supabase-fallback',
        mongodb_error: error.message
      })
    } catch (fallbackError: any) {
      console.error('Supabase fallback error:', fallbackError)
      return NextResponse.json({ 
        success: false, 
        error: 'Both MongoDB and Supabase failed',
        mongodb_error: error.message,
        supabase_error: fallbackError.message
      }, { status: 500 })
    } finally {
      if (client) {
        await client.close();
      }
    }
  }
}

