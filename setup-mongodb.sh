#!/bin/bash

# MongoDB Setup Script for Website Service
echo "🚀 Setting up MongoDB database..."

# MongoDB connection string
MONGO_URI="mongodb+srv://atlas-lightblue-book.mfbxilu.mongodb.net/"
USERNAME="Vercel-Admin-atlas-lightBlue-book"

echo "📡 Connecting to MongoDB Atlas..."
echo "Username: $USERNAME"
echo "URI: $MONGO_URI"

# Create the database setup script
cat > temp-setup.js << 'EOF'
// Switch to the website-service database
use('website-service');

print("📊 Creating database: website-service");

// Create collections
print("📁 Creating collections...");
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('notifications');
db.createCollection('transactions');
db.createCollection('transaction_items');
db.createCollection('cart');

print("✅ Collections created successfully!");

// Insert default admin user
print("👤 Creating admin user...");
db.users.insertOne({
  email: "admin@inspiraproject.com",
  role: "admin",
  createdAt: new Date()
});

// Insert products
print("🛍️ Inserting products...");
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
print("🔍 Creating indexes...");
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "isActive": 1 });
db.orders.createIndex({ "userId": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.notifications.createIndex({ "userId": 1 });
db.notifications.createIndex({ "read": 1 });
db.transactions.createIndex({ "userId": 1 });
db.transactions.createIndex({ "status": 1 });
db.cart.createIndex({ "userId": 1, "productId": 1 }, { unique: true });

print("✅ Indexes created successfully!");

// Show results
print("\n📋 Collections in website-service database:");
db.getCollectionNames().forEach(name => print(`  - ${name}`));

print("\n🛍️ Products:");
db.products.find({}).forEach(product => {
  print(`  - ${product.name}: Rp ${product.price.toLocaleString('id-ID')}`);
});

print("\n👤 Admin User:");
db.users.find({ role: "admin" }).forEach(user => {
  print(`  - Email: ${user.email}, Role: ${user.role}`);
});

print("\n🎉 Database setup complete! You can now use the application.");
EOF

echo "📝 Running MongoDB setup script..."
mongosh "$MONGO_URI" --apiVersion 1 --username "$USERNAME" --file temp-setup.js

# Clean up
rm temp-setup.js

echo "✅ MongoDB setup completed!"
echo "🔗 You can now test the connection at:"
echo "   - /api/mongodb-test"
echo "   - /api/mongodb-vercel-test"
