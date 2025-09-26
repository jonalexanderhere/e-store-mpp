-- MongoDB Setup Instructions
-- This file contains instructions for setting up MongoDB with your application

-- 1. Environment Variables
-- Add to your .env.local file:
MONGODB_URI="mongodb+srv://Vercel-Admin-atlas-lightBlue-book:5scP865PtNLctb4k@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority"

-- 2. Database Collections
-- The following collections will be created automatically:
-- - users
-- - orders  
-- - products
-- - notifications
-- - transactions
-- - transaction_items
-- - cart

-- 3. Seed Data for MongoDB
-- Run this in MongoDB Compass or MongoDB Shell:

-- Insert default admin user
db.users.insertOne({
  email: "admin@inspiraproject.com",
  role: "admin",
  createdAt: new Date()
})

-- Insert products
db.products.insertMany([
  {
    name: "Website Portofolio",
    description: "Paket website portofolio profesional untuk menampilkan profil dan karya Anda.",
    price: 10000,
    category: "Portfolio",
    features: ["Desain responsif", "Halaman Profil", "Galeri Karya", "Form Kontak", "Optimasi SEO Dasar"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Website E-commerce",
    description: "Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.",
    price: 40000,
    category: "E-commerce",
    features: ["Katalog Produk", "Keranjang Belanja", "Checkout Manual", "Manajemen Pesanan", "Optimasi SEO Dasar"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Website Sistem Informasi Sekolah",
    description: "Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.",
    price: 30000,
    category: "Sistem Informasi",
    features: ["Profil Sekolah", "Berita & Pengumuman", "Data Siswa & Guru (statis)", "Halaman Kelas", "Form Kontak"],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

-- 4. Test Connection
-- Visit: /api/mongodb-test to test the connection

-- 5. Production Notes
-- - Use environment variables for MongoDB URI
-- - Enable authentication in MongoDB Atlas
-- - Set up proper indexes for performance
-- - Configure backup and monitoring
