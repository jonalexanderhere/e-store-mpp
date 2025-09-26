-- Insert default admin user
-- Note: This should be done after setting up Supabase Auth
-- The admin user will be created through Supabase Auth with email: admin@inspiraproject.com

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all files" ON storage.objects
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Insert sample users for testing (these will be created through Supabase Auth)
-- Admin user: [HIDDEN] / [HIDDEN]
-- Test users: [HIDDEN] / [HIDDEN], [HIDDEN] / [HIDDEN]

-- Insert sample notifications (optional)
INSERT INTO notifications (user_id, title, message) VALUES
('00000000-0000-0000-0000-000000000000', 'Welcome to Inspiraproject!', 'Selamat datang di platform Inspiraproject - Solusi Digital Terpercaya!'),
('00000000-0000-0000-0000-000000000000', 'New Order Available', 'Ada pesanan baru yang perlu direview.'),
('00000000-0000-0000-0000-000000000000', 'System Update', 'Sistem telah diperbarui dengan fitur terbaru.');

-- Insert sample products with real data
-- Requested specific products and prices
INSERT INTO products (name, description, price, category, features, is_active) VALUES
('Website Portofolio', 'Paket website portofolio profesional untuk menampilkan profil dan karya Anda.', 10000.00, 'Portfolio', ARRAY['Desain responsif', 'Halaman Profil', 'Galeri Karya', 'Form Kontak', 'Optimasi SEO Dasar'], true),
('Website E-commerce', 'Paket website toko online dengan fitur katalog produk, keranjang, dan checkout sederhana.', 40000.00, 'E-commerce', ARRAY['Katalog Produk', 'Keranjang Belanja', 'Checkout Manual', 'Manajemen Pesanan', 'Optimasi SEO Dasar'], true),
('Website Sistem Informasi Sekolah', 'Paket website sistem informasi sekolah untuk informasi siswa, guru, dan pengumuman.', 30000.00, 'Sistem Informasi', ARRAY['Profil Sekolah', 'Berita & Pengumuman', 'Data Siswa & Guru (statis)', 'Halaman Kelas', 'Form Kontak'], true);
