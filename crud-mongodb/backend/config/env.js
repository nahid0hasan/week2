const path = require("path");

// Load backend/.env into process.env (built into Node 20.12+, no dotenv needed)
try {
  process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch {
  console.warn("⚠️  No .env file found. Copy .env.example to .env");
}

const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME || "taskflow",
};

if (!env.mongoUri) {
  throw new Error("MONGODB_URI is missing in backend/.env");
}

module.exports = env;
