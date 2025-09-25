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
-- Admin user: admin@inspiraproject.com / admin123
-- Test users: user1@example.com / user123, user2@example.com / user123

-- Insert sample notifications (optional)
INSERT INTO notifications (user_id, title, message) VALUES
('00000000-0000-0000-0000-000000000000', 'Welcome to Inspiraproject!', 'Selamat datang di platform Inspiraproject - Solusi Digital Terpercaya!'),
('00000000-0000-0000-0000-000000000000', 'New Order Available', 'Ada pesanan baru yang perlu direview.'),
('00000000-0000-0000-0000-000000000000', 'System Update', 'Sistem telah diperbarui dengan fitur terbaru.');

-- Insert sample products with real data
INSERT INTO products (name, description, price, category, features, is_active) VALUES
('Website Perusahaan Profesional', 'Website perusahaan dengan desain modern dan responsif, termasuk halaman utama, tentang kami, layanan, dan kontak. Dilengkapi dengan sistem manajemen konten yang mudah digunakan.', 2500000.00, 'Website Perusahaan', ARRAY['Responsive Design', 'SEO Optimized', 'Contact Form', 'Admin Panel', '5 Pages', 'Mobile Friendly', 'Fast Loading', 'SSL Certificate'], true),
('Website E-commerce Lengkap', 'Website toko online lengkap dengan sistem keranjang, checkout, dan manajemen produk. Mendukung berbagai metode pembayaran dan sistem inventory yang canggih.', 5000000.00, 'E-commerce', ARRAY['Shopping Cart', 'Payment Gateway', 'Product Management', 'Order Tracking', 'User Dashboard', 'Inventory System', 'Multi-currency', 'Shipping Calculator'], true),
('Website Portfolio Kreatif', 'Website portfolio untuk showcase karya dan skill profesional dengan galeri yang menawan dan sistem blog terintegrasi.', 1500000.00, 'Portfolio', ARRAY['Gallery', 'Blog', 'Contact Form', 'Social Media Integration', 'Responsive Design', 'Image Optimization', 'SEO Ready', 'Analytics'], true),
('Landing Page Konversi Tinggi', 'Halaman landing page untuk kampanye marketing dan lead generation dengan desain yang menarik dan sistem tracking yang akurat.', 1000000.00, 'Landing Page', ARRAY['Lead Capture', 'Analytics', 'A/B Testing', 'Mobile Optimized', 'Fast Loading', 'Conversion Tracking', 'Email Integration', 'Social Proof'], true),
('Website Blog Profesional', 'Website blog dengan sistem CMS untuk konten management yang powerful dan user-friendly untuk content creator.', 2000000.00, 'Blog', ARRAY['CMS', 'Comment System', 'SEO Tools', 'Social Sharing', 'Newsletter', 'Multi-author', 'Content Scheduling', 'RSS Feed'], true),
('Website Custom Enterprise', 'Website custom sesuai kebutuhan khusus dengan fitur yang disesuaikan untuk bisnis besar dan enterprise.', 8000000.00, 'Custom', ARRAY['Custom Features', 'API Integration', 'Advanced Security', 'Scalable Architecture', '24/7 Support', 'Custom Dashboard', 'Multi-language', 'Advanced Analytics'], true);
