const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, collegeName } = req.body;
    
    if (!name || !email || !password || !collegeName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    const user = new User({ name, email, password, collegeName });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, collegeName: user.collegeName, profileCompleted: user.profileCompleted }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, collegeName: user.collegeName, profileCompleted: user.profileCompleted }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
