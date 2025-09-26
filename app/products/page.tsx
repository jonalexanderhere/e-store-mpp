'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { ShoppingCart, Star, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        // Fetch products from Supabase (more reliable)
        console.log('Fetching products from Supabase API...')
        const response = await fetch('/api/products')
        const data = await response.json()
        
        console.log('API Response:', data)
        
        if (data.success) {
          setProducts(data.products || [])
          console.log('Products loaded:', data.products?.length || 0)
        } else {
          console.error('Error fetching products:', data.error)
          console.error('Error details:', data.details)
          // Set empty products array on error
          setProducts([])
        }

        // Fetch cart count from Supabase (still using Supabase for cart)
        if (currentUser) {
          const { count } = await supabase
            .from('cart')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentUser.id)
          
          setCartCount(count || 0)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const addToCart = async (productId: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return
    }

    try {
      const { error } = await supabase
        .from('cart')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        })

      if (error) throw error

      toast.success('Produk ditambahkan ke keranjang')
      setCartCount(prev => prev + 1)
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan ke keranjang')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Produk Website</h1>
          <p className="mt-2 text-gray-600">
            Pilih paket website yang sesuai dengan kebutuhan bisnis Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada produk tersedia
              </h3>
              <p className="text-gray-500 mb-4">
                Produk akan segera ditambahkan. Silakan kembali lagi nanti.
              </p>
              <div className="text-sm text-gray-400">
                <p>Debug info: Loading state selesai, products array kosong</p>
                <p>Silakan cek console browser untuk detail error</p>
              </div>
            </div>
          ) : (
            products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="info">{product.category}</Badge>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                  </div>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Fitur yang disertakan:</h4>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => addToCart(product.id)}
                    className="w-full"
                    disabled={!user}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {user ? 'Tambah ke Keranjang' : 'Login untuk Membeli'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

