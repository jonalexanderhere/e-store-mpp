'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { Eye, CheckCircle, XCircle, Clock, Users, FileText, DollarSign } from 'lucide-react'
import { getCurrentUser, getUserRole } from '@/lib/auth'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'


export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  })
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

        // Fetch all orders
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(data || [])

        // Calculate stats
        const list: Order[] = (data as Order[]) || []
        const total = list.length
        const pending = list.filter((o: Order) => o.status === 'pending').length
        const confirmed = list.filter((o: Order) => o.status === 'confirmed' || o.status === 'in_progress').length
        const completed = list.filter((o: Order) => o.status === 'completed').length

        setStats({ total, pending, confirmed, completed })
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat dashboard admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Kelola semua pesanan dan proyek website
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Pesanan</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Menunggu Konfirmasi</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Diproses</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.confirmed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Selesai</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending */}
          <Card>
            <CardHeader>
              <CardTitle>Menunggu Verifikasi</CardTitle>
              <CardDescription>Butuh cek pembayaran</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.filter(o => o.status === 'pending').length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada pesanan</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'pending').map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{order.website_type}</p>
                          <p className="text-xs text-gray-500">{order.customer_name} • {order.customer_email}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                        >
                          Kelola
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* In Progress (confirmed + in_progress) */}
          <Card>
            <CardHeader>
              <CardTitle>Sedang Diproses</CardTitle>
              <CardDescription>Pesanan yang aktif</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.filter(o => o.status === 'confirmed' || o.status === 'in_progress').length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada pesanan</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'confirmed' || o.status === 'in_progress').map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{order.website_type}</p>
                          <p className="text-xs text-gray-500">{order.customer_name} • {order.customer_email}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                        >
                          Kelola
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed */}
          <Card>
            <CardHeader>
              <CardTitle>Selesai</CardTitle>
              <CardDescription>Pesanan yang sudah beres</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.filter(o => o.status === 'completed').length === 0 ? (
                <p className="text-sm text-gray-500">Tidak ada pesanan</p>
              ) : (
                <div className="space-y-3">
                  {orders.filter(o => o.status === 'completed').map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{order.website_type}</p>
                          <p className="text-xs text-gray-500">{order.customer_name} • {order.customer_email}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                        >
                          Kelola
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

