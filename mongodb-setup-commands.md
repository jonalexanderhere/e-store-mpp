# MongoDB Setup Commands

## 1. Connect to MongoDB Atlas

```bash
mongosh "mongodb+srv://atlas-lightblue-book.mfbxilu.mongodb.net/" --apiVersion 1 --username Vercel-Admin-atlas-lightBlue-book
```

## 2. Run Database Setup Script

After connecting, run the setup script:

```javascript
// Load and execute the setup script
load('mongodb-connect.js')
```

## 3. Alternative: Manual Setup

If you prefer to run commands manually:

```javascript
// Switch to website-service database
use('website-service');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('notifications');
db.createCollection('transactions');
db.createCollection('transaction_items');
db.createCollection('cart');

// Insert admin user
db.users.insertOne({
  email: "admin@inspiraproject.com",
  role: "admin",
  createdAt: new Date()
});

// Insert products
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
]);

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "isActive": 1 });
db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
```

## 4. Verify Setup

```javascript
// Check collections
db.getCollectionNames();

// Check products
db.products.find({});

// Check admin user
db.users.find({ role: "admin" });
```

## 5. Test Connection from Application

After setup, test the connection:
- Visit `/api/mongodb-test` for basic connection test
- Visit `/api/mongodb-vercel-test` for Vercel Functions optimized test
