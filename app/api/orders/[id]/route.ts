import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    
    const order = await db.collection('orders').findOne({ _id: params.id })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('website-service')
    
    const body = await request.json()
    const { status, repoUrl, demoUrl, fileStructure, notes } = body

    const updateData: any = { updatedAt: new Date() }
    if (status) updateData.status = status
    if (repoUrl) updateData.repoUrl = repoUrl
    if (demoUrl) updateData.demoUrl = demoUrl
    if (fileStructure) updateData.fileStructure = fileStructure
    if (notes) updateData.notes = notes

    const result = await db.collection('orders').updateOne(
      { _id: params.id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const updatedOrder = await db.collection('orders').findOne({ _id: params.id })

    return NextResponse.json({ order: updatedOrder })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

