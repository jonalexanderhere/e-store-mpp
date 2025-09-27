import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'




export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // For now, fetch all notifications. In a real app, you'd filter by user_id
    const notifications = await db.collection('notifications').find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      notifications: notifications
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    const body = await request.json()
    const { user_id, title, message, type, order_id } = body

    if (!user_id || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newNotification = {
      userId: user_id ? new ObjectId(user_id) : null, // Assuming userId is ObjectId
      title,
      message,
      type: type || 'info',
      orderId: order_id ? new ObjectId(order_id) : null, // Assuming orderId is ObjectId
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    const body = await request.json()
    const { notification_id, read } = body

    if (!notification_id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(notification_id) },
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
