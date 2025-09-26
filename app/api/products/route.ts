import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching products from Supabase...')
    
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    console.log(`✅ Found ${products?.length || 0} products from Supabase`)
    
    return NextResponse.json({ 
      success: true, 
      products: products || [],
      count: products?.length || 0,
      source: 'supabase'
    })
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}