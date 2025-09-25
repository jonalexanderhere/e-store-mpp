# Deployment Guide - Website Service

Panduan lengkap untuk deployment aplikasi Website Service ke berbagai platform.

## 🚀 Platform Deployment

### 1. Vercel (Recommended)

#### Setup Vercel
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   vercel
   ```

#### Environment Variables di Vercel
1. Buka Vercel Dashboard
2. Pilih project Anda
3. Pergi ke **Settings** > **Environment Variables**
4. Tambahkan variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

#### Update Supabase Settings
1. Buka Supabase Dashboard
2. Pergi ke **Authentication** > **Settings**
3. Update **Site URL**: `https://your-app.vercel.app`
4. Update **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

### 2. Netlify

#### Setup Netlify
1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 3. Railway

#### Setup Railway
1. **Connect GitHub Repository**
2. **Set Build Command**
   ```bash
   npm run build
   ```

3. **Set Start Command**
   ```bash
   npm start
   ```

4. **Environment Variables**
   - Tambahkan semua Supabase variables
   - Set `NODE_ENV=production`

### 4. DigitalOcean App Platform

#### Setup DigitalOcean
1. **Create New App**
2. **Connect GitHub Repository**
3. **Set Build Command**
   ```bash
   npm run build
   ```

4. **Set Run Command**
   ```bash
   npm start
   ```

5. **Environment Variables**
   - Tambahkan semua required variables

### 5. AWS (Manual)

#### Setup EC2 Instance
1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.micro (free tier)
   - Security Group: HTTP (80), HTTPS (443), SSH (22)

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd website-service
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "website-service" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx**
   ```nginx
   # /etc/nginx/sites-available/website-service
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/website-service /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL dengan Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

## 🔧 Production Configuration

### Environment Variables

#### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```

#### Optional Variables
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Website Service
```

### Database Configuration

#### Supabase Production Setup
1. **Create Production Project**
2. **Run Schema Migration**
   ```sql
   -- Run supabase/schema.sql
   -- Run supabase/seed.sql
   ```

3. **Update RLS Policies**
4. **Setup Storage Buckets**
5. **Configure Authentication**

### Security Configuration

#### CORS Settings
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://your-domain.com' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

#### Rate Limiting
```javascript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add rate limiting logic here
  return NextResponse.next()
}
```

## 📊 Monitoring & Analytics

### Application Monitoring

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Sentry Error Tracking
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  tracesSampleRate: 1.0,
})
```

### Database Monitoring

#### Supabase Dashboard
- Monitor database performance
- Check storage usage
- Review authentication logs
- Analyze API usage

## 🔄 CI/CD Pipeline

### GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Management

#### Development
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
```

#### Staging
```env
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=staging-anon-key
```

#### Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version

# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Environment Variables
```bash
# Check if variables are set
echo $NEXT_PUBLIC_SUPABASE_URL

# Verify in production
vercel env ls
```

#### 3. Database Connection
```javascript
// Check Supabase connection
const { data, error } = await supabase
  .from('users')
  .select('count')
  .limit(1)

if (error) {
  console.error('Database connection failed:', error)
}
```

#### 4. File Upload Issues
```javascript
// Check storage bucket
const { data, error } = await supabase.storage
  .from('uploads')
  .list('', { limit: 1 })

if (error) {
  console.error('Storage bucket not accessible:', error)
}
```

### Performance Optimization

#### 1. Image Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

#### 2. Bundle Analysis
```bash
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

#### 3. Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancer
- Multiple app instances
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Use CDN for static assets

### Caching Strategy
- Redis for session storage
- CDN for static assets
- Database query caching

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] File upload restrictions
- [ ] Authentication secure

## 📞 Support

Untuk masalah deployment:
1. Cek logs aplikasi
2. Verify environment variables
3. Test database connection
4. Check Supabase status
5. Contact support team

---

**Deployment Version**: 1.0.0  
**Last Updated**: 2024

