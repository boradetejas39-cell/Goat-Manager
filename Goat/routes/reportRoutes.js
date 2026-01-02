const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get financial summary
router.get('/summary', reportController.getSummary);

// Get detailed report
router.get('/detailed', reportController.getDetailed);

module.exports = router;

