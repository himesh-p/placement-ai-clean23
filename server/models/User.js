const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  collegeName: { type: String, required: true },
  profileCompleted: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  
  // Profile data
  skills: [{ type: String }],
  programmingLanguages: [{ type: String }],
  tools: [{ type: String }],
  cgpa: { type: Number, default: 0, min: 0, max: 10 },
  
  projects: [{
    title: String,
    description: String,
    techStack: [String],
    link: String
  }],
  
  internships: [{
    company: String,
    role: String,
    duration: String,
    description: String
  }],
  
  certifications: [{
    name: String,
    issuer: String,
    year: Number
  }],
  
  // Scores
  resumeScore: { type: Number, default: 0 },
  skillScore: { type: Number, default: 0 },
  practiceScore: { type: Number, default: 0 },
  
  // Roadmap progress
  roadmapProgress: [{
    stream: String,
    completedSteps: [Number],
    startedAt: Date
  }],
  
  // Test history
  testHistory: [{
    topic: String,
    score: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate skill score
userSchema.methods.calculateSkillScore = function() {
  const totalSkills = this.skills.length + this.programmingLanguages.length + this.tools.length;
  const projectBonus = this.projects.length * 5;
  const internshipBonus = this.internships.length * 10;
  const certBonus = this.certifications.length * 3;
  return Math.min(100, totalSkills * 2 + projectBonus + internshipBonus + certBonus);
};

module.exports = mongoose.model('User', userSchema);
