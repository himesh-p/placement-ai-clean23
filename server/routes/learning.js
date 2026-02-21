const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

const questions = {
  aptitude: [
    { id: 1, question: "A train 150m long passes a pole in 15 seconds. What is its speed in km/h?", options: ["36 km/h", "40 km/h", "45 km/h", "50 km/h"], answer: 0, explanation: "Speed = 150/15 = 10 m/s = 36 km/h" },
    { id: 2, question: "If 6 men can complete a work in 12 days, how many days will 9 men take?", options: ["6 days", "7 days", "8 days", "9 days"], answer: 2, explanation: "M1D1 = M2D2, 6×12 = 9×D2, D2 = 8" },
    { id: 3, question: "What is 15% of 240?", options: ["32", "36", "38", "40"], answer: 1, explanation: "15% of 240 = 0.15 × 240 = 36" },
    { id: 4, question: "A car travels 240 km in 4 hours. How long will it take to travel 360 km at the same speed?", options: ["5 hrs", "6 hrs", "7 hrs", "8 hrs"], answer: 1, explanation: "Speed = 60 km/h, Time = 360/60 = 6 hours" },
    { id: 5, question: "Find the simple interest on Rs. 5000 at 8% per annum for 3 years.", options: ["Rs. 1000", "Rs. 1200", "Rs. 1500", "Rs. 2000"], answer: 1, explanation: "SI = P×R×T/100 = 5000×8×3/100 = 1200" },
    { id: 6, question: "Two numbers are in ratio 3:5. Their sum is 96. Find the larger number.", options: ["36", "48", "56", "60"], answer: 3, explanation: "3x+5x=96, x=12, larger=60" },
    { id: 7, question: "A shopkeeper marks goods 30% above cost and gives 10% discount. Profit%?", options: ["13%", "15%", "17%", "19%"], answer: 2, explanation: "MP=130, SP=117, Profit=17%" },
    { id: 8, question: "Find the next term: 2, 6, 12, 20, 30, __", options: ["40", "42", "44", "48"], answer: 1, explanation: "Pattern: n(n+1), next is 6×7=42" },
    { id: 9, question: "Clock shows 3:15. What is the angle between hands?", options: ["7.5°", "10°", "12.5°", "15°"], answer: 0, explanation: "At 3:15, angle = |90 - 7.5| = 7.5°" },
    { id: 10, question: "Pipe A fills in 10 hrs, B in 15 hrs. Both open together fill in?", options: ["5 hrs", "6 hrs", "7 hrs", "8 hrs"], answer: 1, explanation: "Combined = 1/10+1/15 = 5/30 = 1/6, time=6 hrs" }
  ],
  dsa: [
    { id: 1, question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1, explanation: "Binary search halves the search space each time, giving O(log n)" },
    { id: 2, question: "Which data structure uses LIFO principle?", options: ["Queue", "Stack", "Tree", "Graph"], answer: 1, explanation: "Stack follows Last In First Out (LIFO) principle" },
    { id: 3, question: "What is the worst case complexity of QuickSort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 2, explanation: "QuickSort degrades to O(n²) when pivot is always min/max" },
    { id: 4, question: "In a Binary Search Tree, inorder traversal gives?", options: ["Reverse sorted", "Sorted order", "Random order", "Level order"], answer: 1, explanation: "Inorder traversal of BST gives elements in ascending sorted order" },
    { id: 5, question: "What is the height of a complete binary tree with n nodes?", options: ["O(n)", "O(log n)", "O(n²)", "O(√n)"], answer: 1, explanation: "Height = floor(log₂n)" },
    { id: 6, question: "Which algorithm is used for shortest path in unweighted graph?", options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"], answer: 1, explanation: "BFS finds shortest path in unweighted graphs" },
    { id: 7, question: "What is the space complexity of Merge Sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 2, explanation: "Merge Sort requires O(n) auxiliary space" },
    { id: 8, question: "A linked list has 100 elements. Access time for 50th element?", options: ["O(1)", "O(50)", "O(n)", "O(log n)"], answer: 2, explanation: "Linked list has O(n) access time, must traverse from head" },
    { id: 9, question: "Which sorting algorithm is best for nearly sorted array?", options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Heap Sort"], answer: 2, explanation: "Insertion Sort is O(n) for nearly sorted arrays" },
    { id: 10, question: "Hash table average time complexity for search?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: 0, explanation: "Hash table has O(1) average case for search/insert/delete" }
  ],
  python: [
    { id: 1, question: "What does list.pop() do in Python?", options: ["Adds element", "Removes last element", "Sorts list", "Reverses list"], answer: 1, explanation: "list.pop() removes and returns the last element" },
    { id: 2, question: "What is a lambda function?", options: ["A class method", "Anonymous function", "A loop", "A decorator"], answer: 1, explanation: "Lambda creates anonymous single-expression functions" },
    { id: 3, question: "Output of: print(type([]))?", options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"], answer: 2, explanation: "[] creates a list, so type is <class 'list'>" },
    { id: 4, question: "What does 'yield' do in Python?", options: ["Returns value", "Creates generator", "Raises exception", "Imports module"], answer: 1, explanation: "yield makes a function a generator, pausing execution" },
    { id: 5, question: "What is a dictionary comprehension?", options: ["{k:v for k,v in items}", "[x for x in lst]", "(x for x in lst)", "{x for x in lst}"], answer: 0, explanation: "Dict comprehension uses {key:value for ...} syntax" },
    { id: 6, question: "What does __init__ do?", options: ["Destroys object", "Initializes object", "Imports module", "Creates class"], answer: 1, explanation: "__init__ is constructor, called when object is created" },
    { id: 7, question: "Which is mutable in Python?", options: ["Tuple", "String", "List", "Integer"], answer: 2, explanation: "Lists are mutable; tuples, strings, integers are immutable" },
    { id: 8, question: "What does 'with' statement do?", options: ["Exception handling", "Context manager", "Import module", "Define function"], answer: 1, explanation: "with statement manages resources via context managers" },
    { id: 9, question: "Output: print(2**10)?", options: ["20", "100", "1024", "2048"], answer: 2, explanation: "** is exponentiation, 2^10 = 1024" },
    { id: 10, question: "What is PEP 8?", options: ["Python version", "Style guide", "Package manager", "Testing framework"], answer: 1, explanation: "PEP 8 is Python's style guide for code formatting" }
  ],
  sql: [
    { id: 1, question: "Which clause filters rows after grouping?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1, explanation: "HAVING filters after GROUP BY; WHERE filters before" },
    { id: 2, question: "What does INNER JOIN do?", options: ["All rows from left", "All rows from right", "Matching rows only", "All rows from both"], answer: 2, explanation: "INNER JOIN returns only rows with matches in both tables" },
    { id: 3, question: "Which is NOT an aggregate function?", options: ["COUNT()", "SUM()", "MAX()", "SELECT()"], answer: 3, explanation: "SELECT is a clause, not an aggregate function" },
    { id: 4, question: "What is a PRIMARY KEY?", options: ["Can be null", "Must be unique", "Can duplicate", "Optional"], answer: 1, explanation: "PRIMARY KEY must be unique and cannot be NULL" },
    { id: 5, question: "SQL command to add a column?", options: ["ADD COLUMN", "ALTER TABLE...ADD", "INSERT COLUMN", "MODIFY TABLE"], answer: 1, explanation: "ALTER TABLE tablename ADD columnname datatype" },
    { id: 6, question: "Which removes duplicate rows?", options: ["DISTINCT", "UNIQUE", "DIFFERENT", "REMOVE DUPS"], answer: 0, explanation: "SELECT DISTINCT removes duplicate rows from results" },
    { id: 7, question: "What does TRUNCATE do vs DELETE?", options: ["Same thing", "TRUNCATE is faster, removes all rows", "DELETE is faster", "TRUNCATE allows WHERE"], answer: 1, explanation: "TRUNCATE is faster DDL operation, removes all rows, can't use WHERE" },
    { id: 8, question: "Which join returns all rows from left table?", options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"], answer: 2, explanation: "LEFT JOIN returns all rows from left table, NULL for non-matches" },
    { id: 9, question: "What is a foreign key?", options: ["Key from another country", "References primary key of another table", "Any unique key", "Auto-increment key"], answer: 1, explanation: "FOREIGN KEY references PRIMARY KEY of another table" },
    { id: 10, question: "ORDER BY default sort order?", options: ["DESC", "ASC", "Random", "None"], answer: 1, explanation: "ORDER BY defaults to ASC (ascending) order" }
  ],
  java: [
    { id: 1, question: "What is JVM?", options: ["Java Variable Machine", "Java Virtual Machine", "Java Version Manager", "Java Vendor Machine"], answer: 1, explanation: "JVM - Java Virtual Machine executes Java bytecode" },
    { id: 2, question: "Which is NOT a primitive type in Java?", options: ["int", "boolean", "String", "double"], answer: 2, explanation: "String is a class/object, not a primitive type" },
    { id: 3, question: "What does 'final' keyword do?", options: ["Makes class abstract", "Prevents modification/inheritance", "Makes method static", "Allows multiple inheritance"], answer: 1, explanation: "final prevents variable reassignment, method override, class inheritance" },
    { id: 4, question: "What is method overloading?", options: ["Same method, different class", "Same name, different parameters", "Overriding parent method", "Static methods"], answer: 1, explanation: "Overloading: same method name with different parameter lists" },
    { id: 5, question: "What does 'interface' support?", options: ["Single inheritance", "Multiple inheritance simulation", "No inheritance", "Private methods only"], answer: 1, explanation: "Interfaces allow Java to achieve multiple inheritance-like behavior" },
    { id: 6, question: "ArrayList vs Array difference?", options: ["No difference", "ArrayList is dynamic", "Array is faster always", "ArrayList only stores strings"], answer: 1, explanation: "ArrayList is dynamic (resizable), Array has fixed size" },
    { id: 7, question: "What is garbage collection?", options: ["Manual memory management", "Automatic memory management", "File deletion", "Cleaning code"], answer: 1, explanation: "JVM automatically reclaims unused object memory via garbage collection" },
    { id: 8, question: "Which access modifier is most restrictive?", options: ["public", "protected", "default", "private"], answer: 3, explanation: "private restricts access to the class itself only" },
    { id: 9, question: "What is an abstract class?", options: ["Cannot have methods", "Can't be instantiated directly", "Only has static methods", "Same as interface"], answer: 1, explanation: "Abstract classes can't be instantiated; must be subclassed" },
    { id: 10, question: "Output: System.out.println(10/3)?", options: ["3.33", "3", "4", "Error"], answer: 1, explanation: "Integer division: 10/3 = 3 (truncates decimal)" }
  ]
};

// Get questions for a topic
router.get('/questions/:topic', auth, (req, res) => {
  const topic = req.params.topic.toLowerCase();
  const topicQuestions = questions[topic];
  if (!topicQuestions) return res.status(404).json({ message: 'Topic not found' });
  
  // Return questions without answers
  const questionsWithoutAnswers = topicQuestions.map(({ answer, explanation, ...q }) => q);
  res.json({ topic, questions: questionsWithoutAnswers, total: questionsWithoutAnswers.length });
});

// Submit answers and get results
router.post('/submit/:topic', auth, async (req, res) => {
  try {
    const topic = req.params.topic.toLowerCase();
    const topicQuestions = questions[topic];
    if (!topicQuestions) return res.status(404).json({ message: 'Topic not found' });
    
    const { answers } = req.body; // { questionId: selectedOption }
    
    let correct = 0;
    const results = topicQuestions.map(q => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) correct++;
      return {
        id: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: q.answer,
        isCorrect,
        explanation: q.explanation
      };
    });
    
    const score = Math.round((correct / topicQuestions.length) * 100);
    
    // Save to user history
    const user = await User.findById(req.user._id);
    user.testHistory.push({ topic, score: correct, total: topicQuestions.length });
    user.practiceScore = Math.round(
      user.testHistory.reduce((acc, t) => acc + (t.score/t.total)*100, 0) / user.testHistory.length
    );
    await user.save();
    
    let feedback = '';
    if (score >= 80) feedback = 'Excellent! You have a strong grasp of this topic.';
    else if (score >= 60) feedback = 'Good performance! Review the incorrect answers to improve.';
    else if (score >= 40) feedback = 'Average performance. Focus on the fundamentals.';
    else feedback = 'Keep practicing! Review the topics and try again.';
    
    res.json({ score, correct, total: topicQuestions.length, percentage: score, feedback, results });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/topics', auth, (req, res) => {
  res.json({ topics: Object.keys(questions).map(t => ({ id: t, name: t.toUpperCase(), questionCount: questions[t].length })) });
});

module.exports = router;
