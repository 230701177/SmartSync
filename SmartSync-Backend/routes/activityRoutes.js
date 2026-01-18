const express = require('express');
const router = express.Router();
const { validateActiveness } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.post('/validate', protect, validateActiveness);

module.exports = router;
