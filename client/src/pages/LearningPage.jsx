import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { API } from '../context/AuthContext';

const TOPICS = [
  { id: 'aptitude', label: 'Aptitude', icon: '🧮', color: '#4f6ef7', desc: 'Quantitative, Logical, Verbal' },
  { id: 'dsa', label: 'DSA', icon: '🌳', color: '#10b981', desc: 'Data Structures & Algorithms' },
  { id: 'python', label: 'Python', icon: '🐍', color: '#f59e0b', desc: 'Core Python concepts' },
  { id: 'sql', label: 'SQL', icon: '🗄️', color: '#8b5cf6', desc: 'Database queries' },
  { id: 'java', label: 'Java', icon: '☕', color: '#ef4444', desc: 'Java fundamentals' },
];

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState('practice');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadTopic = async (topicId) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const { data } = await API.get(`/learning/questions/${topicId}`);
      setQuestions(data.questions);
      setSelectedTopic(topicId);
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qId, optionIndex) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [qId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post(`/learning/submit/${selectedTopic}`, { answers });
      setResult(data);
      setSubmitted(true);
    } catch (err) {
      toast.error('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  const getOptionStyle = (q, optIdx) => {
    if (!submitted) {
      return answers[q.id] === optIdx
        ? { background: 'rgba(79,110,247,0.15)', border: '2px solid #4f6ef7', color: '#4f6ef7' }
        : { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' };
    }
    const res = result?.results?.find(r => r.id === q.id);
    if (optIdx === res?.correctAnswer) return { background: 'rgba(16,185,129,0.12)', border: '2px solid #10b981', color: '#10b981' };
    if (answers[q.id] === optIdx && !res?.isCorrect) return { background: 'rgba(239,68,68,0.12)', border: '2px solid #ef4444', color: '#ef4444' };
    return { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' };
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Learning & Practice</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Test your knowledge with topic-wise MCQs and improve your skills</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['practice', 'testpapers'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all`}
            style={activeTab === tab ? { background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', color: 'white' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {tab === 'practice' ? '⚡ Practice Mode' : '📋 Test Papers'}
          </button>
        ))}
      </div>

      {activeTab === 'practice' && (
        <div>
          {/* Topic grid */}
          {!selectedTopic && (
            <div>
              <h2 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>Choose a Topic</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {TOPICS.map(t => (
                  <button key={t.id} onClick={() => loadTopic(t.id)}
                    className="card p-5 text-center cursor-pointer hover:shadow-lg transition-all duration-300 group">
                    <div className="text-3xl mb-3">{t.icon}</div>
                    <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{t.label}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t.desc}</div>
                    <div className="mt-3 text-xs font-medium" style={{ color: t.color }}>Start →</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {selectedTopic && !loading && questions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => { setSelectedTopic(null); setResult(null); setSubmitted(false); setAnswers({}); }}
                    className="p-2 rounded-xl transition-all" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    ← Back
                  </button>
                  <div>
                    <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
                      {TOPICS.find(t => t.id === selectedTopic)?.label} Quiz
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {Object.keys(answers).length}/{questions.length} answered
                    </p>
                  </div>
                </div>
                {!submitted ? (
                  <button onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    Submit Quiz →
                  </button>
                ) : (
                  <button onClick={() => { setSelectedTopic(null); setResult(null); setSubmitted(false); setAnswers({}); }}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
                    Try Another Topic
                  </button>
                )}
              </div>

              {/* Result banner */}
              {result && (
                <div className="card p-6 mb-6 text-center animate-slide-up" style={{ border: `2px solid ${result.percentage >= 60 ? '#10b981' : '#ef4444'}` }}>
                  <div className="text-5xl mb-2">{result.percentage >= 80 ? '🎉' : result.percentage >= 60 ? '👍' : result.percentage >= 40 ? '💪' : '📚'}</div>
                  <div className="font-display text-4xl font-bold mb-2"
                    style={{ color: result.percentage >= 60 ? '#10b981' : '#ef4444' }}>
                    {result.score}/{result.total}
                  </div>
                  <div className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{result.percentage}% Score</div>
                  <p style={{ color: 'var(--text-muted)' }}>{result.feedback}</p>
                </div>
              )}

              {/* Questions list */}
              <div className="space-y-6">
                {questions.map((q, qi) => {
                  const res = result?.results?.find(r => r.id === q.id);
                  return (
                    <div key={q.id} className="card p-6">
                      <div className="flex gap-3 mb-4">
                        <span className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: submitted ? (res?.isCorrect ? '#10b981' : '#ef4444') : '#4f6ef7' }}>
                          {qi + 1}
                        </span>
                        <p className="font-medium" style={{ color: 'var(--text)' }}>{q.question}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((opt, i) => (
                          <button key={i} onClick={() => handleAnswer(q.id, i)}
                            className="p-3 rounded-xl text-sm text-left transition-all font-medium"
                            style={getOptionStyle(q, i)}>
                            <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                          </button>
                        ))}
                      </div>
                      {submitted && res?.explanation && (
                        <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: 'rgba(79,110,247,0.08)', color: '#4f6ef7', border: '1px solid rgba(79,110,247,0.2)' }}>
                          💡 <strong>Explanation:</strong> {res.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p style={{ color: 'var(--text-muted)' }}>Loading questions...</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'testpapers' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>Previous Year Placement Papers</h2>
          {[
            { company: 'TCS', year: 2024, type: 'Aptitude + Technical', questions: 90 },
            { company: 'Infosys', year: 2024, type: 'Hackathon + MCQ', questions: 80 },
            { company: 'Wipro', year: 2023, type: 'Aptitude + Coding', questions: 70 },
            { company: 'Accenture', year: 2023, type: 'Reasoning + Technical', questions: 85 },
            { company: 'Cognizant', year: 2022, type: 'Aptitude + Communication', questions: 75 },
          ].map(paper => (
            <div key={paper.company + paper.year} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
                  {paper.company.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text)' }}>{paper.company} - {paper.year}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{paper.type} • {paper.questions} questions</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setActiveTab('practice'); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}>
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
