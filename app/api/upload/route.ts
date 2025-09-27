import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file || !orderId) {
      return NextResponse.json({ error: 'File and orderId are required' }, { status: 400 })
    }

    // For now, just return a mock file path
    // TODO: Implement proper file upload to cloud storage (AWS S3, Cloudinary, etc.)
    const fileExt = file.name.split('.').pop()
    const fileName = `${orderId}-payment-proof.${fileExt}`
    const filePath = `uploads/payment-proofs/${fileName}`

    // Update order with payment proof URL in MongoDB
    const client = await clientPromise
    const db = client.db('website-service')
    
    await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          paymentProofUrl: filePath,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ 
      success: true, 
      filePath,
      message: 'File uploaded successfully' 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

