const DailyLog = require('../models/DailyLog');

// Get all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await DailyLog.find()
      .populate('goat_id', 'goatId')
      .sort({ log_date: -1 });
    
    // Transform to match expected format
    const formattedLogs = logs.map(log => ({
      id: log.id || log._id?.toString(),
      goat_id: log.goat_id?._id?.toString() || log.goat_id?.toString() || log.goat_id,
      goatId: log.goat_id?.goatId || null,
      log_date: log.log_date,
      feed_cost: log.feed_cost,
      milk_produced: log.milk_produced,
      medical_treatment: log.medical_treatment,
      created_at: log.created_at
    }));
    
    res.json(formattedLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get logs for specific goat
exports.getLogsByGoatId = async (req, res) => {
  try {
    const logs = await DailyLog.find({ goat_id: req.params.goatId })
      .sort({ log_date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create log
exports.createLog = async (req, res) => {
  try {
    const { goat_id, log_date, feedCost, milkProduced, medicalTreatment } = req.body;

    if (!goat_id || !log_date || feedCost === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const log = new DailyLog({
      goat_id,
      log_date,
      feed_cost: feedCost,
      milk_produced: milkProduced || 0,
      medical_treatment: medicalTreatment || null
    });

    const savedLog = await log.save();
    res.status(201).json({
      id: savedLog._id,
      goat_id: savedLog.goat_id,
      log_date: savedLog.log_date,
      feedCost: savedLog.feed_cost,
      milkProduced: savedLog.milk_produced,
      medicalTreatment: savedLog.medical_treatment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update log
exports.updateLog = async (req, res) => {
  try {
    const { feedCost, milkProduced, medicalTreatment } = req.body;
    
    const log = await DailyLog.findByIdAndUpdate(
      req.params.id,
      {
        feed_cost: feedCost,
        milk_produced: milkProduced,
        medical_treatment: medicalTreatment
      },
      { new: true }
    );

    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    res.json({ message: 'Log updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete log
exports.deleteLog = async (req, res) => {
  try {
    const log = await DailyLog.findByIdAndDelete(req.params.id);
    
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    res.json({ message: 'Log deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

