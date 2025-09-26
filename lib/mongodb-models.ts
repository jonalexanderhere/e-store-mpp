import mongoose, { Document, Schema } from 'mongoose'

// User Model
export interface IUser extends Document {
  _id: string
  email: string
  password: string
  role: 'admin' | 'customer'
  name?: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  name: { type: String },
  phone: { type: String },
}, { timestamps: true })

// Product Model
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
  features: [{ type: String }],
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Order Model
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
  status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed'], default: 'pending' },
  paymentProofUrl: { type: String },
  repoUrl: { type: String },
  demoUrl: { type: String },
  fileStructure: { type: String },
  notes: { type: String },
}, { timestamps: true })

// Cart Model
export interface ICart extends Document {
  _id: string
  userId: string
  productId: string
  quantity: number
  createdAt: Date
  updatedAt: Date
}

const CartSchema = new Schema<ICart>({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true })

// Notification Model
export interface INotification extends Document {
  _id: string
  userId: string
  title: string
  message: string
  type: string
  orderId?: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  orderId: { type: String },
  read: { type: Boolean, default: false },
}, { timestamps: true })

// Export models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
export const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema)
export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)
