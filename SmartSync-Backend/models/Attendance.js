const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'verified'],
        default: 'present'
    },
    verifiedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent duplicate attendance for the same student and session
AttendanceSchema.index({ student: 1, session: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
