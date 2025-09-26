import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching products from Supabase...')
    
    // Use direct Supabase client instead of route handler client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not set. Returning mock products.')
      
      // Return mock products when Supabase is not configured
      const mockProducts = [
        {
          id: '1',
          name: 'Website Portofolio',
          description: 'Paket website portofolio profesional untuk menampilkan profil dan karya Anda.',
          price: 10000,
          category: 'Portfolio',
          features: ['Desain Modern', 'Galeri Proyek', 'Form Kontak', 'Integrasi Media Sosial'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Website E-commerce',
          description: 'Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.',
          price: 40000,
          category: 'E-commerce',
          features: ['Katalog Produk', 'Keranjang Belanja', 'Checkout', 'Manajemen Pesanan', 'Integrasi Pembayaran'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Website Sistem Informasi Sekolah',
          description: 'Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.',
          price: 30000,
          category: 'Sistem Informasi',
          features: ['Manajemen Siswa', 'Manajemen Guru', 'Pengumuman', 'Jadwal Pelajaran', 'Galeri'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      return NextResponse.json({ 
        success: true, 
        products: mockProducts,
        count: mockProducts.length,
        source: 'mock-fallback'
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    console.log(`✅ Found ${products?.length || 0} products from Supabase`)
    
    return NextResponse.json({ 
      success: true, 
      products: products || [],
      count: products?.length || 0,
      source: 'supabase'
    })
  } catch (error: any) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}