const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/placement', require('./routes/placement'));
app.use('/api/resume', require('./routes/resume'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/learning', require('./routes/learning'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/colleges', require('./routes/colleges'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'AI Placement Platform API Running' }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_placement';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('📝 Running in demo mode without database...');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (demo mode)`));
  });

module.exports = app;
