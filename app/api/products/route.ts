import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Mock data for fallback
const mockProducts = [
  {
    _id: 'mock-1',
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
    _id: 'mock-2',
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
    _id: 'mock-3',
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

export async function GET(request: NextRequest) {
  // Try MongoDB connection with retry logic
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`🔍 Fetching products from MongoDB (attempt ${attempt})...`)
      
      const client = await clientPromise
      const db = client.db('website-service')
      
      const products = await db.collection('products').find({ isActive: true }).sort({ createdAt: -1 }).toArray()
      
      console.log(`✅ Found ${products.length} products from MongoDB`)
      
      return NextResponse.json({ 
        success: true, 
        products: products,
        count: products.length,
        source: 'mongodb'
      })
    } catch (error: any) {
      console.error(`MongoDB attempt ${attempt} failed:`, error.message)
      
      if (attempt === 3) {
        console.log('🔄 All MongoDB attempts failed, using mock data fallback')
        return NextResponse.json({ 
          success: true, 
          products: mockProducts,
          count: mockProducts.length,
          source: 'mock-fallback'
        })
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating product in MongoDB...')
    
    const body = await request.json()
    const { name, description, price, category, features, isActive } = body
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const product = {
      name,
      description,
      price,
      category,
      features,
      isActive: isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('products').insertOne(product)
    
    console.log(`✅ Product created with ID: ${result.insertedId}`)
    
    return NextResponse.json({ 
      success: true, 
      product: { ...product, _id: result.insertedId },
      message: 'Product created successfully'
    })
  } catch (error: any) {
    console.error('MongoDB product creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Updating product in MongoDB...')
    
    const body = await request.json()
    const { productId, isActive } = body
    
    const client = await clientPromise
    const db = client.db('website-service')
    
    const result = await db.collection('products').updateOne(
      { _id: productId },
      { 
        $set: { 
          isActive,
          updatedAt: new Date()
        } 
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    console.log(`✅ Product updated: ${productId}`)
    
    return NextResponse.json({ 
      success: true,
      message: 'Product updated successfully'
    })
  } catch (error: any) {
    console.error('MongoDB product update error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}