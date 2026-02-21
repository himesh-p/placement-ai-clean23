const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { skills, programmingLanguages, tools, cgpa, projects, internships, certifications } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (skills) user.skills = skills;
    if (programmingLanguages) user.programmingLanguages = programmingLanguages;
    if (tools) user.tools = tools;
    if (cgpa !== undefined) user.cgpa = cgpa;
    if (projects) user.projects = projects;
    if (internships) user.internships = internships;
    if (certifications) user.certifications = certifications;
    
    user.profileCompleted = true;
    user.skillScore = user.calculateSkillScore();
    
    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
