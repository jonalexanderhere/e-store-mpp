import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-lightBlue-book:n6qGV4qMOtt3NI9U@atlas-lightblue-book.mfbxilu.mongodb.net/";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClient: MongoClient | undefined;
}

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
};

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
  attachDatabasePool(client);
}

clientPromise = client.connect();

export default clientPromise;
