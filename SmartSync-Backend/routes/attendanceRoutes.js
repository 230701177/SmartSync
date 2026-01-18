const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/mark', protect, authorize('Student'), markAttendance);
router.get('/my', protect, authorize('Student'), getMyAttendance);

module.exports = router;
