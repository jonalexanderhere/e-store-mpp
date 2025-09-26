'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Order {
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
  createdAt: string
  updatedAt: string
}

interface ProjectDetailsForm {
  repo_url: string
  demo_url: string
  file_structure: string
  notes: string
}

export default function AdminOrderDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectDetailsForm>()

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

        // Fetch order from MongoDB
        const response = await fetch(`/api/orders/${params.id}`)
        const data = await response.json()
        
        if (data.order) {
          setOrder(data.order)
        } else {
          console.error('Error fetching order:', data.error)
          router.push('/admin/dashboard')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/admin/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, params.id])

  const updateOrderStatus = async (status: 'pending' | 'confirmed' | 'in_progress' | 'completed') => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      const data = await response.json()
      if (!data.order) throw new Error(data.error)

      setOrder(prev => prev ? { ...prev, status } : null)
      
      // Send notification to user
      let notificationTitle = ''
      let notificationMessage = ''
      let notificationType = 'info'

      switch (status) {
        case 'confirmed':
          notificationTitle = 'Pesanan Dikonfirmasi!'
          notificationMessage = `Pesanan website ${order?.website_type} Anda telah dikonfirmasi dan akan segera diproses.`
          notificationType = 'success'
          break
        case 'in_progress':
          notificationTitle = 'Pesanan Sedang Diproses!'
          notificationMessage = `Pesanan website ${order?.website_type} Anda sedang dalam proses pengerjaan. Tim kami akan memberikan update progress.`
          notificationType = 'info'
          break
        case 'completed':
          notificationTitle = 'Website Anda Sudah Selesai!'
          notificationMessage = `Pesanan website ${order?.website_type} Anda telah selesai! Silakan cek detail project untuk mengakses website dan source code.`
          notificationType = 'success'
          break
        default:
          notificationTitle = 'Update Status Pesanan'
          notificationMessage = `Status pesanan website ${order?.website_type} Anda telah diupdate.`
      }

      // Create notification via API
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: order?.userId,
          title: notificationTitle,
          message: notificationMessage,
          type: notificationType,
          orderId: order?._id
        })
      })

      toast.success(`Status pesanan berhasil diubah menjadi ${status}`)
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupdate status')
    } finally {
      setUpdating(false)
    }
  }

  const onSubmit = async (data: ProjectDetailsForm) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: data.repo_url,
          demoUrl: data.demo_url,
          fileStructure: data.file_structure,
          notes: data.notes
        })
      })

      const result = await response.json()
      if (!result.order) throw new Error(result.error)

      setOrder(prev => prev ? {
        ...prev,
        repo_url: data.repo_url,
        demo_url: data.demo_url,
        file_structure: data.file_structure,
        notes: data.notes
      } : null)

      toast.success('Detail proyek berhasil diupdate')
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupdate detail proyek')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Menunggu Konfirmasi</Badge>
      case 'confirmed':
        return <Badge variant="info">Diproses</Badge>
      case 'in_progress':
        return <Badge variant="info">Sedang Dikerjakan</Badge>
      case 'completed':
        return <Badge variant="success">Selesai</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const renderFileStructure = (structure: string) => {
    if (!structure) return null

    const lines = structure.split('\n')
    return (
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre>{lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}</pre>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat detail pesanan...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Pesanan yang Anda cari tidak ditemukan.</p>
          <Button onClick={() => router.push('/admin/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Pesanan</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Nama</label>
                  <p className="text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{order.customer_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Jenis Website</label>
                  <p className="text-gray-900">{order.websiteType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Kebutuhan</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{order.requirements}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dibuat</label>
                  <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Proof */}
            {order.paymentProofUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Bukti Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <Image
                      src={order.paymentProofUrl || '/placeholder-image.jpg'}
                      alt="Payment Proof"
                      width={400}
                      height={300}
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ubah Status</CardTitle>
                <CardDescription>
                  Klik tombol di bawah untuk mengubah status pesanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus('confirmed')}
                      loading={updating}
                      className="w-full"
                    >
                      Konfirmasi Pembayaran
                    </Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button
                      onClick={() => updateOrderStatus('in_progress')}
                      loading={updating}
                      className="w-full"
                    >
                      Mulai Pengerjaan
                    </Button>
                  )}
                  {order.status === 'in_progress' && (
                    <Button
                      onClick={() => updateOrderStatus('completed')}
                      loading={updating}
                      className="w-full"
                    >
                      Tandai Selesai
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Proyek</CardTitle>
                <CardDescription>
                  Isi detail proyek yang akan diberikan ke pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="URL Repository GitHub"
                    placeholder="https://github.com/username/repo"
                    {...register('repo_url', {
                      pattern: {
                        value: /^https?:\/\/github\.com\/.+/,
                        message: 'URL GitHub tidak valid'
                      }
                    })}
                    error={errors.repo_url?.message}
                    defaultValue={order.repo_url || ''}
                  />

                  <Input
                    label="URL Demo Website"
                    placeholder="https://demo-website.com"
                    {...register('demo_url', {
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'URL demo tidak valid'
                      }
                    })}
                    error={errors.demo_url?.message}
                    defaultValue={order.demo_url || ''}
                  />

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Struktur File Project
                    </label>
                    <textarea
                      {...register('file_structure')}
                      rows={8}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="project-root/
├── pages/
│   ├── index.js
│   ├── login.js
│   └── register.js
├── components/
│   └── Navbar.js
├── supabase/
│   └── client.js
└── package.json"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Catatan Tambahan
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Catatan atau instruksi tambahan untuk pelanggan..."
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={updating}
                    disabled={updating}
                    className="w-full"
                  >
                    {updating ? 'Menyimpan...' : 'Simpan Detail Proyek'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current Project Details */}
            {(order.repo_url || order.demo_url || order.file_structure || order.notes) && (
              <Card>
                <CardHeader>
                  <CardTitle>Detail Proyek Saat Ini</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.repo_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Repository GitHub</label>
                      <p className="text-gray-900 break-all">{order.repo_url}</p>
                    </div>
                  )}
                  {order.demo_url && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Demo Website</label>
                      <p className="text-gray-900 break-all">{order.demo_url}</p>
                    </div>
                  )}
                  {order.file_structure && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Struktur File</label>
                      {renderFileStructure(order.file_structure)}
                    </div>
                  )}
                  {order.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Catatan</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
