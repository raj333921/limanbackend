// routes/scoreRoutes.js
const express = require('express');
const router = express.Router();
const {
  addScore,
  getScoresByEmail,
} = require('../controllers/scoreController');

// POST → add score
router.post('/add', addScore);

// GET → fetch by email
router.get('/:email', getScoresByEmail);

module.exports = router;