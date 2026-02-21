const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Rule-based + pattern matching chatbot
const responses = {
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy'],
    response: "Hello! 👋 I'm your AI Career Assistant. I can help you with:\n• Placement preparation tips\n• Resume improvement advice\n• Interview guidance\n• Roadmap recommendations\n• Company-specific tips\n\nWhat would you like to know?"
  },
  resume: {
    patterns: ['resume', 'cv', 'resume tips', 'improve resume', 'resume score'],
    response: "📄 **Resume Improvement Tips:**\n\n1. **ATS Optimization** - Use keywords from job descriptions\n2. **Quantify achievements** - 'Increased performance by 40%' beats 'improved performance'\n3. **Action verbs** - Start bullets with: Built, Developed, Led, Implemented\n4. **1 Page rule** - Keep it to 1 page for freshers\n5. **Project links** - Add GitHub links to all projects\n6. **Skills section** - List all relevant technologies\n7. **No photos/graphics** - Keep it ATS-friendly\n\n💡 Use our AI Resume Optimizer to get your detailed score!"
  },
  interview: {
    patterns: ['interview', 'interview tips', 'how to crack interview', 'interview preparation'],
    response: "🎯 **Interview Preparation Guide:**\n\n**Technical Round:**\n• Practice 100+ LeetCode problems (Easy to Hard)\n• Study CS fundamentals (OS, DBMS, Networks, OOP)\n• Prepare 3-5 projects to explain in depth\n• Practice system design basics\n\n**HR Round:**\n• STAR method for behavioral questions\n• Research company values and culture\n• Prepare: Tell me about yourself, strengths/weaknesses\n• Ask thoughtful questions at the end\n\n**Communication:**\n• Think aloud while solving problems\n• It's okay to ask clarifying questions\n• Be confident, not arrogant"
  },
  roadmap: {
    patterns: ['roadmap', 'learning path', 'what to learn', 'career path', 'how to become'],
    response: "🗺️ **Career Roadmaps Available:**\n\n1. **Full Stack Developer** - React, Node, MongoDB (24 weeks)\n2. **ML Engineer** - Python, TensorFlow, PyTorch (28 weeks)\n3. **Data Scientist** - Statistics, ML, Visualization (26 weeks)\n4. **Backend Developer** - Java/Python, APIs, System Design (22 weeks)\n5. **DevOps Engineer** - Linux, Docker, Kubernetes, AWS (24 weeks)\n\n💡 Visit the Roadmap section to see your personalized animated learning path!"
  },
  placement: {
    patterns: ['placement', 'placed', 'package', 'salary', 'job', 'company', 'get placed'],
    response: "💼 **Placement Strategy:**\n\n**Tier 1 Companies (15+ LPA):** Focus on DSA (LeetCode Hard), System Design, and CS fundamentals. Google, Microsoft, Amazon require 200+ problems.\n\n**Tier 2 Companies (5-15 LPA):** Balanced approach - DSA + Projects + Communication skills.\n\n**Service Companies (3-6 LPA):** Aptitude tests + Basic coding + Good communication.\n\n**Key Stats:**\n• Students with 3+ projects get 2x more calls\n• Internship experience increases probability by 40%\n• CGPA > 7.5 opens more doors\n\n📊 Check your Placement Probability Predictor!"
  },
  dsa: {
    patterns: ['dsa', 'data structures', 'algorithms', 'leetcode', 'competitive programming'],
    response: "💻 **DSA Learning Strategy:**\n\n**Week 1-2:** Arrays, Strings, Hashing\n**Week 3-4:** Linked Lists, Stacks, Queues\n**Week 5-6:** Trees, BST, Heaps\n**Week 7-8:** Graphs, BFS, DFS\n**Week 9-10:** Dynamic Programming\n**Week 11-12:** Advanced topics\n\n**Resources:**\n• LeetCode (most important)\n• GeeksforGeeks\n• Striver's SDE Sheet (180 problems)\n• NeetCode.io\n\n**Target:** 150+ problems before placements"
  },
  python: {
    patterns: ['python', 'learn python', 'python for placement'],
    response: "🐍 **Python for Placements:**\n\n**Core Topics:**\n• OOP - Classes, Inheritance, Polymorphism\n• Data Structures - Lists, Dicts, Sets, Tuples\n• File I/O and Exception Handling\n• Libraries - NumPy, Pandas, Matplotlib\n\n**For DSA:** Use Python's built-in structures\n**For ML:** NumPy + Pandas + Scikit-learn\n**For Backend:** Django or Flask\n\n**Free Resources:**\n• Python.org official tutorial\n• CS50P (Harvard Python)\n• Corey Schafer YouTube\n• Real Python website"
  },
  default: {
    response: "🤔 I'm not sure about that specific query, but I can help you with:\n\n• **Resume tips** - How to improve your resume\n• **Interview prep** - Technical and HR preparation\n• **Career roadmaps** - Learning paths for different roles\n• **Placement strategy** - How to crack placements\n• **DSA practice** - Data structures and algorithms\n• **Python/Java** - Programming guidance\n\nType any of these topics to get detailed guidance! 💪"
  }
};

router.post('/message', auth, (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });
  
  const lowerMessage = message.toLowerCase();
  
  // Find matching response
  let responseText = responses.default.response;
  
  for (const [key, data] of Object.entries(responses)) {
    if (key === 'default') continue;
    if (data.patterns.some(p => lowerMessage.includes(p))) {
      responseText = data.response;
      break;
    }
  }
  
  res.json({ 
    message: responseText,
    timestamp: new Date().toISOString(),
    suggestions: ['Resume tips', 'Interview prep', 'Career roadmap', 'Placement strategy']
  });
});

module.exports = router;
