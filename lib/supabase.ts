import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client with fallback for missing environment variables
export const supabase = (() => {
  if (supabaseUrl && supabaseAnonKey) {
    return createClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Fallback for development or when env vars are not set
  console.warn('Supabase environment variables not set. Using fallback configuration.')
  
  // Return a mock client that doesn't throw errors
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signIn: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => Promise.resolve({ data: [], error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        upsert: () => Promise.resolve({ data: null, error: null })
      })
    })
  }
  
  return mockClient as any
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

