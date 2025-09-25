'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Page - Aplikasi Berjalan!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Jika Anda melihat halaman ini, berarti aplikasi sudah berjalan dengan baik!
            </p>
            
            <div className="flex items-center space-x-4">
              <Button onClick={() => setCount(count + 1)}>
                Klik Saya ({count})
              </Button>
              <Button variant="outline" onClick={() => setCount(0)}>
                Reset
              </Button>
            </div>
            
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <h3 className="font-semibold text-green-800">✅ Status Aplikasi:</h3>
              <ul className="mt-2 text-sm text-green-700">
                <li>• Next.js 14 berjalan dengan baik</li>
                <li>• TailwindCSS styling aktif</li>
                <li>• React hooks berfungsi</li>
                <li>• Event handlers bekerja</li>
                <li>• Client components aktif</li>
              </ul>
            </div>
            
            <div className="mt-4 p-4 bg-blue-100 rounded-lg">
              <h3 className="font-semibold text-blue-800">🚀 Fitur yang Tersedia:</h3>
              <ul className="mt-2 text-sm text-blue-700">
                <li>• <a href="/products" className="underline">Halaman Produk</a> - Browse produk website</li>
                <li>• <a href="/auth/login" className="underline">Login</a> - Masuk ke akun</li>
                <li>• <a href="/auth/register" className="underline">Register</a> - Daftar akun baru</li>
                <li>• <a href="/admin/dashboard" className="underline">Admin Dashboard</a> - Kelola sistem</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

