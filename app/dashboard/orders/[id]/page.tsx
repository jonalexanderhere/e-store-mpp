'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Upload, ExternalLink, Github, FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

import { Button } from '@/components/ui/Button'
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

export default function OrderDetailPage() {
  const [user, setUser] = useState<any>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const waNumber = '6282181183590'
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
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
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, params.id])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${order?._id}-payment-proof.${fileExt}`
      const filePath = `payment-proofs/${fileName}`

      // Upload file via API
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', order?._id || '')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const uploadData = await uploadResponse.json()
      if (!uploadData.success) throw new Error(uploadData.error)

      // Refresh order data
      const response = await fetch(`/api/orders/${order?._id}`)
      const data = await response.json()
      
      if (data.order) {
        setOrder(data.order)
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />
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
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Pesanan yang Anda cari tidak ditemukan atau tidak memiliki akses.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Detail Pesanan</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span>Status Pesanan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {getStatusBadge(order.status)}
                <p className="text-sm text-gray-500">
                  Dibuat: {new Date(order.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nama</label>
                <p className="text-gray-900">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{order.customerEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Jenis Website</label>
                <p className="text-gray-900">{order.websiteType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Kebutuhan</label>
                <p className="text-gray-900 whitespace-pre-wrap">{order.requirements}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          {order.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Konfirmasi Pembayaran</CardTitle>
                <CardDescription>
                  Kirim bukti transfer via WhatsApp atau upload di sini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
                    Setelah mengirim bukti, status akan menjadi <span className="font-semibold">menunggu verifikasi</span>.
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button as-child variant="outline">
                      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">Kirim Bukti via WhatsApp</a>
                    </Button>
                    <div>
                      <input
                        type="file"
                        id="payment-proof"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="payment-proof">
                        <Button
                          variant="outline"
                          loading={uploading}
                          disabled={uploading}
                          className="cursor-pointer w-full"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Mengupload...' : 'Upload Bukti'}
                        </Button>
                      </label>
                    </div>
                  </div>
                  {order.paymentProofUrl && (
                    <div className="text-center py-2">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-green-600 font-medium">Bukti pembayaran telah diupload</p>
                      <p className="text-sm text-gray-500">Menunggu konfirmasi admin</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          {(order.status === 'confirmed' || order.status === 'in_progress' || order.status === 'completed') && (
            <>
              {order.repoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Repository GitHub</CardTitle>
                    <CardDescription>
                      Link ke repository GitHub proyek Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={order.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Lihat Repository
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              )}

              {order.demoUrl && (
                <Card>
                  <CardHeader>
                    <CardTitle>Demo Website</CardTitle>
                    <CardDescription>
                      Link ke demo website Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={order.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Lihat Demo Website
                    </a>
                  </CardContent>
                </Card>
              )}

              {order.fileStructure && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Struktur File Project
                    </CardTitle>
                    <CardDescription>
                      Struktur file dan folder dalam proyek Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderFileStructure(order.fileStructure)}
                  </CardContent>
                </Card>
              )}

              {/* Required Format Section */}
              {order.status === 'confirmed' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Data yang Wajib Diisi</CardTitle>
                    <CardDescription>
                      Lengkapi format berikut agar proses pengerjaan dapat dimulai
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-800">
                      <p className="font-medium mb-2">Silakan kirim data berikut ke WhatsApp 0821-8118-3590:</p>
                      <pre className="whitespace-pre-wrap">
Nama Bisnis/Instansi:
Nama Domain (jika ada):
Logo (jika ada):
Warna Utama yang Diinginkan:
Menu/Pages yang Dibutuhkan:
Konten Singkat per Halaman:
Kontak/Alamat/Email:
Referensi Desain (opsional):
Catatan Tambahan:
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Catatan Tambahan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900 whitespace-pre-wrap">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

