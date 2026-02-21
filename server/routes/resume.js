const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ML-inspired resume scoring algorithm
const scoreResume = (text, studentProfile) => {
  const lowerText = text.toLowerCase();
  
  let score = 0;
  const strengths = [];
  const weakPoints = [];
  const suggestions = [];
  const missingKeywords = [];
  
  // Section detection (25 points)
  const sections = {
    'education': ['education', 'academic', 'degree', 'university', 'college', 'cgpa', 'gpa'],
    'experience': ['experience', 'internship', 'work history', 'employment', 'job'],
    'skills': ['skills', 'technical skills', 'programming', 'technologies'],
    'projects': ['projects', 'personal projects', 'academic projects'],
    'certifications': ['certification', 'certificate', 'certified', 'course'],
    'contact': ['email', 'phone', 'linkedin', 'github', 'contact']
  };
  
  let sectionScore = 0;
  Object.entries(sections).forEach(([section, keywords]) => {
    if (keywords.some(kw => lowerText.includes(kw))) {
      sectionScore += 4;
      strengths.push(`${section.charAt(0).toUpperCase() + section.slice(1)} section present`);
    } else {
      weakPoints.push(`Missing ${section} section`);
      suggestions.push(`Add a dedicated ${section} section`);
      missingKeywords.push(section);
    }
  });
  score += Math.min(25, sectionScore);
  
  // Quantification check (20 points)
  const numberPattern = /\d+(%|years?|months?|projects?|students?|members?|users?|k\+?|\+)/gi;
  const numbers = text.match(numberPattern) || [];
  if (numbers.length >= 5) {
    score += 20;
    strengths.push('Good use of quantified achievements');
  } else if (numbers.length >= 2) {
    score += 12;
    suggestions.push('Add more quantified achievements (numbers, percentages, metrics)');
  } else {
    score += 5;
    weakPoints.push('Lack of quantified achievements');
    suggestions.push('Quantify your achievements with numbers and metrics');
  }
  
  // Action verbs (15 points)
  const actionVerbs = ['developed', 'built', 'created', 'designed', 'implemented', 'led', 'managed', 
    'improved', 'optimized', 'deployed', 'architected', 'engineered', 'collaborated', 'delivered'];
  const foundVerbs = actionVerbs.filter(v => lowerText.includes(v));
  const verbScore = Math.min(15, foundVerbs.length * 2);
  score += verbScore;
  if (verbScore >= 10) strengths.push('Strong use of action verbs');
  else suggestions.push('Use more strong action verbs (developed, built, implemented, etc.)');
  
  // Technical keywords (20 points)
  const techKeywords = ['javascript', 'python', 'java', 'react', 'node', 'sql', 'git', 'docker', 
    'aws', 'machine learning', 'deep learning', 'api', 'mongodb', 'html', 'css', 'typescript'];
  const foundTech = techKeywords.filter(kw => lowerText.includes(kw));
  const techScore = Math.min(20, foundTech.length * 2);
  score += techScore;
  if (techScore >= 12) strengths.push('Good technical keyword density');
  else {
    weakPoints.push('Low technical keyword density');
    suggestions.push('Add more relevant technical keywords and technologies');
  }
  
  // Length and formatting (10 points)
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 700) {
    score += 10;
    strengths.push('Appropriate resume length');
  } else if (wordCount < 200) {
    score += 3;
    weakPoints.push('Resume is too short');
    suggestions.push('Expand your resume with more details about projects and experiences');
  } else {
    score += 6;
    suggestions.push('Consider condensing your resume to 1 page');
  }
  
  // Links (10 points)
  const links = ['github', 'linkedin', 'portfolio', 'behance', 'stackoverflow'];
  const foundLinks = links.filter(l => lowerText.includes(l));
  const linkScore = Math.min(10, foundLinks.length * 3);
  score += linkScore;
  if (linkScore >= 6) strengths.push('Professional online presence links included');
  else suggestions.push('Add GitHub and LinkedIn profile links');
  
  // Personalization boost based on profile
  if (studentProfile) {
    const profileSkills = [...(studentProfile.skills || []), ...(studentProfile.programmingLanguages || [])];
    const skillsInResume = profileSkills.filter(s => lowerText.includes(s.toLowerCase()));
    if (skillsInResume.length > profileSkills.length * 0.7) {
      score = Math.min(100, score + 5);
      strengths.push('Resume aligns well with your profile skills');
    }
  }
  
  score = Math.min(100, Math.max(10, Math.round(score)));
  
  return {
    score,
    strengths: strengths.slice(0, 4),
    weakPoints: weakPoints.slice(0, 4),
    suggestions: suggestions.slice(0, 5),
    missingKeywords: [...new Set([...missingKeywords, 
      ...(foundTech.length < 5 ? ['More tech keywords needed'] : [])])],
    grade: score >= 85 ? 'A+' : score >= 75 ? 'A' : score >= 65 ? 'B+' : score >= 55 ? 'B' : 'C'
  };
};

// Analyze resume (with file upload)
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    let resumeText = '';
    
    if (req.file) {
      // Try to parse PDF
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } catch (e) {
        resumeText = req.body.resumeText || 'Sample resume text';
      }
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ message: 'Please upload a resume file or provide text' });
    }
    
    const result = scoreResume(resumeText, student);
    
    // Save score to user
    student.resumeScore = result.score;
    await student.save();
    
    res.json({
      ...result,
      studentName: student.name,
      analyzedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get resume score without upload (based on profile)
router.get('/score', auth, async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    // Generate profile-based resume text for scoring
    const profileText = `
      ${student.name} ${student.email}
      Education: ${student.collegeName} CGPA: ${student.cgpa}
      Skills: ${student.skills.join(', ')}
      Programming Languages: ${student.programmingLanguages.join(', ')}
      Tools: ${student.tools.join(', ')}
      Projects: ${student.projects.map(p => `${p.title}: ${p.description}`).join('. ')}
      Internships: ${student.internships.map(i => `${i.role} at ${i.company}`).join('. ')}
      Certifications: ${student.certifications.map(c => c.name).join(', ')}
      GitHub LinkedIn Portfolio
    `;
    
    const result = scoreResume(profileText, student);
    student.resumeScore = result.score;
    await student.save();
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
