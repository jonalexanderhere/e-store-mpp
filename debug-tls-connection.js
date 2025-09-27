import tls from 'tls';
import { MongoClient, ServerApiVersion } from 'mongodb';

console.log('🔍 TLS/SSL Diagnostic Information:');
console.log('Node.js version:', process.version);
console.log('OpenSSL version:', process.versions.openssl);
console.log('Supported TLS ciphers:', tls.getCiphers().length);
console.log('TLS ciphers:', tls.getCiphers().slice(0, 10).join(', '), '...');

// Test TLS connection to MongoDB Atlas
const testTLSConnection = () => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(27017, 'cluster0-shard-00-00.mfbxilu.mongodb.net', { 
      rejectUnauthorized: false,
      servername: 'cluster0-shard-00-00.mfbxilu.mongodb.net'
    }, () => {
      if (socket.authorized) {
        console.log('✅ TLS handshake success with MongoDB Atlas');
        console.log('TLS version:', socket.getProtocol());
        console.log('Cipher:', socket.getCipher());
        resolve(true);
      } else {
        console.error('❌ TLS handshake failed:', socket.authorizationError);
        reject(socket.authorizationError);
      }
      socket.end();
    });

    socket.on('error', (err) => {
      console.error('❌ TLS connection error:', err.message);
      reject(err);
    });

    socket.setTimeout(10000, () => {
      console.error('❌ TLS connection timeout');
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
  });
};

// Test MongoDB connection with proper TLS config
const testMongoDBConnection = async () => {
  const uri = "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    },
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000
  });

  try {
    console.log('🔍 Testing MongoDB connection with TLS...');
    await client.connect();
    console.log('✅ MongoDB connected successfully with TLS!');
    
    const db = client.db('website-service');
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test products collection
    const products = await db.collection('products').find({}).limit(3).toArray();
    console.log('📦 Products found:', products.length);
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Error details:', err);
  } finally {
    await client.close();
  }
};

// Run diagnostics
const runDiagnostics = async () => {
  try {
    console.log('\n=== TLS Connection Test ===');
    await testTLSConnection();
    
    console.log('\n=== MongoDB Connection Test ===');
    await testMongoDBConnection();
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
};

runDiagnostics();
