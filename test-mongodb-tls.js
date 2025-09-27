import { MongoClient, ServerApiVersion } from 'mongodb';

console.log('🔍 MongoDB TLS Connection Test');
console.log('Node.js version:', process.version);
console.log('OpenSSL version:', process.versions.openssl);

const testMongoDBConnection = async () => {
  // Updated connection string with proper TLS parameters
  const uri = "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/website-service?retryWrites=true&w=majority&tls=true&authSource=admin";
  
  console.log('🔍 Testing MongoDB connection with enhanced TLS config...');
  
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    },
    // Enhanced TLS configuration
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    // Connection timeouts
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000,
    // Pool settings
    maxPoolSize: 5,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    // Retry settings
    retryReads: true,
    retryWrites: true,
    // Compression
    compressors: ['zlib'],
    zlibCompressionLevel: 6
  });

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ MongoDB connected successfully with TLS!');
    
    // Test database access
    const db = client.db('website-service');
    console.log('📁 Database accessed successfully');
    
    // Test collections
    const collections = await db.listCollections().toArray();
    console.log('📂 Available collections:', collections.map(c => c.name));
    
    // Test products collection
    if (collections.some(c => c.name === 'products')) {
      const products = await db.collection('products').find({}).limit(3).toArray();
      console.log('📦 Products found:', products.length);
      if (products.length > 0) {
        console.log('📋 Sample product:', products[0].name);
      }
    }
    
    // Test orders collection
    if (collections.some(c => c.name === 'orders')) {
      const orders = await db.collection('orders').find({}).limit(3).toArray();
      console.log('📋 Orders found:', orders.length);
    }
    
    console.log('🎉 All tests passed! MongoDB TLS connection is working properly.');
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error type:', err.constructor.name);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', err);
    
    // Specific error handling
    if (err.message.includes('SSL') || err.message.includes('TLS')) {
      console.log('\n🔧 TLS/SSL Error Detected!');
      console.log('Possible solutions:');
      console.log('1. Check MongoDB Atlas TLS settings');
      console.log('2. Verify connection string format');
      console.log('3. Try with tlsAllowInvalidCertificates: true (for testing only)');
    }
    
  } finally {
    try {
      await client.close();
      console.log('🔌 Connection closed');
    } catch (closeErr) {
      console.error('⚠️ Error closing connection:', closeErr.message);
    }
  }
};

// Run the test
testMongoDBConnection().catch(console.error);
