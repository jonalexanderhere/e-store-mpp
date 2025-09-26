-- Full setup SQL for Inspiraproject
-- Run this once on a fresh Supabase/Postgres project

-- Optional: set JWT secret (managed by Supabase in cloud)
-- ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ===============
-- Schema
-- ===============

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  features TEXT[],
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_method TEXT,
  payment_proof_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============
-- RLS & Policies
-- ===============

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Users
DO $$ BEGIN
  CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Orders
DO $$ BEGIN
  CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update all orders" ON orders
    FOR UPDATE USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Notifications
DO $$ BEGIN
  CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Products
DO $$ BEGIN
  CREATE POLICY "Anyone can view active products" ON products
    FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Cart
DO $$ BEGIN
  CREATE POLICY "Users can view own cart" ON cart
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can manage own cart" ON cart
    FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Transactions
DO $$ BEGIN
  CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all transactions" ON transactions
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Transaction Items
DO $$ BEGIN
  CREATE POLICY "Users can view own transaction items" ON transaction_items
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM transactions 
        WHERE id = transaction_items.transaction_id AND user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create own transaction items" ON transaction_items
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM transactions 
        WHERE id = transaction_items.transaction_id AND user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
DO $$ BEGIN
  CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===============
-- Storage Setup
-- ===============

-- Bucket for uploads (public)
INSERT INTO storage.buckets (id, name, public)
SELECT 'uploads', 'uploads', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'uploads');

-- Simple storage policies (optional and can be refined)
DO $$ BEGIN
  CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view their own files" ON storage.objects
  FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can view all files" ON storage.objects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ===============
-- Seed Data
-- ===============

-- Default Admin (maps to your app users table; auth sign-up is separate)
INSERT INTO users (id, email, role)
SELECT '00000000-0000-0000-0000-000000000000', 'admin@inspiraproject.com', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@inspiraproject.com');

-- Sample notifications for admin
INSERT INTO notifications (user_id, title, message)
SELECT '00000000-0000-0000-0000-000000000000', 'Welcome to Inspiraproject!', 'Selamat datang di platform Inspiraproject - Solusi Digital Terpercaya!'
WHERE NOT EXISTS (
  SELECT 1 FROM notifications 
  WHERE user_id = '00000000-0000-0000-0000-000000000000' AND title = 'Welcome to Inspiraproject!'
);

-- Requested Products (active)
INSERT INTO products (name, description, price, category, features, is_active)
SELECT 'Website Portofolio', 'Paket website portofolio profesional untuk menampilkan profil dan karya Anda.', 10000.00, 'Portfolio', ARRAY['Desain responsif', 'Halaman Profil', 'Galeri Karya', 'Form Kontak', 'Optimasi SEO Dasar'], true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Website Portofolio');

INSERT INTO products (name, description, price, category, features, is_active)
SELECT 'Website E-commerce', 'Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.', 40000.00, 'E-commerce', ARRAY['Katalog Produk', 'Keranjang Belanja', 'Checkout Manual', 'Manajemen Pesanan', 'Optimasi SEO Dasar'], true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Website E-commerce');

INSERT INTO products (name, description, price, category, features, is_active)
SELECT 'Website Sistem Informasi Sekolah', 'Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.', 30000.00, 'Sistem Informasi', ARRAY['Profil Sekolah', 'Berita & Pengumuman', 'Data Siswa & Guru (statis)', 'Halaman Kelas', 'Form Kontak'], true
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Website Sistem Informasi Sekolah');

-- Done

