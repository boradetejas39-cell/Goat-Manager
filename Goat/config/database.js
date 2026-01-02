const mongoose = require('mongoose');
const Preference = require('../models/Preference');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tej_01_:%23Mrtejas01@cluster0.mmna8kp.mongodb.net/goat_management?appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
    console.log('Database: goat_management');
    // Initialize default preferences
    await initializePreferences();
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    console.warn('⚠ Server will start but database operations may fail');
  }
};

// Initialize default preferences
async function initializePreferences() {
  const defaults = [
    { setting_name: 'milk_price_per_liter', setting_value: '50' },
    { setting_name: 'max_goats_allowed', setting_value: '5' },
    { setting_name: 'currency_symbol', setting_value: '₹' },
    { setting_name: 'date_format', setting_value: 'dd-mm-yyyy' }
  ];

  for (const pref of defaults) {
    await Preference.findOneAndUpdate(
      { setting_name: pref.setting_name },
      { ...pref, updated_at: new Date() },
      { upsert: true, new: true }
    );
  }
}

module.exports = connectDB;

