'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface Cart {
  _id: string
  userId: string
  productId: string
  quantity: number
  product?: Product
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  isActive: boolean
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Cart[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login')
          return
        }
        setUser(currentUser)

        // Fetch cart items from MongoDB
        const response = await fetch('/api/cart')
        const data = await response.json()

        if (data.success) {
          setCartItems(data.cartItems || [])
        } else {
          console.error('Error fetching cart items:', data.error)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(cartId)
      return
    }

    setUpdating(cartId)
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cartId, quantity: newQuantity })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setCartItems(prev => 
        prev.map(item => 
          item._id === cartId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupdate kuantitas')
    } finally {
      setUpdating(null)
    }
  }

  const removeFromCart = async (cartId: string) => {
    setUpdating(cartId)
    try {
      const response = await fetch(`/api/cart?id=${cartId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setCartItems(prev => prev.filter(item => item._id !== cartId))
      toast.success('Produk dihapus dari keranjang')
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus produk')
    } finally {
      setUpdating(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Keranjang kosong')
      return
    }
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat keranjang...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
          <p className="mt-2 text-gray-600">
            Review produk yang akan Anda beli
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keranjang Kosong</h3>
              <p className="text-gray-500 mb-6">Belum ada produk di keranjang Anda</p>
              <Button onClick={() => router.push('/products')}>
                Lihat Produk
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item._id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product?.category}
                        </p>
                        <p className="text-lg font-semibold text-primary-600 mt-2">
                          {formatPrice(item.product?.price || 0)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={updating === item._id}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={updating === item._id}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromCart(item._id)}
                        disabled={updating === item._id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.length} item)</span>
                    <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak (10%)</span>
                    <span className="font-medium">{formatPrice(getTotalPrice() * 0.1)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary-600">
                        {formatPrice(getTotalPrice() * 1.1)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={proceedToCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Lanjut ke Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

