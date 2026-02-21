const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const internships = [
  { id: 1, company: "Jio Platforms", role: "ML Intern", domain: "Machine Learning", location: "Mumbai", stipend: "₹15,000/month", duration: "3 months", skills: ["Python", "TensorFlow", "Data Analysis"], deadline: "2025-02-28", link: "https://careers.jio.com" },
  { id: 2, company: "L&T Technology Services", role: "Software Development Intern", domain: "Full Stack", location: "Surat", stipend: "₹10,000/month", duration: "6 months", skills: ["React", "Node.js", "SQL"], deadline: "2025-03-15", link: "https://careers.ltts.com" },
  { id: 3, company: "Zydus Lifesciences", role: "Data Analytics Intern", domain: "Data Science", location: "Ahmedabad", stipend: "₹12,000/month", duration: "3 months", skills: ["Python", "R", "Tableau"], deadline: "2025-03-01", link: "https://zydus.com/careers" },
  { id: 4, company: "Adani Group (Tech)", role: "Cloud Infrastructure Intern", domain: "DevOps", location: "Ahmedabad", stipend: "₹18,000/month", duration: "6 months", skills: ["AWS", "Docker", "Linux"], deadline: "2025-02-20", link: "https://careers.adani.com" },
  { id: 5, company: "ISRO SAC", role: "Software Engineering Intern", domain: "Embedded Systems", location: "Ahmedabad", stipend: "₹8,000/month", duration: "2 months", skills: ["C", "Python", "MATLAB"], deadline: "2025-04-01", link: "https://www.sac.gov.in" },
  { id: 6, company: "TCS iON", role: "Web Development Intern", domain: "Full Stack", location: "Remote", stipend: "₹8,000/month", duration: "3 months", skills: ["JavaScript", "React", "Node.js"], deadline: "2025-03-20", link: "https://careers.tcs.com" },
  { id: 7, company: "Torrent Power", role: "IoT & Automation Intern", domain: "IoT", location: "Ahmedabad", stipend: "₹10,000/month", duration: "3 months", skills: ["IoT", "Python", "SQL"], deadline: "2025-03-10", link: "https://torrentpower.com/careers" },
  { id: 8, company: "HDFC Bank (Tech)", role: "Data Engineering Intern", domain: "Data Science", location: "Mumbai", stipend: "₹20,000/month", duration: "6 months", skills: ["Spark", "SQL", "Python"], deadline: "2025-02-25", link: "https://careers.hdfcbank.com" },
  { id: 9, company: "Infoedge (Naukri)", role: "Product Analytics Intern", domain: "Data Science", location: "Noida / Remote", stipend: "₹15,000/month", duration: "3 months", skills: ["SQL", "Python", "Excel"], deadline: "2025-03-30", link: "https://careers.infoedge.in" },
  { id: 10, company: "StartupXL (Gujarat)", role: "Full Stack Development Intern", domain: "Full Stack", location: "Gandhinagar", stipend: "₹6,000/month", duration: "3 months", skills: ["React", "MongoDB", "Express"], deadline: "2025-04-15", link: "https://startupxl.in" }
];

router.get('/', auth, (req, res) => {
  const { domain } = req.query;
  let filtered = internships;
  if (domain) filtered = filtered.filter(i => i.domain.toLowerCase().includes(domain.toLowerCase()));
  
  const domains = [...new Set(internships.map(i => i.domain))];
  res.json({ internships: filtered, domains, total: filtered.length });
});

module.exports = router;
