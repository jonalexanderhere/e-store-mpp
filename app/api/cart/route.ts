import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'




export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    
    // TODO: Implement proper authentication

    // TODO: Add authentication check

    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error)

    return NextResponse.json({ cart: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    
    // TODO: Implement proper authentication

    // TODO: Add authentication check

    const body = await request.json()
    const { product_id, quantity = 1 } = body

    const { data, error } = await supabase
      .from('cart')
      .upsert({
        user_id: session.user.id,
        product_id,
        quantity
      })
      .select()
      .single()

    if (error) throw new Error(error)

    return NextResponse.json({ cart: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    
    // TODO: Implement proper authentication

    // TODO: Add authentication check

    const { searchParams } = new URL(request.url)
    const cart_id = searchParams.get('cart_id')

    if (!cart_id) {
      return NextResponse.json({ error: 'Cart ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cart_id)
      .eq('user_id', session.user.id)

    if (error) throw new Error(error)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

