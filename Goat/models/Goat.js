const mongoose = require('mongoose');

const goatSchema = new mongoose.Schema({
  goatId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: Number,
  weight: Number,
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  photo: String,
  created_at: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for id field (maps _id to id for compatibility)
goatSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('Goat', goatSchema);

