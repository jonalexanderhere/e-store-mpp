# Setup Guide - Website Service

Panduan lengkap untuk setup aplikasi Website Service dari awal.

## 🚀 Quick Start

### 1. Prerequisites

Pastikan Anda sudah menginstall:
- Node.js 18+ 
- npm atau yarn
- Git

### 2. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd website-service

# Install dependencies
npm install
```

### 3. Setup Supabase

#### 3.1 Buat Project Supabase
1. Kunjungi [Supabase](https://supabase.com)
2. Buat akun baru atau login
3. Klik "New Project"
4. Pilih organization dan isi detail project
5. Tunggu hingga project selesai dibuat

#### 3.2 Setup Database
1. Buka Supabase Dashboard
2. Pergi ke **SQL Editor**
3. Copy dan paste isi file `supabase/schema.sql`
4. Jalankan query untuk membuat tabel dan RLS policies
5. Copy dan paste isi file `supabase/seed.sql`
6. Jalankan query untuk setup storage dan data awal

#### 3.3 Setup Storage
1. Pergi ke **Storage** di dashboard
2. Buat bucket baru dengan nama `uploads`
3. Set bucket sebagai public (opsional)
4. Atur policies sesuai kebutuhan

#### 3.4 Setup Authentication
1. Pergi ke **Authentication** > **Settings**
2. Enable email authentication
3. Set site URL: `http://localhost:3000` (untuk development)
4. Set redirect URLs: `http://localhost:3000/auth/callback`

### 4. Setup Environment Variables

```bash
# Copy file environment
cp env.example .env.local
```

Edit file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Create Admin User

#### 5.1 Melalui Supabase Dashboard
1. Pergi ke **Authentication** > **Users**
2. Klik "Add user"
3. Email: `admin@inspiraproject.com`
4. Password: `admin123`
5. Auto confirm: ✅

#### 5.2 Update User Role
1. Pergi ke **SQL Editor**
2. Jalankan query:
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@inspiraproject.com';
```

### 6. Run Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔧 Configuration

### Supabase Configuration

#### RLS Policies
Aplikasi menggunakan Row Level Security (RLS) untuk keamanan data:

- **Users table**: Users hanya bisa melihat/mengupdate profil mereka sendiri
- **Orders table**: Users hanya bisa melihat pesanan mereka, admin bisa melihat semua
- **Storage**: Users hanya bisa upload/melihat file mereka sendiri

#### Storage Buckets
- **uploads**: Untuk menyimpan bukti pembayaran dan file lainnya
- Public access: Disabled (untuk keamanan)
- File size limit: 10MB (default)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Error
```
Error: Invalid JWT
```
**Solution**: Pastikan environment variables sudah benar dan Supabase project aktif.

#### 2. RLS Policy Error
```
Error: new row violates row-level security policy
```
**Solution**: Pastikan RLS policies sudah dijalankan dengan benar di database.

#### 3. File Upload Error
```
Error: The resource was not found
```
**Solution**: Pastikan storage bucket `uploads` sudah dibuat dan policies sudah diatur.

#### 4. Database Connection Error
```
Error: Failed to fetch
```
**Solution**: 
- Cek Supabase URL dan API key
- Pastikan project tidak dalam mode maintenance
- Cek network connection

### Debug Mode

Enable debug mode untuk melihat error detail:

```bash
# Set environment variable
export DEBUG=true

# Run application
npm run dev
```

## 📊 Database Schema

### Tables Overview

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table  
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  website_type TEXT NOT NULL,
  requirements TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed')),
  payment_proof_url TEXT,
  repo_url TEXT,
  demo_url TEXT,
  file_structure TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   - Push code ke GitHub
   - Connect repository ke Vercel
   - Set environment variables

2. **Environment Variables di Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Update Supabase Settings**
   - Set site URL ke domain Vercel
   - Update redirect URLs

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Setup Server**
   - Install Node.js di server
   - Setup reverse proxy (Nginx/Apache)
   - Configure SSL certificate

3. **Environment Setup**
   - Set production environment variables
   - Update Supabase settings untuk production domain

## 📝 Development Notes

### Code Structure
- **App Router**: Menggunakan Next.js 14 App Router
- **TypeScript**: Full TypeScript support
- **TailwindCSS**: Utility-first CSS framework
- **Supabase**: Database dan authentication

### Best Practices
- Gunakan TypeScript untuk type safety
- Implement proper error handling
- Use React hooks untuk state management
- Follow Next.js best practices

### Testing
```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📞 Support

Jika mengalami masalah:
1. Cek dokumentasi Supabase
2. Cek Next.js documentation
3. Buat issue di repository
4. Hubungi developer

---

**Happy Coding! 🚀**

