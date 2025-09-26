import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User already exists' 
      }, { status: 400 })
    }
    
    // Create new user
    const newUser = {
      email,
      password, // In production, hash this password
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('users').insertOne(newUser)
    
    return NextResponse.json({ 
      success: true,
      user: {
        id: result.insertedId.toString(),
        email,
        role: 'customer'
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
