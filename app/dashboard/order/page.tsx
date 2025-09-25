'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface OrderForm {
  customer_name: string
  customer_email: string
  website_type: string
  requirements: string
}

const WEBSITE_TYPES = [
  'Website Perusahaan',
  'Website E-commerce',
  'Website Portfolio',
  'Website Landing Page',
  'Website Blog',
  'Website Custom'
]

export default function OrderPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<OrderForm>()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
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

  const onSubmit = async (data: OrderForm) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          website_type: data.website_type,
          requirements: data.requirements,
          status: 'pending'
        })

      if (error) throw error

      toast.success('Pesanan berhasil dibuat!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat pesanan')
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
          <h1 className="text-3xl font-bold text-gray-900">Buat Pesanan Baru</h1>
          <p className="mt-2 text-gray-600">
            Isi form di bawah ini untuk membuat pesanan website baru
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
            <CardDescription>
              Lengkapi informasi berikut untuk memulai proyek website Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Nama Lengkap"
                {...register('customer_name', {
                  required: 'Nama lengkap wajib diisi',
                  minLength: {
                    value: 2,
                    message: 'Nama minimal 2 karakter'
                  }
                })}
                error={errors.customer_name?.message}
              />

              <Input
                label="Email"
                type="email"
                {...register('customer_email', {
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid'
                  }
                })}
                error={errors.customer_email?.message}
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Jenis Website
                </label>
                <select
                  {...register('website_type', {
                    required: 'Jenis website wajib dipilih'
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">Pilih jenis website</option>
                  {WEBSITE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.website_type && (
                  <p className="text-sm text-red-600">{errors.website_type.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Detail Kebutuhan
                </label>
                <textarea
                  {...register('requirements', {
                    required: 'Detail kebutuhan wajib diisi',
                    minLength: {
                      value: 10,
                      message: 'Detail kebutuhan minimal 10 karakter'
                    }
                  })}
                  rows={6}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Jelaskan kebutuhan website Anda secara detail..."
                />
                {errors.requirements && (
                  <p className="text-sm text-red-600">{errors.requirements.message}</p>
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
                  {loading ? 'Memproses...' : 'Buat Pesanan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

