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

-- Insert sample notifications (optional)
INSERT INTO notifications (user_id, title, message) VALUES
('00000000-0000-0000-0000-000000000000', 'Welcome!', 'Welcome to Website Service platform!'),
('00000000-0000-0000-0000-000000000000', 'New Order', 'You have a new order to review.');

-- Insert sample products
INSERT INTO products (name, description, price, category, features, is_active) VALUES
('Website Perusahaan Profesional', 'Website perusahaan dengan desain modern dan responsif, termasuk halaman utama, tentang kami, layanan, dan kontak.', 2500000.00, 'Website Perusahaan', ARRAY['Responsive Design', 'SEO Optimized', 'Contact Form', 'Admin Panel', '5 Pages'], true),
('Website E-commerce', 'Website toko online lengkap dengan sistem keranjang, checkout, dan manajemen produk.', 5000000.00, 'E-commerce', ARRAY['Shopping Cart', 'Payment Gateway', 'Product Management', 'Order Tracking', 'User Dashboard'], true),
('Website Portfolio', 'Website portfolio untuk showcase karya dan skill profesional.', 1500000.00, 'Portfolio', ARRAY['Gallery', 'Blog', 'Contact Form', 'Social Media Integration', 'Responsive Design'], true),
('Landing Page', 'Halaman landing page untuk kampanye marketing dan lead generation.', 1000000.00, 'Landing Page', ARRAY['Lead Capture', 'Analytics', 'A/B Testing', 'Mobile Optimized', 'Fast Loading'], true),
('Website Blog', 'Website blog dengan sistem CMS untuk konten management.', 2000000.00, 'Blog', ARRAY['CMS', 'Comment System', 'SEO Tools', 'Social Sharing', 'Newsletter'], true),
('Website Custom', 'Website custom sesuai kebutuhan khusus dengan fitur yang disesuaikan.', 8000000.00, 'Custom', ARRAY['Custom Features', 'API Integration', 'Advanced Security', 'Scalable Architecture', '24/7 Support'], true);
