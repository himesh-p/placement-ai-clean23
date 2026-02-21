const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find({ profileCompleted: true })
      .select('name collegeName skillScore resumeScore practiceScore skills programmingLanguages')
      .lean();
    
    const ranked = users.map(u => ({
      id: u._id,
      name: u.name,
      collegeName: u.collegeName,
      skillScore: u.skillScore || 0,
      resumeScore: u.resumeScore || 0,
      practiceScore: u.practiceScore || 0,
      totalScore: Math.round((u.skillScore + u.resumeScore + u.practiceScore) / 3),
      totalSkills: (u.skills?.length || 0) + (u.programmingLanguages?.length || 0),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
    })).sort((a, b) => b.totalScore - a.totalScore);
    
    const currentUserRank = ranked.findIndex(u => u.id.toString() === req.user._id.toString()) + 1;
    
    res.json({ 
      leaderboard: ranked.slice(0, 10),
      currentUserRank,
      totalStudents: ranked.length
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
