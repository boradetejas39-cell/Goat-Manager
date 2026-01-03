const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tej_01_:Goat118@cluster0.mmna8kp.mongodb.net/goat_management?appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
    console.log('Database: goat_management');
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    console.warn('⚠ Server will start but database operations may fail');
  }
};


module.exports = connectDB;

