import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb'

// Enhanced connection string with proper TLS parameters
const uri = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/website-service?retryWrites=true&w=majority&tls=true&authSource=admin"

// Enhanced MongoDB connection options with proper TLS configuration
const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  },
  // TLS Configuration
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
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
