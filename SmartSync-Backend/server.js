const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        // Ping the deployment to confirm connection (optional but good for testing)
        mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('Ensure you have replaced <db_password> in your .env file with your actual password.');
    });

// Basic Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/face', require('./routes/faceRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));

const { protect } = require('./middleware/authMiddleware');
app.get('/api/test/protected', protect, (req, res) => {
    res.json({ message: 'Access granted to protected route', user: req.user });
});

app.get('/', (req, res) => {
    res.send('SmartSync Backend API is running...');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
