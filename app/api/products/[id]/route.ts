import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Updating product in MongoDB...')
    
    const body = await request.json()
    const { isActive } = body
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(params.id) },
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
    
    console.log(`✅ Product updated: ${params.id}`)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Deleting product in MongoDB...')
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const result = await db.collection('products').deleteOne(
      { _id: new ObjectId(params.id) }
    )
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    console.log(`✅ Product deleted: ${params.id}`)
    
    return NextResponse.json({ 
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error: any) {
    console.error('MongoDB product delete error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
