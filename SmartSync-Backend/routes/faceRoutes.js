const express = require('express');
const router = express.Router();
const { verifyFace, updateFaceVectors } = require('../controllers/faceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/verify', protect, verifyFace);
router.post('/update', protect, updateFaceVectors);

module.exports = router;
