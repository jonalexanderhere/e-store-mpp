# 🚀 Quick Start - Website Service

Panduan cepat untuk menjalankan aplikasi Website Service.

## ✅ Status Aplikasi

**Aplikasi sudah berjalan di:** `http://localhost:3000`

## 🎯 Halaman yang Tersedia

### Untuk Semua User
- **Homepage**: `http://localhost:3000` - Landing page utama
- **Produk**: `http://localhost:3000/products` - Browse produk website
- **Test Page**: `http://localhost:3000/test` - Halaman test aplikasi

### Untuk User yang Login
- **Dashboard**: `http://localhost:3000/dashboard` - Dashboard user
- **Keranjang**: `http://localhost:3000/cart` - Keranjang belanja
- **Checkout**: `http://localhost:3000/checkout` - Proses pembelian

### Untuk Admin
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Kelola Produk**: `http://localhost:3000/admin/products`
- **Login Admin**: `admin@inspiraproject.com` / `admin123`

## 🛠 Fitur yang Sudah Berfungsi

### ✅ E-commerce System
- Browse produk website
- Add to cart functionality
- Checkout dengan upload bukti pembayaran
- Admin product management

### ✅ User Management
- Register/Login system
- User dashboard
- Order tracking
- Payment proof upload

### ✅ Admin Features
- Admin dashboard dengan statistik
- Kelola produk (tambah, edit, hapus)
- Verifikasi pembayaran
- Update status pesanan

## 🎨 UI/UX Features

- **Responsive Design** - Mobile-first approach
- **Modern UI** - TailwindCSS dengan custom components
- **Interactive Elements** - Hover effects, loading states
- **Navigation** - Intuitive menu system

## 📱 Mobile Support

- Responsive grid layouts
- Touch-friendly buttons
- Mobile navigation menu
- Optimized for all screen sizes

## 🔧 Development

### Menjalankan Development Server
```bash
npm run dev
```

### Build untuk Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 🚀 Deployment

Aplikasi siap untuk di-deploy ke:
- **Vercel** (Recommended)
- **Netlify**
- **Railway**
- **DigitalOcean**

Lihat `DEPLOYMENT.md` untuk panduan lengkap.

## 📊 Database Schema

Aplikasi menggunakan Supabase dengan tabel:
- `users` - Data pengguna
- `products` - Produk website
- `cart` - Keranjang belanja
- `transactions` - Transaksi pembelian
- `orders` - Pesanan custom website

## 🎯 Sample Data

Aplikasi sudah include 6 produk website siap jual:
1. Website Perusahaan Profesional - Rp 2.500.000
2. Website E-commerce - Rp 5.000.000
3. Website Portfolio - Rp 1.500.000
4. Landing Page - Rp 1.000.000
5. Website Blog - Rp 2.000.000
6. Website Custom - Rp 8.000.000

## 🔐 Security

- Row Level Security (RLS) pada semua tabel
- Authentication middleware
- Admin role-based access
- File upload validation

## 📞 Support

Jika ada masalah:
1. Cek `http://localhost:3000/test` untuk status aplikasi
2. Lihat terminal untuk error messages
3. Cek dokumentasi di `README.md`
4. Lihat `SETUP.md` untuk panduan setup lengkap

---

**Aplikasi Website Service sudah siap digunakan! 🎉**

