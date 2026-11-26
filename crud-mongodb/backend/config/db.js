const { MongoClient } = require("mongodb");
const env = require("./env");

// One client for the whole app. It manages a connection pool internally,
// so we connect ONCE at startup and reuse it for every request.
const client = new MongoClient(env.mongoUri);
let db = null;

async function connectDB() {
  await client.connect();
  db = client.db(env.dbName);
  await db.command({ ping: 1 }); // make sure the connection really works
  console.log(`✅ MongoDB connected (database: ${env.dbName})`);
}

function getDB() {
  if (!db) throw new Error("Database not connected. Call connectDB() before starting the server.");
  return db;
}

async function closeDB() {
  await client.close();
}

module.exports = { connectDB, getDB, closeDB };
