// MongoDB Connection and Database Setup Script
// Run with: mongosh mongodb+srv://atlas-lightblue-book.mfbxilu.mongodb.net/ --apiVersion 1 --username Vercel-Admin-atlas-lightBlue-book

// Switch to the website-service database
use('website-service');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "role"],
      properties: {
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        role: {
          bsonType: "string",
          enum: ["admin", "customer"]
        },
        createdAt: {
          bsonType: "date"
        }
      }
    }
  }
});

db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "description", "price", "category"],
      properties: {
        name: { bsonType: "string" },
        description: { bsonType: "string" },
        price: { bsonType: "number" },
        category: { bsonType: "string" },
        features: { bsonType: "array" },
        isActive: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "customerName", "customerEmail", "websiteType", "requirements"],
      properties: {
        userId: { bsonType: "string" },
        customerName: { bsonType: "string" },
        customerEmail: { bsonType: "string" },
        websiteType: { bsonType: "string" },
        requirements: { bsonType: "string" },
        status: {
          bsonType: "string",
          enum: ["pending", "confirmed", "in_progress", "completed"]
        },
        paymentProofUrl: { bsonType: "string" },
        repoUrl: { bsonType: "string" },
        demoUrl: { bsonType: "string" },
        fileStructure: { bsonType: "string" },
        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

db.createCollection('notifications');
db.createCollection('transactions');
db.createCollection('transaction_items');
db.createCollection('cart');

// Insert default admin user
db.users.insertOne({
  email: "admin@inspiraproject.com",
  role: "admin",
  createdAt: new Date()
});

// Insert the 3 requested products
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

// Create indexes for better performance
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

print("✅ Database 'website-service' created successfully!");
print("✅ Collections created with validation rules!");
print("✅ Default admin user inserted!");
print("✅ 3 products inserted!");
print("✅ Indexes created for better performance!");

// Show collections
print("\n📋 Collections in website-service database:");
db.getCollectionNames().forEach(name => print(`  - ${name}`));

// Show products
print("\n🛍️ Products:");
db.products.find({}).forEach(product => {
  print(`  - ${product.name}: Rp ${product.price.toLocaleString('id-ID')}`);
});

// Show admin user
print("\n👤 Admin User:");
db.users.find({ role: "admin" }).forEach(user => {
  print(`  - Email: ${user.email}, Role: ${user.role}`);
});

print("\n🎉 Database setup complete! You can now use the application.");
