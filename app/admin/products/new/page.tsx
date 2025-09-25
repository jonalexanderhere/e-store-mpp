'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import toast from 'react-hot-toast'

interface ProductForm {
  name: string
  description: string
  price: number
  category: string
  features: string
}

const CATEGORIES = [
  'Website Perusahaan',
  'E-commerce',
  'Portfolio',
  'Landing Page',
  'Blog',
  'Custom'
]

export default function NewProductPage() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        const userRole = await getUserRole()
        
        if (!currentUser || userRole !== 'admin') {
          router.push('/auth/login')
          return
        }
        setUser(currentUser)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/auth/login')
      }
    }

    fetchUser()
  }, [router])

  const onSubmit = async (data: ProductForm) => {
    setLoading(true)
    try {
      // Parse features from comma-separated string
      const features = data.features
        .split(',')
        .map(feature => feature.trim())
        .filter(feature => feature.length > 0)

      const { error } = await supabase
        .from('products')
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          features: features,
          is_active: true
        })

      if (error) throw error

      toast.success('Produk berhasil ditambahkan')
      router.push('/admin/products')
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan produk')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
          <p className="mt-2 text-gray-600">
            Isi informasi produk website yang akan ditambahkan
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
            <CardDescription>
              Lengkapi informasi produk website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Nama Produk"
                {...register('name', {
                  required: 'Nama produk wajib diisi',
                  minLength: {
                    value: 3,
                    message: 'Nama produk minimal 3 karakter'
                  }
                })}
                error={errors.name?.message}
                placeholder="Contoh: Website Perusahaan Profesional"
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Deskripsi Produk
                </label>
                <textarea
                  {...register('description', {
                    required: 'Deskripsi produk wajib diisi',
                    minLength: {
                      value: 10,
                      message: 'Deskripsi minimal 10 karakter'
                    }
                  })}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Jelaskan detail produk website..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Harga (Rupiah)"
                  type="number"
                  {...register('price', {
                    required: 'Harga wajib diisi',
                    min: {
                      value: 100000,
                      message: 'Harga minimal Rp 100.000'
                    }
                  })}
                  error={errors.price?.message}
                  placeholder="2500000"
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Kategori
                  </label>
                  <select
                    {...register('category', {
                      required: 'Kategori wajib dipilih'
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Pilih kategori</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Fitur Produk (pisahkan dengan koma)
                </label>
                <textarea
                  {...register('features', {
                    required: 'Fitur produk wajib diisi'
                  })}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Responsive Design, SEO Optimized, Contact Form, Admin Panel, 5 Pages"
                />
                <p className="text-sm text-gray-500">
                  Pisahkan setiap fitur dengan koma (,)
                </p>
                {errors.features && (
                  <p className="text-sm text-red-600">{errors.features.message}</p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Produk'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

