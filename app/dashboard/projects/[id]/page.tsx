'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter, useParams } from 'next/navigation'
import { ExternalLink, Github, FileText, Globe, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Project {
  id: string
  customer_name: string
  customer_email: string
  website_type: string
  requirements: string
  status: string
  repo_url?: string
  demo_url?: string
  file_structure?: string
  notes?: string
  created_at: string
  updated_at: string
}

export default function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
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

        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', currentUser.id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            router.push('/dashboard')
            return
          }
          throw error
        }

        setProject(data)
      } catch (error: any) {
        console.error('Error fetching project:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, params.id])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'in_progress':
        return 'Sedang Diproses'
      case 'confirmed':
        return 'Dikonfirmasi'
      case 'pending':
        return 'Menunggu Konfirmasi'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Project yang Anda cari tidak ditemukan atau tidak memiliki akses.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Detail Project</h1>
          <p className="text-gray-600">Informasi lengkap tentang project website Anda</p>
        </div>

        <div className="space-y-6">
          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {getStatusIcon(project.status)}
                <span>Status Project</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusText(project.status)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    {project.status === 'completed' 
                      ? 'Website Anda sudah selesai dan siap digunakan!'
                      : project.status === 'in_progress'
                      ? 'Tim kami sedang mengerjakan website Anda.'
                      : project.status === 'confirmed'
                      ? 'Pesanan Anda telah dikonfirmasi dan akan segera diproses.'
                      : 'Pesanan Anda sedang menunggu konfirmasi admin.'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Dibuat</p>
                  <p className="font-medium">{formatDate(project.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Project</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Pelanggan</p>
                  <p className="font-medium">{project.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{project.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis Website</p>
                  <p className="font-medium">{project.website_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Terakhir Diupdate</p>
                  <p className="font-medium">{formatDate(project.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Kebutuhan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="whitespace-pre-wrap">{project.requirements}</p>
              </div>
            </CardContent>
          </Card>

          {/* Project Deliverables - Only show if completed */}
          {project.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span>🎉 Website Anda Sudah Selesai!</span>
                </CardTitle>
                <CardDescription>
                  Berikut adalah detail project yang telah diselesaikan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* GitHub Repository */}
                {project.repo_url && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Github className="h-6 w-6 text-gray-700" />
                      <h3 className="text-lg font-semibold">Source Code GitHub</h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Akses source code lengkap website Anda di repository GitHub berikut:
                    </p>
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span>Buka Repository</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {/* Demo Website */}
                {project.demo_url && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Globe className="h-6 w-6 text-gray-700" />
                      <h3 className="text-lg font-semibold">Demo Website</h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Lihat website Anda yang sudah live di URL berikut:
                    </p>
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <span>Buka Website</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {/* File Structure */}
                {project.file_structure && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="h-6 w-6 text-gray-700" />
                      <h3 className="text-lg font-semibold">Struktur File Project</h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Berikut adalah struktur file project website Anda:
                    </p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{project.file_structure}</pre>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {project.notes && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      💬 Catatan dari Tim Inspiraproject
                    </h3>
                    <p className="text-green-700 whitespace-pre-wrap">{project.notes}</p>
                  </div>
                )}

                {/* Congratulations Message */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🎉 Selamat! Website Anda Sudah Siap!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Terima kasih telah mempercayai Inspiraproject untuk mewujudkan website impian Anda. 
                    Jika ada pertanyaan atau butuh bantuan, jangan ragu untuk menghubungi tim support kami.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => router.push('/dashboard')}
                      variant="outline"
                    >
                      Kembali ke Dashboard
                    </Button>
                    <Button
                      onClick={() => router.push('/products')}
                    >
                      Pesan Website Lain
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Message for In Progress */}
          {project.status === 'in_progress' && (
            <Card>
              <CardContent className="pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Website Sedang Diproses
                  </h3>
                  <p className="text-yellow-700">
                    Tim kami sedang mengerjakan website Anda. Anda akan menerima notifikasi 
                    ketika website sudah selesai dan siap digunakan.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
