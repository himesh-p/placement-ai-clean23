const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const alumni = [
  { id: 1, name: "Raj Patel", gender: "male", graduationYear: 2020, company: "Google", role: "Software Engineer", college: "DAIICT", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=raj", skills: ["Python", "ML", "TensorFlow"], location: "Bangalore" },
  { id: 2, name: "Priya Shah", gender: "female", graduationYear: 2021, company: "Microsoft", role: "SDE-2", college: "Nirma University", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", skills: ["Java", "Azure", "React"], location: "Hyderabad" },
  { id: 3, name: "Arjun Mehta", gender: "male", graduationYear: 2019, company: "Amazon", role: "SDE-1", college: "SVNIT", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun", skills: ["Java", "AWS", "DynamoDB"], location: "Pune" },
  { id: 4, name: "Sneha Desai", gender: "female", graduationYear: 2022, company: "Infosys", role: "Systems Engineer", college: "GTU", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha", skills: ["Java", "Spring Boot", "SQL"], location: "Pune" },
  { id: 5, name: "Kiran Joshi", gender: "male", graduationYear: 2020, company: "TCS", role: "IT Analyst", college: "LD College", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kiran", skills: ["Python", "SQL", "Django"], location: "Mumbai" },
  { id: 6, name: "Ananya Trivedi", gender: "female", graduationYear: 2021, company: "Deloitte", role: "Technology Consultant", college: "PDEU", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya", skills: ["Tableau", "Python", "Power BI"], location: "Ahmedabad" },
  { id: 7, name: "Vivek Kumar", gender: "male", graduationYear: 2019, company: "Wipro", role: "Project Engineer", college: "BVM Engineering", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vivek", skills: ["Java", "Selenium", "Jenkins"], location: "Chennai" },
  { id: 8, name: "Riya Modi", gender: "female", graduationYear: 2022, company: "Accenture", role: "Software Engineer", college: "Nirma University", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=riya", skills: ["React", "Node.js", "MongoDB"], location: "Bangalore" },
  { id: 9, name: "Harsh Panchal", gender: "male", graduationYear: 2020, company: "Cognizant", role: "Programmer Analyst", college: "DAIICT", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=harsh", skills: ["Angular", ".NET", "SQL Server"], location: "Kolkata" },
  { id: 10, name: "Dev Parikh", gender: "male", graduationYear: 2021, company: "Jio Platforms", role: "Data Engineer", college: "PDEU", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev", skills: ["Spark", "Kafka", "Python"], location: "Mumbai" },
  { id: 11, name: "Mira Kapoor", gender: "female", graduationYear: 2019, company: "Google", role: "ML Engineer", college: "DAIICT", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mira", skills: ["TensorFlow", "PyTorch", "Python"], location: "Bangalore" },
  { id: 12, name: "Siddharth Rao", gender: "male", graduationYear: 2020, company: "L&T Technology Services", role: "Engineer Trainee", college: "SVNIT", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siddharth", skills: ["Embedded C", "IoT", "RTOS"], location: "Surat" },
  { id: 13, name: "Nisha Agarwal", gender: "female", graduationYear: 2022, company: "TCS", role: "Software Engineer", college: "Ganpat University", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nisha", skills: ["Java", "SQL", "Hibernate"], location: "Ahmedabad" },
  { id: 14, name: "Aakash Verma", gender: "male", graduationYear: 2021, company: "Microsoft", role: "Software Engineer", college: "Nirma University", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aakash", skills: ["C#", "Azure", ".NET Core"], location: "Hyderabad" },
  { id: 15, name: "Tanvi Bhatt", gender: "female", graduationYear: 2020, company: "Deloitte", role: "Data Analyst", college: "MS University", linkedin: "https://linkedin.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tanvi", skills: ["R", "Python", "Tableau"], location: "Vadodara" }
];

router.get('/', auth, (req, res) => {
  const { company, year } = req.query;
  let filtered = alumni;
  if (company) filtered = filtered.filter(a => a.company.toLowerCase().includes(company.toLowerCase()));
  if (year) filtered = filtered.filter(a => a.graduationYear === parseInt(year));
  res.json({ alumni: filtered, total: filtered.length });
});

router.get('/companies', auth, (req, res) => {
  const companies = [...new Set(alumni.map(a => a.company))];
  res.json({ companies });
});

module.exports = router;
