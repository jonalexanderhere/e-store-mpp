@echo off
echo 🚀 Setting up MongoDB database...

REM MongoDB connection string
set MONGO_URI=mongodb+srv://atlas-lightblue-book.mfbxilu.mongodb.net/
set USERNAME=Vercel-Admin-atlas-lightBlue-book

echo 📡 Connecting to MongoDB Atlas...
echo Username: %USERNAME%
echo URI: %MONGO_URI%

REM Create the database setup script
(
echo // Switch to the website-service database
echo use('website-service'^);
echo.
echo print("📊 Creating database: website-service"^);
echo.
echo // Create collections
echo print("📁 Creating collections..."^);
echo db.createCollection('users'^);
echo db.createCollection('products'^);
echo db.createCollection('orders'^);
echo db.createCollection('notifications'^);
echo db.createCollection('transactions'^);
echo db.createCollection('transaction_items'^);
echo db.createCollection('cart'^);
echo.
echo print("✅ Collections created successfully!"^);
echo.
echo // Insert default admin user
echo print("👤 Creating admin user..."^);
echo db.users.insertOne({
echo   email: "admin@inspiraproject.com",
echo   role: "admin",
echo   createdAt: new Date(^)
echo }^);
echo.
echo // Insert products
echo print("🛍️ Inserting products..."^);
echo db.products.insertMany([
echo   {
echo     name: "Website Portofolio",
echo     description: "Paket website portofolio profesional untuk menampilkan profil dan karya Anda.",
echo     price: 10000,
echo     category: "Portfolio",
echo     features: ["Desain responsif", "Halaman Profil", "Galeri Karya", "Form Kontak", "Optimasi SEO Dasar"],
echo     isActive: true,
echo     createdAt: new Date(^),
echo     updatedAt: new Date(^)
echo   },
echo   {
echo     name: "Website E-commerce",
echo     description: "Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.",
echo     price: 40000,
echo     category: "E-commerce",
echo     features: ["Katalog Produk", "Keranjang Belanja", "Checkout Manual", "Manajemen Pesanan", "Optimasi SEO Dasar"],
echo     isActive: true,
echo     createdAt: new Date(^),
echo     updatedAt: new Date(^)
echo   },
echo   {
echo     name: "Website Sistem Informasi Sekolah",
echo     description: "Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.",
echo     price: 30000,
echo     category: "Sistem Informasi",
echo     features: ["Profil Sekolah", "Berita & Pengumuman", "Data Siswa & Guru (statis)", "Halaman Kelas", "Form Kontak"],
echo     isActive: true,
echo     createdAt: new Date(^),
echo     updatedAt: new Date(^)
echo   }
echo ]^);
echo.
echo // Create indexes
echo print("🔍 Creating indexes..."^);
echo db.users.createIndex({ "email": 1 }, { unique: true }^);
echo db.products.createIndex({ "category": 1 }^);
echo db.products.createIndex({ "isActive": 1 }^);
echo db.orders.createIndex({ "userId": 1 }^);
echo db.orders.createIndex({ "status": 1 }^);
echo db.orders.createIndex({ "createdAt": -1 }^);
echo db.notifications.createIndex({ "userId": 1 }^);
echo db.notifications.createIndex({ "read": 1 }^);
echo db.transactions.createIndex({ "userId": 1 }^);
echo db.transactions.createIndex({ "status": 1 }^);
echo db.cart.createIndex({ "userId": 1, "productId": 1 }, { unique: true }^);
echo.
echo print("✅ Indexes created successfully!"^);
echo.
echo // Show results
echo print("\n📋 Collections in website-service database:"^);
echo db.getCollectionNames(^).forEach(name =^> print(`  - ${name}`^)^);
echo.
echo print("\n🛍️ Products:"^);
echo db.products.find({}^).forEach(product =^> {
echo   print(`  - ${product.name}: Rp ${product.price.toLocaleString('id-ID'^)}`^);
echo }^);
echo.
echo print("\n👤 Admin User:"^);
echo db.users.find({ role: "admin" }^).forEach(user =^> {
echo   print(`  - Email: ${user.email}, Role: ${user.role}`^);
echo }^);
echo.
echo print("\n🎉 Database setup complete! You can now use the application."^);
) > temp-setup.js

echo 📝 Running MongoDB setup script...
mongosh "%MONGO_URI%" --apiVersion 1 --username "%USERNAME%" --file temp-setup.js

REM Clean up
del temp-setup.js

echo ✅ MongoDB setup completed!
echo 🔗 You can now test the connection at:
echo    - /api/mongodb-test
echo    - /api/mongodb-vercel-test

pause
