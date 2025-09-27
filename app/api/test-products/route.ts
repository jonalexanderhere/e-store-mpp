import { NextRequest, NextResponse } from 'next/server'

// Simple test API that always returns mock data
export async function GET(request: NextRequest) {
  console.log('🔍 Fetching test products (mock data)...')
  
  const mockProducts = [
    {
      _id: 'test-1',
      name: 'Website Portofolio',
      description: 'Paket website portofolio profesional untuk menampilkan profil dan karya Anda.',
      price: 10000,
      category: 'Portfolio',
      features: ['Desain Modern', 'Galeri Proyek', 'Form Kontak', 'Integrasi Media Sosial'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'test-2',
      name: 'Website E-commerce',
      description: 'Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.',
      price: 40000,
      category: 'E-commerce',
      features: ['Katalog Produk', 'Keranjang Belanja', 'Checkout', 'Manajemen Pesanan', 'Integrasi Pembayaran'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: 'test-3',
      name: 'Website Sistem Informasi Sekolah',
      description: 'Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.',
      price: 30000,
      category: 'Sistem Informasi',
      features: ['Manajemen Siswa', 'Manajemen Guru', 'Pengumuman', 'Jadwal Pelajaran', 'Galeri'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
  
  return NextResponse.json({ 
    success: true, 
    products: mockProducts,
    count: mockProducts.length,
    source: 'test-mock'
  })
}
