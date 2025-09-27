import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'




export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    
    // TODO: Implement proper authentication

    // For now, fetch all cart items. In a real app, you'd filter by user_id
    const cartItems = await db.collection('cart').aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      }
    ]).toArray()

    return NextResponse.json({
      success: true,
      cartItems: cartItems
    })
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
    const { userId, productId, quantity } = body

    if (!userId || !productId || !quantity) {
      return NextResponse.json({ error: 'userId, productId, and quantity are required' }, { status: 400 })
    }

    const existingCartItem = await db.collection('cart').findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId)
    })

    let result;
    if (existingCartItem) {
      result = await db.collection('cart').updateOne(
        { _id: existingCartItem._id },
        { $inc: { quantity: quantity }, $set: { updatedAt: new Date() } }
      )
    } else {
      result = await db.collection('cart').insertOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully',
      result
    })
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Cart item ID is required' }, { status: 400 })
    }

    const result = await db.collection('cart').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart item deleted successfully'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

