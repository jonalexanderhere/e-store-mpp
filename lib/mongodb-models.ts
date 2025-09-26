import mongoose, { Schema, Document } from 'mongoose'

// User Schema
export interface IUser extends Document {
  _id: string
  email: string
  role: 'admin' | 'customer'
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
})

// Order Schema
export interface IOrder extends Document {
  _id: string
  userId: string
  customerName: string
  customerEmail: string
  websiteType: string
  requirements: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed'
  paymentProofUrl?: string
  repoUrl?: string
  demoUrl?: string
  fileStructure?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  userId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  websiteType: { type: String, required: true },
  requirements: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in_progress', 'completed'], 
    default: 'pending' 
  },
  paymentProofUrl: String,
  repoUrl: String,
  demoUrl: String,
  fileStructure: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Product Schema
export interface IProduct extends Document {
  _id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  features: [String],
  imageUrl: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Notification Schema
export interface INotification extends Document {
  _id: string
  userId: string
  title: string
  message: string
  type: string
  orderId?: string
  read: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  orderId: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

// Transaction Schema
export interface ITransaction extends Document {
  _id: string
  userId: string
  totalAmount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  paymentMethod?: string
  paymentProofUrl?: string
  createdAt: Date
  updatedAt: Date
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  paymentMethod: String,
  paymentProofUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Transaction Item Schema
export interface ITransactionItem extends Document {
  _id: string
  transactionId: string
  productId: string
  quantity: number
  price: number
  createdAt: Date
}

const TransactionItemSchema = new Schema<ITransactionItem>({
  transactionId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
})

// Cart Schema
export interface ICart extends Document {
  _id: string
  userId: string
  productId: string
  quantity: number
  createdAt: Date
}

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
})

// Create models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)
export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)
export const TransactionItem = mongoose.models.TransactionItem || mongoose.model<ITransactionItem>('TransactionItem', TransactionItemSchema)
export const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema)
