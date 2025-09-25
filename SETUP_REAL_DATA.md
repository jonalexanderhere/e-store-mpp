# 🔧 Setup Data Real - Inspiraproject

## Masalah yang Diperbaiki

1. **Failed Patch** - Environment variables tidak valid
2. **Data Dummy** - Perlu data real untuk testing
3. **Supabase Connection** - Setup database real

## Langkah Setup Data Real

### 1. Setup Supabase Project

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru dengan nama "inspiraproject"
3. Pilih region terdekat (Singapore untuk Indonesia)
4. Set password untuk database

### 2. Environment Variables Real

Buat file `.env.local` dengan credentials asli:

```bash
# Supabase Configuration (REAL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Jalankan SQL schema di Supabase SQL Editor:

```sql
-- Copy semua isi dari supabase/schema.sql
-- Jalankan di Supabase SQL Editor
```

### 4. Seed Data Real

Jalankan seed data untuk produk dan admin:

```sql
-- Copy semua isi dari supabase/seed.sql
-- Jalankan di Supabase SQL Editor
```

### 5. Test Aplikasi

```bash
npm run dev
```

## Data Real yang Akan Ditambahkan

### Produk Website (6 Produk)
1. Website Perusahaan Profesional - Rp 2.500.000
2. Website E-commerce - Rp 5.000.000
3. Website Portfolio - Rp 1.500.000
4. Landing Page - Rp 1.000.000
5. Website Blog - Rp 2.000.000
6. Website Custom - Rp 8.000.000

### Admin Account
- Email: admin@inspiraproject.com
- Password: admin123
- Role: admin

### Sample Users
- Email: user1@example.com
- Password: user123
- Role: user

## Troubleshooting

### Jika Build Gagal
1. Pastikan environment variables sudah benar
2. Restart development server
3. Clear cache: `rm -rf .next`

### Jika Database Error
1. Cek connection string
2. Pastikan RLS policies sudah aktif
3. Test connection di Supabase dashboard

## Production Ready

Setelah setup selesai, aplikasi siap untuk:
- Development testing
- Production deployment
- Real user testing
