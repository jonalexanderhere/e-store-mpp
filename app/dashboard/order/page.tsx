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
import { Select } from '@/components/ui/Select'
import { FileText, User, Mail, Globe, MessageSquare, CheckCircle } from 'lucide-react'

interface OrderForm {
  customer_name: string
  customer_email: string
  customer_phone: string
  website_type: string
  requirements: string
  budget_range: string
  timeline: string
  additional_notes: string
}

const WEBSITE_TYPES = [
  'Website Perusahaan Profesional',
  'Website E-commerce Lengkap',
  'Website Portfolio Kreatif',
  'Landing Page Konversi Tinggi',
  'Website Blog Profesional',
  'Website Custom Enterprise'
]

const BUDGET_RANGES = [
  'Rp 1.000.000 - Rp 2.500.000',
  'Rp 2.500.000 - Rp 5.000.000',
  'Rp 5.000.000 - Rp 10.000.000',
  'Rp 10.000.000+',
  'Konsultasi terlebih dahulu'
]

const TIMELINES = [
  '1-2 minggu',
  '2-4 minggu',
  '1-2 bulan',
  '2-3 bulan',
  'Fleksibel'
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
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          user_id: user?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal membuat pesanan')
      }

      const result = await response.json()
      
      // Create notification for user
      await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          title: 'Pesanan Berhasil Dibuat!',
          message: `Pesanan website ${data.website_type} Anda telah berhasil dibuat dan sedang menunggu konfirmasi admin.`,
          type: 'success',
          order_id: result.id
        })

      toast.success('Pesanan berhasil dibuat! Anda akan menerima notifikasi update.')
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesan Website Custom</h1>
          <p className="text-gray-600">Isi form di bawah ini untuk memesan website sesuai kebutuhan Anda</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span>Form Pemesanan Website</span>
            </CardTitle>
            <CardDescription>
              Lengkapi semua informasi yang diperlukan untuk memproses pesanan Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Informasi Personal</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <Input
                      {...register('customer_name', { required: 'Nama lengkap wajib diisi' })}
                      placeholder="Masukkan nama lengkap Anda"
                      className={errors.customer_name ? 'border-red-500' : ''}
                    />
                    {errors.customer_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      {...register('customer_email', { 
                        required: 'Email wajib diisi',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Format email tidak valid'
                        }
                      })}
                      placeholder="contoh@email.com"
                      className={errors.customer_email ? 'border-red-500' : ''}
                    />
                    {errors.customer_email && (
                      <p className="text-red-500 text-sm mt-1">{errors.customer_email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon *
                  </label>
                  <Input
                    {...register('customer_phone', { required: 'Nomor telepon wajib diisi' })}
                    placeholder="+62 812-3456-7890"
                    className={errors.customer_phone ? 'border-red-500' : ''}
                  />
                  {errors.customer_phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
                  )}
                </div>
              </div>

              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Informasi Project</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Website *
                    </label>
                    <Select
                      {...register('website_type', { required: 'Jenis website wajib dipilih' })}
                      className={errors.website_type ? 'border-red-500' : ''}
                    >
                      <option value="">Pilih jenis website</option>
                      {WEBSITE_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                    {errors.website_type && (
                      <p className="text-red-500 text-sm mt-1">{errors.website_type.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget Range *
                    </label>
                    <Select
                      {...register('budget_range', { required: 'Budget range wajib dipilih' })}
                      className={errors.budget_range ? 'border-red-500' : ''}
                    >
                      <option value="">Pilih range budget</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </Select>
                    {errors.budget_range && (
                      <p className="text-red-500 text-sm mt-1">{errors.budget_range.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeline Pengerjaan *
                  </label>
                  <Select
                    {...register('timeline', { required: 'Timeline wajib dipilih' })}
                    className={errors.timeline ? 'border-red-500' : ''}
                  >
                    <option value="">Pilih timeline pengerjaan</option>
                    {TIMELINES.map((timeline) => (
                      <option key={timeline} value={timeline}>{timeline}</option>
                    ))}
                  </Select>
                  {errors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Detail Kebutuhan</span>
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detail Kebutuhan Website *
                  </label>
                  <textarea
                    {...register('requirements', { required: 'Detail kebutuhan wajib diisi' })}
                    rows={6}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.requirements ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Jelaskan detail kebutuhan website Anda, fitur-fitur yang diinginkan, target audience, dll."
                  />
                  {errors.requirements && (
                    <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan Tambahan
                  </label>
                  <textarea
                    {...register('additional_notes')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Catatan tambahan, referensi website, atau informasi lain yang relevan..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Data Anda akan diproses dengan aman</span>
                </div>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Pesanan'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}