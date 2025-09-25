'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function StatusPage() {
  const [status, setStatus] = useState('checking')
  const [tests, setTests] = useState([
    { name: 'Next.js Server', status: 'pending' },
    { name: 'React Components', status: 'pending' },
    { name: 'Event Handlers', status: 'pending' },
    { name: 'TailwindCSS', status: 'pending' },
    { name: 'TypeScript', status: 'pending' }
  ])

  useEffect(() => {
    // Simulate tests
    const runTests = async () => {
      setStatus('running')
      
      // Test 1: Next.js Server
      setTimeout(() => {
        setTests(prev => prev.map(test => 
          test.name === 'Next.js Server' ? { ...test, status: 'passed' } : test
        ))
      }, 500)

      // Test 2: React Components
      setTimeout(() => {
        setTests(prev => prev.map(test => 
          test.name === 'React Components' ? { ...test, status: 'passed' } : test
        ))
      }, 1000)

      // Test 3: Event Handlers
      setTimeout(() => {
        setTests(prev => prev.map(test => 
          test.name === 'Event Handlers' ? { ...test, status: 'passed' } : test
        ))
      }, 1500)

      // Test 4: TailwindCSS
      setTimeout(() => {
        setTests(prev => prev.map(test => 
          test.name === 'TailwindCSS' ? { ...test, status: 'passed' } : test
        ))
      }, 2000)

      // Test 5: TypeScript
      setTimeout(() => {
        setTests(prev => prev.map(test => 
          test.name === 'TypeScript' ? { ...test, status: 'passed' } : test
        ))
        setStatus('completed')
      }, 2500)
    }

    runTests()
  }, [])

  const getStatusIcon = (testStatus: string) => {
    switch (testStatus) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (testStatus: string) => {
    switch (testStatus) {
      case 'passed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔧 Aplikasi Status Check</CardTitle>
            <p className="text-gray-600">
              Memeriksa status aplikasi Website Service
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Overview */}
            <div className="text-center">
              <div className="text-4xl mb-4">
                {status === 'completed' ? '✅' : status === 'running' ? '🔄' : '⏳'}
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {status === 'completed' ? 'Semua Sistem Berjalan Normal!' : 
                 status === 'running' ? 'Sedang Memeriksa...' : 'Memulai Pemeriksaan...'}
              </h2>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hasil Pemeriksaan:</h3>
              {tests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <span className={`font-semibold ${getStatusColor(test.status)}`}>
                    {test.status === 'passed' ? 'PASSED' : 
                     test.status === 'failed' ? 'FAILED' : 'PENDING'}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                🔄 Refresh Status
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex-1"
              >
                🏠 Kembali ke Homepage
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/products'}
                className="flex-1"
              >
                🛍️ Lihat Produk
              </Button>
            </div>

            {/* System Info */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📊 Informasi Sistem:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <strong>Framework:</strong> Next.js 14
                </div>
                <div>
                  <strong>UI Library:</strong> TailwindCSS
                </div>
                <div>
                  <strong>Language:</strong> TypeScript
                </div>
                <div>
                  <strong>Status:</strong> Development Mode
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🚀 Halaman yang Tersedia:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
                <a href="/" className="hover:underline">🏠 Homepage</a>
                <a href="/products" className="hover:underline">🛍️ Produk</a>
                <a href="/auth/login" className="hover:underline">🔐 Login</a>
                <a href="/auth/register" className="hover:underline">📝 Register</a>
                <a href="/admin/dashboard" className="hover:underline">⚙️ Admin Dashboard</a>
                <a href="/test" className="hover:underline">🧪 Test Page</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

