import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { CheckCircle, Code, Zap, Shield, Star, ArrowRight, Sparkles, Globe, ShoppingCart, Users, Award, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Inspiraproject - Solusi Digital Terpercaya
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Jasa Pembuatan Website
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Profesional & Modern
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transformasikan bisnis Anda dengan website yang memukau. Dari website perusahaan hingga e-commerce, 
              kami menghadirkan solusi digital yang tepat untuk kebutuhan bisnis Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard/order">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Globe className="h-5 w-5 mr-2" />
                  Pesan Website Sekarang
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 hover:bg-blue-50 transition-all duration-300">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Lihat Produk Website
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Website Berhasil Dibuat</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">Tingkat Kepuasan Klien</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-gray-600">Support & Maintenance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Inspiraproject?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menghadirkan solusi website yang tidak hanya indah, tetapi juga fungsional dan berkinerja tinggi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Teknologi Terdepan</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Menggunakan framework modern seperti Next.js, React, dan teknologi terbaru untuk performa optimal.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Performa Tinggi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Website dengan loading cepat, SEO optimized, dan mobile-friendly untuk pengalaman terbaik.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Keamanan Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Sistem keamanan berlapis dengan SSL, enkripsi data, dan backup otomatis untuk perlindungan maksimal.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Support 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Tim support profesional siap membantu Anda kapan saja dengan response time yang cepat.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi lengkap untuk semua kebutuhan website bisnis Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Website Perusahaan</CardTitle>
                <CardDescription className="text-lg">
                  Website profesional untuk meningkatkan kredibilitas dan kepercayaan pelanggan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Desain Responsif & Modern
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    SEO Optimized
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Admin Panel
                  </li>
                </ul>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-blue-600">Mulai dari Rp 2.5jt</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Website E-commerce</CardTitle>
                <CardDescription className="text-lg">
                  Platform toko online lengkap dengan sistem pembayaran dan manajemen produk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Shopping Cart & Checkout
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Payment Gateway
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Inventory Management
                  </li>
                </ul>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-purple-600">Mulai dari Rp 5jt</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Website Custom</CardTitle>
                <CardDescription className="text-lg">
                  Solusi khusus sesuai kebutuhan bisnis dengan fitur yang disesuaikan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom Features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    API Integration
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Scalable Architecture
                  </li>
                </ul>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-green-600">Mulai dari Rp 8jt</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memulai Proyek Website Anda?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Dapatkan website profesional yang akan membantu bisnis Anda berkembang. 
            Konsultasi gratis dengan tim ahli kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/order">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                <Globe className="h-5 w-5 mr-2" />
                Pesan Website Sekarang
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Lihat Produk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apa Kata Klien Kami?
            </h2>
            <p className="text-xl text-gray-600">
              Kepuasan klien adalah prioritas utama kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Website yang dibuat sangat profesional dan sesuai dengan kebutuhan bisnis kami. 
                  Tim Inspiraproject sangat responsif dan membantu."
                </p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-gray-500">CEO, TechStart</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "E-commerce website yang dibuat sangat user-friendly dan conversion rate kami meningkat drastis. 
                  Highly recommended!"
                </p>
                <div className="font-semibold">Michael Chen</div>
                <div className="text-sm text-gray-500">Owner, FashionStore</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Support 24/7 yang sangat membantu. Website selalu uptime dan performa sangat baik. 
                  Terima kasih Inspiraproject!"
                </p>
                <div className="font-semibold">Lisa Wang</div>
                <div className="text-sm text-gray-500">Director, DigitalAgency</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}