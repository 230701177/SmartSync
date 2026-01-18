const express = require('express');
const router = express.Router();
const { createSession, verifySession } = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, authorize('Faculty'), createSession);
router.get('/verify/:id', protect, verifySession);

module.exports = router;
