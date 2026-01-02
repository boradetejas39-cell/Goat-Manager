const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  setting_name: { type: String, unique: true, required: true },
  setting_value: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Preference', preferenceSchema);

