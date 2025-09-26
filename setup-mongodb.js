const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:<db_password>@atlas-lightblue-book.mfbxilu.mongodb.net/";

async function setupDatabase() {
  let client;
  
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    console.log('URI:', MONGODB_URI.replace(/<db_password>/, '***'));
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');
    
    const db = client.db('website-service');
    console.log('📊 Using database: website-service');
    
    // Create collections
    console.log('📁 Creating collections...');
    await db.createCollection('users');
    await db.createCollection('products');
    await db.createCollection('orders');
    await db.createCollection('notifications');
    await db.createCollection('transactions');
    await db.createCollection('transaction_items');
    await db.createCollection('cart');
    console.log('✅ Collections created successfully!');
    
    // Insert default admin user
    console.log('👤 Creating admin user...');
    await db.collection('users').insertOne({
      email: "admin@inspiraproject.com",
      role: "admin",
      createdAt: new Date()
    });
    console.log('✅ Admin user created!');
    
    // Insert products
    console.log('🛍️ Inserting products...');
    await db.collection('products').insertMany([
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
    console.log('✅ Products inserted!');
    
    // Create indexes
    console.log('🔍 Creating indexes...');
    await db.collection('users').createIndex({ "email": 1 }, { unique: true });
    await db.collection('products').createIndex({ "category": 1 });
    await db.collection('products').createIndex({ "isActive": 1 });
    await db.collection('orders').createIndex({ "userId": 1 });
    await db.collection('orders').createIndex({ "status": 1 });
    await db.collection('orders').createIndex({ "createdAt": -1 });
    await db.collection('notifications').createIndex({ "userId": 1 });
    await db.collection('notifications').createIndex({ "read": 1 });
    await db.collection('transactions').createIndex({ "userId": 1 });
    await db.collection('transactions').createIndex({ "status": 1 });
    await db.collection('cart').createIndex({ "userId": 1, "productId": 1 }, { unique: true });
    console.log('✅ Indexes created successfully!');
    
    // Show results
    console.log('\n📋 Collections in website-service database:');
    const collections = await db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    console.log('\n🛍️ Products:');
    const products = await db.collection('products').find({}).toArray();
    products.forEach(product => {
      console.log(`  - ${product.name}: Rp ${product.price.toLocaleString('id-ID')}`);
    });
    
    console.log('\n👤 Admin User:');
    const adminUser = await db.collection('users').findOne({ role: "admin" });
    if (adminUser) {
      console.log(`  - Email: ${adminUser.email}, Role: ${adminUser.role}`);
    }
    
    console.log('\n🎉 Database setup complete! You can now use the application.');
    console.log('🔗 Test the connection at:');
    console.log('   - /api/mongodb-test');
    console.log('   - /api/mongodb-vercel-test');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Set MONGODB_URI environment variable with your actual password');
    console.log('   2. Replace <db_password> with your actual MongoDB password');
    console.log('   3. Ensure your IP is whitelisted in MongoDB Atlas');
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the setup
setupDatabase();
