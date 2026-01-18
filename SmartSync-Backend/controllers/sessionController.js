const Session = require('../models/Session');

// @desc    Create a new attendance session
// @route   POST /api/session/create
// @access  Private (Faculty only)
exports.createSession = async (req, res) => {
    try {
        const { subject, ipAddress, durationMinutes = 2 } = req.body;

        if (!subject || !ipAddress) {
            return res.status(400).json({ message: 'Subject and IP address are required' });
        }

        const expiresAt = new Date(Date.now() + durationMinutes * 60000);

        const session = await Session.create({
            faculty: req.user._id,
            subject,
            ipAddress,
            expiresAt,
            status: 'active'
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify if a session is valid
// @route   GET /api/session/verify/:id
// @access  Private (Authenticated)
exports.verifySession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status !== 'active' || new Date() > session.expiresAt) {
            session.status = 'expired';
            await session.save();
            return res.status(400).json({ message: 'Session has expired' });
        }

        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
