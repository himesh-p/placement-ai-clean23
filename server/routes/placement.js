const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { companiesDatabase } = require('../data/database');

// Calculate placement probability using ML-inspired algorithm
const calculatePlacementProbability = (student, company) => {
  const studentAllSkills = [
    ...student.skills.map(s => s.toLowerCase()),
    ...student.programmingLanguages.map(s => s.toLowerCase()),
    ...student.tools.map(s => s.toLowerCase())
  ];
  
  const requiredSkills = company.requiredSkills.map(s => s.toLowerCase());
  const preferredSkills = company.preferredSkills.map(s => s.toLowerCase());
  
  // Required skills match
  const matchedRequired = requiredSkills.filter(skill => 
    studentAllSkills.some(s => s.includes(skill) || skill.includes(s))
  );
  const requiredMatchRate = matchedRequired.length / requiredSkills.length;
  
  // Preferred skills match
  const matchedPreferred = preferredSkills.filter(skill => 
    studentAllSkills.some(s => s.includes(skill) || skill.includes(s))
  );
  const preferredMatchRate = preferredSkills.length > 0 ? matchedPreferred.length / preferredSkills.length : 0;
  
  // Missing skills
  const missingRequired = requiredSkills.filter(skill => 
    !studentAllSkills.some(s => s.includes(skill) || skill.includes(s))
  );
  const missingPreferred = preferredSkills.filter(skill => 
    !studentAllSkills.some(s => s.includes(skill) || skill.includes(s))
  );
  
  // CGPA factor
  const cgpaFactor = student.cgpa >= company.minCGPA ? 
    Math.min(1, (student.cgpa - company.minCGPA + 1) / 3) : 0.3;
  
  // Projects bonus
  const projectBonus = Math.min(0.15, student.projects.length * 0.05);
  
  // Internship bonus
  const internshipBonus = Math.min(0.10, student.internships.length * 0.05);
  
  // Certification bonus
  const certBonus = Math.min(0.05, student.certifications.length * 0.02);
  
  // Overall match percentage (for display)
  const matchPercentage = Math.round(
    (requiredMatchRate * 0.7 + preferredMatchRate * 0.3) * 100
  );
  
  // Selection probability (weighted formula)
  let selectionProbability = (
    requiredMatchRate * 0.50 +
    preferredMatchRate * 0.20 +
    cgpaFactor * 0.20 +
    projectBonus +
    internshipBonus +
    certBonus
  ) * 100;
  
  // Cap and normalize
  selectionProbability = Math.min(95, Math.max(5, Math.round(selectionProbability)));
  
  return {
    companyId: company.id,
    companyName: company.name,
    package: company.package,
    roles: company.roles,
    matchPercentage,
    selectionProbability,
    matchedRequired: matchedRequired.map(s => company.requiredSkills.find(r => r.toLowerCase() === s) || s),
    matchedPreferred: matchedPreferred.map(s => company.preferredSkills.find(p => p.toLowerCase() === s) || s),
    missingRequired: missingRequired.map(s => company.requiredSkills.find(r => r.toLowerCase() === s) || s),
    missingPreferred: missingPreferred.map(s => company.preferredSkills.find(p => p.toLowerCase() === s) || s),
    strengthAreas: matchedRequired.length > 0 ? matchedRequired.slice(0, 3) : ['General Programming'],
    cgpaMet: student.cgpa >= company.minCGPA,
    type: company.type
  };
};

// Get all placement predictions
router.get('/predict', auth, async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    
    if (!student.profileCompleted) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }
    
    const predictions = companiesDatabase.map(company => 
      calculatePlacementProbability(student, company)
    ).sort((a, b) => b.selectionProbability - a.selectionProbability);
    
    res.json({ predictions, totalCompanies: predictions.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get skill gap for specific company
router.get('/skill-gap/:companyId', auth, async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    const company = companiesDatabase.find(c => c.id === parseInt(req.params.companyId));
    
    if (!company) return res.status(404).json({ message: 'Company not found' });
    
    const analysis = calculatePlacementProbability(student, company);
    
    // Calculate potential improvement
    const potentialIncrease = analysis.missingRequired.length > 0 ? 
      Math.min(30, analysis.missingRequired.length * 8) : 0;
    
    res.json({
      ...analysis,
      company: {
        name: company.name,
        description: company.description,
        selectionProcess: company.selectionProcess,
        minCGPA: company.minCGPA
      },
      potentialProbabilityAfterImprovement: Math.min(95, analysis.selectionProbability + potentialIncrease),
      recommendations: analysis.missingRequired.slice(0, 3).map(skill => ({
        skill,
        priority: 'High',
        estimatedTime: '2-4 weeks',
        resources: [`YouTube tutorials on ${skill}`, `Coursera ${skill} course`, `Official ${skill} documentation`]
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
