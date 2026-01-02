const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  goat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Goat', required: true },
  log_date: { type: Date, required: true },
  feed_cost: { type: Number, required: true },
  milk_produced: { type: Number, default: 0 },
  medical_treatment: String,
  created_at: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for id field (maps _id to id for compatibility)
dailyLogSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);

