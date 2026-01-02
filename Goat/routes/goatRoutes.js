const express = require('express');
const router = express.Router();
const goatController = require('../controllers/goatController');
const upload = require('../config/multer');

// Get all goats
router.get('/', goatController.getAllGoats);

// Get single goat by ID
router.get('/:id', goatController.getGoatById);

// Create new goat (with file upload)
router.post('/', upload.single('photo'), goatController.createGoat);

// Update goat
router.put('/:id', goatController.updateGoat);

// Delete goat
router.delete('/:id', goatController.deleteGoat);

module.exports = router;

