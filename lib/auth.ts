import clientPromise from './mongodb'
import { IUser } from './mongodb-models'

// Simple session management (you might want to use JWT or sessions in production)
let currentUser: IUser | null = null

export async function signUp(email: string, password: string) {
  const client = await clientPromise
  const db = client.db('website-service')
  
  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ email })
  if (existingUser) {
    throw new Error('User already exists')
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
  
  return {
    user: {
      id: result.insertedId.toString(),
      email,
      role: 'customer'
    }
  }
}

export async function signIn(email: string, password: string) {
  const client = await clientPromise
  const db = client.db('website-service')
  
  const user = await db.collection('users').findOne({ email, password })
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Set current user
  currentUser = user
  
  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    }
  }
}

export async function signOut() {
  currentUser = null
}

export async function getCurrentUser(): Promise<IUser | null> {
  return currentUser
}

export async function getUserRole(): Promise<'admin' | 'customer' | null> {
  const user = await getCurrentUser()
  return user?.role || null
}


