import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:5scP865PtNLctb4k@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority"

let isConnected = false

async function connectDB() {
  if (isConnected) {
    return mongoose
  }

  try {
    await mongoose.connect(MONGODB_URI!)
    isConnected = true
    console.log('MongoDB connected successfully')
    return mongoose
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default connectDB
