const { MongoClient } = require('mongodb')

const uri = "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority"

async function setupMongoDB() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')
    
    const db = client.db('website-service')
    
    // Create collections
    await db.createCollection('users')
    await db.createCollection('products')
    await db.createCollection('orders')
    await db.createCollection('cart')
    await db.createCollection('notifications')
    
    console.log('✅ Collections created')
    
    // Insert admin user
    const adminUser = {
      email: 'admin@inspiraproject.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
      role: 'admin',
      name: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await db.collection('users').insertOne(adminUser)
    console.log('✅ Admin user created')
    
    // Insert products
    const products = [
      {
        name: 'Website Portofolio',
        description: 'Paket website portofolio profesional untuk menampilkan profil dan karya Anda.',
        price: 10000,
        category: 'Portfolio',
        features: ['Desain Modern', 'Galeri Proyek', 'Form Kontak', 'Integrasi Media Sosial'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Website E-commerce',
        description: 'Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.',
        price: 40000,
        category: 'E-commerce',
        features: ['Katalog Produk', 'Keranjang Belanja', 'Checkout', 'Manajemen Pesanan', 'Integrasi Pembayaran'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Website Sistem Informasi Sekolah',
        description: 'Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.',
        price: 30000,
        category: 'Sistem Informasi',
        features: ['Manajemen Siswa', 'Manajemen Guru', 'Pengumuman', 'Jadwal Pelajaran', 'Galeri'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    
    await db.collection('products').insertMany(products)
    console.log('✅ Products inserted')
    
    console.log('🎉 MongoDB setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  } finally {
    await client.close()
  }
}

setupMongoDB()
