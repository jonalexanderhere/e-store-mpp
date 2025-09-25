# API Documentation - Website Service

Dokumentasi lengkap untuk API endpoints aplikasi Website Service.

## 🔗 Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

Semua API endpoints (kecuali auth) memerlukan authentication. Gunakan Supabase Auth untuk mendapatkan session token.

```javascript
// Example: Get session token
const { data: { session } } = await supabase.auth.getSession()
```

## 📋 Endpoints

### Orders

#### GET /api/orders
Mendapatkan daftar pesanan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "customer_name": "string",
      "customer_email": "string",
      "website_type": "string",
      "requirements": "string",
      "status": "pending|confirmed|in_progress|completed",
      "payment_proof_url": "string|null",
      "repo_url": "string|null",
      "demo_url": "string|null",
      "file_structure": "string|null",
      "notes": "string|null",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

**Access Control:**
- Users: Hanya pesanan mereka sendiri
- Admin: Semua pesanan

#### POST /api/orders
Membuat pesanan baru.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "customer_name": "string",
  "customer_email": "string", 
  "website_type": "string",
  "requirements": "string"
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "user_id": "uuid",
    "customer_name": "string",
    "customer_email": "string",
    "website_type": "string",
    "requirements": "string",
    "status": "pending",
    "created_at": "timestamp"
  }
}
```

#### GET /api/orders/[id]
Mendapatkan detail pesanan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "user_id": "uuid",
    "customer_name": "string",
    "customer_email": "string",
    "website_type": "string",
    "requirements": "string",
    "status": "string",
    "payment_proof_url": "string|null",
    "repo_url": "string|null",
    "demo_url": "string|null",
    "file_structure": "string|null",
    "notes": "string|null",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
}
```

#### PUT /api/orders/[id]
Update pesanan (Admin only).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "status": "pending|confirmed|in_progress|completed",
  "repo_url": "string",
  "demo_url": "string",
  "file_structure": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "status": "string",
    "repo_url": "string",
    "demo_url": "string",
    "file_structure": "string",
    "notes": "string",
    "updated_at": "timestamp"
  }
}
```

### Upload

#### POST /api/upload
Upload file (bukti pembayaran).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
file: File
orderId: string
```

**Response:**
```json
{
  "success": true,
  "filePath": "string",
  "message": "File uploaded successfully"
}
```

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

## 📝 Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🔧 Rate Limiting

- **Upload**: 10 requests per minute
- **Orders**: 100 requests per minute
- **General**: 1000 requests per hour

## 📊 Data Validation

### Order Creation
- `customer_name`: Required, min 2 characters
- `customer_email`: Required, valid email format
- `website_type`: Required, must be from predefined list
- `requirements`: Required, min 10 characters

### File Upload
- **Allowed types**: image/*, .pdf
- **Max size**: 10MB
- **Storage**: Supabase Storage bucket `uploads`

## 🚀 Example Usage

### JavaScript/TypeScript

```typescript
// Create order
const createOrder = async (orderData) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  })
  
  return response.json()
}

// Upload file
const uploadFile = async (file, orderId) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('orderId', orderId)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  return response.json()
}
```

### cURL

```bash
# Get orders
curl -X GET "http://localhost:3000/api/orders" \
  -H "Authorization: Bearer <token>"

# Create order
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "website_type": "Website Perusahaan",
    "requirements": "Website untuk perusahaan dengan fitur..."
  }'
```

## 🔍 Testing

### Postman Collection
Import collection untuk testing API endpoints.

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## 📞 Support

Untuk pertanyaan atau masalah terkait API:
1. Cek dokumentasi ini
2. Lihat error logs
3. Buat issue di repository
4. Hubungi developer

---

**API Version**: 1.0.0  
**Last Updated**: 2024

