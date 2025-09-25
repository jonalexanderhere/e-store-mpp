import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, Code, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Jasa Pembuatan
              <span className="text-primary-600"> Website Profesional</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Dapatkan website berkualitas tinggi dengan fitur modern dan desain responsif untuk bisnis Anda.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full">
                    Mulai Sekarang
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Mengapa Memilih Kami?</h2>
            <p className="mt-4 text-lg text-gray-500">
              Kami menyediakan layanan pembuatan website dengan standar profesional
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Code className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-lg">Teknologi Modern</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Menggunakan teknologi terbaru seperti React, Next.js, dan framework modern lainnya
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Zap className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-lg">Cepat & Responsif</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Website yang dioptimalkan untuk kecepatan dan tampilan sempurna di semua perangkat
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-lg">Keamanan Terjamin</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Implementasi keamanan terbaik untuk melindungi data dan privasi pengguna
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-lg">Support 24/7</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Tim support siap membantu Anda kapan saja untuk memastikan website berjalan optimal
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Siap Memulai Proyek Website Anda?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Daftar sekarang dan dapatkan website profesional untuk bisnis Anda
            </p>
            <div className="mt-8">
              <Link href="/auth/register">
                <Button size="lg" variant="secondary">
                  Daftar Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


