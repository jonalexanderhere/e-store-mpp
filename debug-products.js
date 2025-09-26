const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/?retryWrites=true&w=majority";

async function debugProducts() {
  let client;
  
  try {
    console.log('🔍 Debugging MongoDB Products...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');
    
    const db = client.db('website-service');
    console.log('📊 Using database: website-service');
    
    // Check collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check products collection
    const products = await db.collection('products').find({}).toArray();
    console.log(`\n🛍️ Products found: ${products.length}`);
    
    products.forEach(product => {
      console.log(`  - ${product.name}: Rp ${product.price.toLocaleString('id-ID')} (Active: ${product.isActive})`);
    });
    
    // Check active products specifically
    const activeProducts = await db.collection('products').find({ isActive: true }).toArray();
    console.log(`\n✅ Active products: ${activeProducts.length}`);
    
    activeProducts.forEach(product => {
      console.log(`  - ${product.name}: Rp ${product.price.toLocaleString('id-ID')}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

debugProducts();
