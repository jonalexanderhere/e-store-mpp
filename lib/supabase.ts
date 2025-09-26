import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Avoid throwing at import time to prevent build-time failures on environments
// where env vars are not yet configured (e.g., Vercel preview). We will create
// the client only if both vars exist. Otherwise, export a noop proxy that throws
// with a clear message when actually used at runtime.
export const supabase = (() => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  const handler = {
    get() {
      throw new Error('Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    }
  }
  // Proxy keeps module import safe during build; using the object will throw
  return new Proxy({}, handler) as any
})()

// Database types
export interface User {
  id: string
  email: string
  role: 'admin' | 'customer'
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  customer_name: string
  customer_email: string
  website_type: string
  requirements: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed'
  payment_proof_url?: string
  repo_url?: string
  demo_url?: string
  file_structure?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Cart {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
}

export interface Transaction {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  payment_method?: string
  payment_proof_url?: string
  created_at: string
  updated_at: string
  items?: TransactionItem[]
}

export interface TransactionItem {
  id: string
  transaction_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

