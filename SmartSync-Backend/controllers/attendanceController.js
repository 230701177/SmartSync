const Attendance = require('../models/Attendance');
const Session = require('../models/Session');

// @desc    Mark attendance for a session
// @route   POST /api/attendance/mark
// @access  Private (Student only)
exports.markAttendance = async (req, res) => {
    try {
        const { sessionId, ipAddress } = req.body;

        if (!sessionId || !ipAddress) {
            return res.status(400).json({ message: 'Session ID and IP address are required' });
        }

        // 1. Check if session exists and is active
        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.status !== 'active' || new Date() > session.expiresAt) {
            session.status = 'expired';
            await session.save();
            return res.status(400).json({ message: 'Session has expired' });
        }

        // 2. Validate IP Address (Handshake check)
        if (session.ipAddress !== ipAddress) {
            return res.status(403).json({
                message: 'Network Mismatch. Please connect to the class network.',
                requiredIP: session.ipAddress,
                yourIP: ipAddress
            });
        }

        // 3. Check for existing attendance
        const existingAttendance = await Attendance.findOne({
            student: req.user._id,
            session: sessionId
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this session' });
        }

        // 4. Create attendance record
        const attendance = await Attendance.create({
            student: req.user._id,
            session: sessionId,
            subject: session.subject,
            ipAddress,
            status: 'verified'
        });

        res.status(201).json({
            message: 'Attendance verified successfully',
            attendance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's attendance history
// @route   GET /api/attendance/my
// @access  Private (Student only)
exports.getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.user._id })
            .populate('session', 'subject startTime faculty')
            .sort({ createdAt: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
