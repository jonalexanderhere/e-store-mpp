'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, CheckCircle, Clock, AlertCircle, ExternalLink, Github, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getCurrentUser } from '@/lib/auth'

import toast from 'react-hot-toast'

interface Notification {
  _id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: string
  orderId?: string
  order?: {
    _id: string
    status: string
    customerName: string
    websiteType: string
    repoUrl?: string
    demoUrl?: string
    fileStructure?: string
    notes?: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      // Fetch notifications from MongoDB
      const response = await fetch('/api/notifications')
      const data = await response.json()

      if (data.success) {
        setNotifications(data.notifications || [])
      } else {
        console.error('Error fetching notifications:', data.error)
      }

      setNotifications(data || [])
    } catch (error: any) {
      toast.error('Gagal memuat notifikasi')
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          await fetchNotifications()
        }
      } catch (error) {
        console.error('Error getting user:', error)
      }
    }

    getUser()
  }, [fetchNotifications])

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId, read: true })
      })

      const data = await response.json()
      if (!data.success) throw new Error(data.error)

      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      )
    } catch (error: any) {
      toast.error('Gagal menandai notifikasi sebagai dibaca')
    }
  }

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read (simplified for MongoDB)
      // TODO: Implement bulk update via API
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      )
      
      toast.success('Semua notifikasi ditandai sebagai dibaca')
    } catch (error: any) {
      toast.error('Gagal menandai semua notifikasi')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-blue-200 bg-blue-50'
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
          <p className="text-gray-600">Memuat notifikasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifikasi</h1>
          <p className="text-gray-600">Kelola notifikasi dan update pesanan Anda</p>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada notifikasi</h3>
              <p className="text-gray-500">Anda akan menerima notifikasi ketika ada update pesanan</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Semua Notifikasi ({notifications.length})
                </h2>
                <Badge variant="info">
                  {notifications.filter(n => !n.read).length} Belum dibaca
                </Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={markAllAsRead}
                disabled={notifications.every(n => n.read)}
              >
                Tandai Semua Dibaca
              </Button>
            </div>

            {notifications.map((notification) => (
              <Card 
                key={notification._id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'ring-2 ring-blue-500' : ''
                } ${getNotificationColor(notification.type)}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {notification.message}
                        </CardDescription>
                        <p className="text-sm text-gray-500 mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Badge variant="default" className="bg-blue-500">
                          Baru
                        </Badge>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => markAsRead(notification._id)}
                        disabled={notification.read}
                      >
                        {notification.read ? 'Dibaca' : 'Tandai Dibaca'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {notification.order && (
                  <CardContent className="pt-0">
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-3">Detail Pesanan</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Nama Pelanggan</p>
                          <p className="font-medium">{notification.order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Jenis Website</p>
                          <p className="font-medium">{notification.order.websiteType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <Badge 
                            variant={
                              notification.order.status === 'completed' ? 'success' :
                              notification.order.status === 'in_progress' ? 'warning' :
                              'info'
                            }
                          >
                            {notification.order.status === 'completed' ? 'Selesai' :
                             notification.order.status === 'in_progress' ? 'Diproses' :
                             notification.order.status === 'confirmed' ? 'Dikonfirmasi' :
                             'Menunggu'}
                          </Badge>
                        </div>
                      </div>

                      {notification.order.status === 'completed' && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-semibold text-gray-900 mb-3">🎉 Website Anda Sudah Selesai!</h5>
                          <div className="space-y-3">
                            {notification.order.repoUrl && (
                              <div className="flex items-center space-x-2">
                                <Github className="h-4 w-4 text-gray-500" />
                                <a 
                                  href={notification.order.repoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                >
                                  <span>Source Code GitHub</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {notification.order.demoUrl && (
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-gray-500" />
                                <a 
                                  href={notification.order.demoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                                >
                                  <span>Demo Website</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                            {notification.order.notes && (
                              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800">
                                  <strong>Catatan dari Admin:</strong> {notification.order.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
