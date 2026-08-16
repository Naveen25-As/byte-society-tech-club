/**
 * MongoDB connection helper
 *
 * Mongoose is an ODM (Object Document Mapper) — it lets us
 * define JavaScript "schemas" that map to MongoDB collections.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: MONGODB_URI is not set in .env file');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
