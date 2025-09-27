import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching notifications from MongoDB with enhanced TLS config...')
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    // For now, fetch all notifications. In a real app, you'd filter by user_id
    const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      notifications: notifications
    })
  } catch (error: any) {
    console.error('MongoDB notifications fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating notification in MongoDB with enhanced TLS config...')
    
    const client = await clientPromise
    const db = client.db('website-service')

    const body = await request.json()
    const { userId, title, message, type, orderId } = body

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newNotification = {
      userId: userId ? new ObjectId(userId) : null,
      title,
      message,
      type: type || 'info',
      orderId: orderId ? new ObjectId(orderId) : null,
      read: false,
      createdAt: new Date()
    }

    const result = await db.collection('notifications').insertOne(newNotification)

    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      notification: { _id: result.insertedId, ...newNotification }
    })
  } catch (error: any) {
    console.error('MongoDB notification create error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Updating notification in MongoDB with enhanced TLS config...')
    
    const client = await clientPromise
    const db = client.db('website-service')

    const body = await request.json()
    const { id, read } = body

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(id) },
      { $set: { read, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification updated successfully'
    })
  } catch (error: any) {
    console.error('MongoDB notification update error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}