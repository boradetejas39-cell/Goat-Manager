const Goat = require('../models/Goat');
const DailyLog = require('../models/DailyLog');

// Get all goats
exports.getAllGoats = async (req, res) => {
  try {
    const goats = await Goat.find().sort({ created_at: -1 });
    res.json(goats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get single goat by ID
exports.getGoatById = async (req, res) => {
  try {
    const goat = await Goat.findById(req.params.id);
    if (!goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }
    res.json(goat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Create new goat
exports.createGoat = async (req, res) => {
  try {
    const { goatId, name, age, weight, purchaseDate, purchasePrice } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!goatId || !name || !purchaseDate || purchasePrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if goat limit reached
    const count = await Goat.countDocuments();
    if (count >= 5) {
      return res.status(400).json({ error: 'Maximum 5 goats allowed' });
    }

    const goat = new Goat({
      goatId,
      name,
      age: age || null,
      weight: weight || null,
      purchaseDate,
      purchasePrice,
      photo: photo || null
    });

    const savedGoat = await goat.save();
    res.status(201).json(savedGoat);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Goat ID already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update goat
exports.updateGoat = async (req, res) => {
  try {
    const { goatId, name, age, weight, purchaseDate, purchasePrice, photo } = req.body;
    
    const goat = await Goat.findByIdAndUpdate(
      req.params.id,
      { goatId, name, age, weight, purchaseDate, purchasePrice, photo },
      { new: true, runValidators: true }
    );

    if (!goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    res.json({ message: 'Goat updated successfully', goat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete goat
exports.deleteGoat = async (req, res) => {
  try {
    // Delete related logs first
    await DailyLog.deleteMany({ goat_id: req.params.id });
    // Delete goat
    const goat = await Goat.findByIdAndDelete(req.params.id);
    
    if (!goat) {
      return res.status(404).json({ error: 'Goat not found' });
    }

    res.json({ message: 'Goat deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

