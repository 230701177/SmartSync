const User = require('../models/User');

// Helper: Cosine Similarity Simulation
const calculateSimilarity = (vecA, vecB) => {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let mA = 0;
    let mB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        mA += vecA[i] * vecA[i];
        mB += vecB[i] * vecB[i];
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    return dotProduct / (mA * mB);
};

// @desc    Verify face against stored vectors
// @route   POST /api/face/verify
// @access  Private
exports.verifyFace = async (req, res) => {
    try {
        const { faceVector } = req.body;
        if (!faceVector || !Array.isArray(faceVector)) {
            return res.status(400).json({ message: 'Valid face vector is required' });
        }

        const user = await User.findById(req.user._id);
        if (!user || user.faceVectors.length === 0) {
            return res.status(404).json({ message: 'No reference face data found. Please register your face first.' });
        }

        // Compare with all stored vectors, find best match
        const threshold = 0.85; // Similarity threshold
        let bestMatch = 0;

        user.faceVectors.forEach(storedVector => {
            const similarity = calculateSimilarity(faceVector, storedVector);
            if (similarity > bestMatch) bestMatch = similarity;
        });

        if (bestMatch >= threshold) {
            res.json({ success: true, confidence: bestMatch, message: 'Identity verified' });
        } else {
            res.status(401).json({ success: false, confidence: bestMatch, message: 'Face did not match records' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update/Register face vectors
// @route   POST /api/face/update
// @access  Private
exports.updateFaceVectors = async (req, res) => {
    try {
        const { faceVector } = req.body;
        if (!faceVector || !Array.isArray(faceVector)) {
            return res.status(400).json({ message: 'Valid face vector is required' });
        }

        const user = await User.findById(req.user._id);

        // Maintain FIFO queue of latest 10 vectors
        user.faceVectors.unshift(faceVector);
        if (user.faceVectors.length > 10) {
            user.faceVectors = user.faceVectors.slice(0, 10);
        }

        await user.save();
        res.json({ message: 'Face data updated successfully', vectorCount: user.faceVectors.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
