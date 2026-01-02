const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Get all logs
router.get('/', logController.getAllLogs);

// Get logs for specific goat
router.get('/goat/:goatId', logController.getLogsByGoatId);

// Create log
router.post('/', logController.createLog);

// Update log
router.put('/:id', logController.updateLog);

// Delete log
router.delete('/:id', logController.deleteLog);

module.exports = router;

