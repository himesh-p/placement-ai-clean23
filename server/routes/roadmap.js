const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const roadmaps = {
  'fullstack': {
    title: 'Full Stack Developer',
    totalWeeks: 24,
    color: '#6366f1',
    steps: [
      { id: 1, skill: 'HTML & CSS Fundamentals', weeks: 2, description: 'Box model, Flexbox, Grid, Responsive Design', resources: ['MDN Web Docs', 'freeCodeCamp', 'CSS Tricks'], category: 'Frontend' },
      { id: 2, skill: 'JavaScript ES6+', weeks: 4, description: 'Variables, Functions, Arrays, Objects, Async/Await, Promises', resources: ['javascript.info', 'Eloquent JavaScript', 'You Don\'t Know JS'], category: 'Frontend' },
      { id: 3, skill: 'React.js', weeks: 4, description: 'Components, Props, State, Hooks, Router, Redux', resources: ['React Docs', 'Scrimba', 'Traversy Media'], category: 'Frontend' },
      { id: 4, skill: 'Node.js & Express', weeks: 3, description: 'REST APIs, Middleware, Authentication, File System', resources: ['Node.js Docs', 'Express.js Guide', 'Academind'], category: 'Backend' },
      { id: 5, skill: 'MongoDB & Databases', weeks: 2, description: 'NoSQL, Mongoose, Aggregation, Indexing', resources: ['MongoDB University', 'Mongoose Docs'], category: 'Backend' },
      { id: 6, skill: 'Git & GitHub', weeks: 1, description: 'Version Control, Branching, PRs, Collaboration', resources: ['Pro Git Book', 'GitHub Docs'], category: 'DevOps' },
      { id: 7, skill: 'Authentication & Security', weeks: 2, description: 'JWT, OAuth, bcrypt, CORS, Rate Limiting', resources: ['OWASP', 'Auth0 Docs'], category: 'Backend' },
      { id: 8, skill: 'Cloud Deployment (AWS/Heroku)', weeks: 2, description: 'EC2, S3, Docker basics, CI/CD', resources: ['AWS Free Tier', 'Docker Docs'], category: 'DevOps' },
      { id: 9, skill: 'Full Stack Projects', weeks: 4, description: 'Build 2-3 complete MERN stack projects with deployment', resources: ['Personal Projects', 'GitHub', 'Portfolio'], category: 'Projects' }
    ]
  },
  'ml': {
    title: 'Machine Learning Engineer',
    totalWeeks: 28,
    color: '#8b5cf6',
    steps: [
      { id: 1, skill: 'Python Programming', weeks: 3, description: 'Syntax, OOP, Libraries, Virtual Environments', resources: ['Python.org', 'Corey Schafer YouTube', 'Automate the Boring Stuff'], category: 'Programming' },
      { id: 2, skill: 'Mathematics for ML', weeks: 4, description: 'Linear Algebra, Calculus, Probability, Statistics', resources: ['Khan Academy', '3Blue1Brown', 'MIT OpenCourseWare'], category: 'Mathematics' },
      { id: 3, skill: 'Data Analysis (NumPy/Pandas)', weeks: 2, description: 'Data manipulation, cleaning, visualization with Matplotlib/Seaborn', resources: ['Pandas Docs', 'Kaggle Courses'], category: 'Data' },
      { id: 4, skill: 'Machine Learning Basics', weeks: 4, description: 'Supervised/Unsupervised Learning, scikit-learn, Model evaluation', resources: ['Coursera ML by Andrew Ng', 'Hands-On ML Book'], category: 'ML' },
      { id: 5, skill: 'Deep Learning & Neural Networks', weeks: 5, description: 'TensorFlow/PyTorch, CNNs, RNNs, Transfer Learning', resources: ['Fast.ai', 'DeepLearning.AI', 'CS231n'], category: 'Deep Learning' },
      { id: 6, skill: 'NLP & Computer Vision', weeks: 3, description: 'Text processing, Image recognition, BERT, YOLO', resources: ['Hugging Face', 'Papers With Code'], category: 'Specialization' },
      { id: 7, skill: 'MLOps & Deployment', weeks: 2, description: 'Model serving, Docker, Flask/FastAPI, AWS SageMaker', resources: ['MLflow', 'AWS ML Services'], category: 'Deployment' },
      { id: 8, skill: 'ML Projects & Kaggle', weeks: 5, description: 'Complete 3 end-to-end ML projects, participate in Kaggle competitions', resources: ['Kaggle', 'Papers With Code', 'GitHub'], category: 'Projects' }
    ]
  },
  'datascience': {
    title: 'Data Scientist',
    totalWeeks: 26,
    color: '#10b981',
    steps: [
      { id: 1, skill: 'Python & R Basics', weeks: 3, description: 'Python programming, R for statistics, Jupyter Notebooks', resources: ['Python.org', 'R for Data Science'], category: 'Programming' },
      { id: 2, skill: 'Statistics & Probability', weeks: 4, description: 'Descriptive stats, Hypothesis testing, Distributions, Bayesian thinking', resources: ['StatQuest', 'Khan Academy', 'Think Stats'], category: 'Statistics' },
      { id: 3, skill: 'Data Wrangling & EDA', weeks: 3, description: 'Pandas, data cleaning, exploratory analysis, Matplotlib/Seaborn/Plotly', resources: ['Kaggle Courses', 'Towards Data Science'], category: 'Data' },
      { id: 4, skill: 'SQL & Database Skills', weeks: 2, description: 'Complex queries, joins, window functions, BigQuery', resources: ['Mode Analytics SQL', 'LeetCode SQL'], category: 'Database' },
      { id: 5, skill: 'Machine Learning', weeks: 4, description: 'Regression, Classification, Clustering, Feature engineering', resources: ['Coursera', 'scikit-learn Docs'], category: 'ML' },
      { id: 6, skill: 'Data Visualization', weeks: 2, description: 'Tableau, Power BI, D3.js, storytelling with data', resources: ['Tableau Public', 'Power BI Docs'], category: 'Visualization' },
      { id: 7, skill: 'Big Data Technologies', weeks: 3, description: 'Spark, Hadoop, Hive, Kafka basics', resources: ['Databricks', 'Apache Spark Docs'], category: 'Big Data' },
      { id: 8, skill: 'Business Acumen & Communication', weeks: 2, description: 'Data storytelling, stakeholder communication, business metrics', resources: ['HBR Articles', 'DataCamp'], category: 'Soft Skills' },
      { id: 9, skill: 'Data Science Projects', weeks: 3, description: 'Complete portfolio projects, Kaggle competitions', resources: ['Kaggle', 'GitHub Portfolio'], category: 'Projects' }
    ]
  },
  'backend': {
    title: 'Backend Developer',
    totalWeeks: 22,
    color: '#f59e0b',
    steps: [
      { id: 1, skill: 'Core Programming (Java/Python/Node)', weeks: 3, description: 'Choose one language deeply: OOP, Data Structures, Design Patterns', resources: ['Official Docs', 'LeetCode', 'Effective Java'], category: 'Programming' },
      { id: 2, skill: 'Data Structures & Algorithms', weeks: 4, description: 'Arrays, Trees, Graphs, Sorting, DP - crack coding interviews', resources: ['LeetCode', 'GeeksforGeeks', 'CTCI'], category: 'CS Fundamentals' },
      { id: 3, skill: 'Databases (SQL + NoSQL)', weeks: 3, description: 'PostgreSQL, MongoDB, indexing, transactions, optimization', resources: ['PostgreSQL Docs', 'MongoDB University'], category: 'Database' },
      { id: 4, skill: 'REST API & GraphQL', weeks: 2, description: 'API design, versioning, documentation, GraphQL basics', resources: ['REST API Tutorial', 'GraphQL Docs'], category: 'APIs' },
      { id: 5, skill: 'Authentication & Security', weeks: 2, description: 'JWT, OAuth 2.0, bcrypt, SQL injection prevention, OWASP Top 10', resources: ['OWASP', 'Auth0'], category: 'Security' },
      { id: 6, skill: 'Caching & Message Queues', weeks: 2, description: 'Redis, Memcached, RabbitMQ, Kafka basics', resources: ['Redis Docs', 'RabbitMQ Tutorials'], category: 'Performance' },
      { id: 7, skill: 'System Design', weeks: 3, description: 'Scalability, Load Balancing, Microservices, CAP theorem', resources: ['System Design Primer', 'Grokking System Design'], category: 'Architecture' },
      { id: 8, skill: 'Docker & CI/CD', weeks: 2, description: 'Containerization, Docker Compose, GitHub Actions, Jenkins', resources: ['Docker Docs', 'GitHub Actions'], category: 'DevOps' },
      { id: 9, skill: 'Backend Projects', weeks: 1, description: 'Build 2+ production-ready APIs with documentation', resources: ['GitHub', 'Postman Docs'], category: 'Projects' }
    ]
  },
  'devops': {
    title: 'DevOps Engineer',
    totalWeeks: 24,
    color: '#ef4444',
    steps: [
      { id: 1, skill: 'Linux & Shell Scripting', weeks: 3, description: 'Linux commands, bash scripting, cron jobs, process management', resources: ['Linux Journey', 'The Linux Command Line'], category: 'Fundamentals' },
      { id: 2, skill: 'Networking Basics', weeks: 2, description: 'TCP/IP, DNS, HTTP/HTTPS, Load Balancers, Firewalls', resources: ['Computer Networking: Top-Down Approach'], category: 'Networking' },
      { id: 3, skill: 'Git & Version Control', weeks: 1, description: 'Git workflows, branching strategies, GitOps', resources: ['Pro Git', 'GitHub Flow'], category: 'VCS' },
      { id: 4, skill: 'Docker & Containers', weeks: 3, description: 'Dockerfile, Docker Compose, container networking, registries', resources: ['Docker Docs', 'Play with Docker'], category: 'Containers' },
      { id: 5, skill: 'Kubernetes', weeks: 4, description: 'Pods, Deployments, Services, Helm, K8s administration', resources: ['Kubernetes Docs', 'CKA Exam Guide'], category: 'Orchestration' },
      { id: 6, skill: 'CI/CD Pipelines', weeks: 3, description: 'Jenkins, GitHub Actions, GitLab CI, ArgoCD', resources: ['Jenkins Docs', 'GitHub Actions Docs'], category: 'CI/CD' },
      { id: 7, skill: 'Cloud (AWS/Azure/GCP)', weeks: 4, description: 'EC2, S3, IAM, VPC, CloudFormation/Terraform', resources: ['AWS Free Tier', 'Cloud Guru'], category: 'Cloud' },
      { id: 8, skill: 'Monitoring & Observability', weeks: 2, description: 'Prometheus, Grafana, ELK Stack, alerting', resources: ['Prometheus Docs', 'Grafana Docs'], category: 'Monitoring' },
      { id: 9, skill: 'Infrastructure as Code', weeks: 2, description: 'Terraform, Ansible, Pulumi', resources: ['Terraform Docs', 'Ansible Docs'], category: 'IaC' }
    ]
  }
};

router.get('/streams', auth, (req, res) => {
  const streams = Object.keys(roadmaps).map(key => ({
    id: key,
    title: roadmaps[key].title,
    color: roadmaps[key].color,
    totalWeeks: roadmaps[key].totalWeeks,
    stepCount: roadmaps[key].steps.length
  }));
  res.json({ streams });
});

router.get('/:stream', auth, (req, res) => {
  const roadmap = roadmaps[req.params.stream.toLowerCase()];
  if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
  res.json(roadmap);
});

module.exports = router;
