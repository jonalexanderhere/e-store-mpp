'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        const userRole = await getUserRole()
        
        if (!currentUser || userRole !== 'admin') {
          router.push('/auth/login')
          return
        }
        setUser(currentUser)

        // Fetch all products from MongoDB
        const response = await fetch('/api/products')
        const data = await response.json()
        
        if (data.success) {
          setProducts(data.products || [])
        } else {
          console.error('Error fetching products:', data.error)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    setUpdating(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setProducts(prev => 
        prev.map(product => 
          product._id === productId 
            ? { ...product, isActive: !currentStatus }
            : product
        )
      )

      toast.success(`Produk ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`)
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupdate status produk')
    } finally {
      setUpdating(null)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return
    }

    setUpdating(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setProducts(prev => prev.filter(product => product._id !== productId))
      toast.success('Produk berhasil dihapus')
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kelola Produk</h1>
              <p className="mt-2 text-gray-600">
                Kelola semua produk website yang tersedia
              </p>
            </div>
            <Button onClick={() => router.push('/admin/products/new')}>
              <Plus className="h-5 w-5 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={product.isActive ? 'success' : 'warning'}>
                    {product.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProductStatus(product._id, product.isActive)}
                      loading={updating === product._id}
                      disabled={updating === product._id}
                    >
                      {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProduct(product._id)}
                      loading={updating === product._id}
                      disabled={updating === product._id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Kategori</span>
                    <Badge variant="info">{product.category}</Badge>
                  </div>
                  
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPrice(product.price)}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Fitur:</h4>
                    <ul className="space-y-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {feature}
                        </li>
                      ))}
                      {product.features.length > 3 && (
                        <li className="text-sm text-gray-500">
                          +{product.features.length - 3} fitur lainnya
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Dibuat: {new Date(product.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Belum ada produk</p>
              <Button onClick={() => router.push('/admin/products/new')}>
                <Plus className="h-5 w-5 mr-2" />
                Tambah Produk Pertama
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

