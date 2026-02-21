import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const ScoreGauge = ({ score }) => {
  const angle = (score / 100) * 180;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#4f6ef7' : score >= 40 ? '#f59e0b' : '#ef4444';
  const grade = score >= 85 ? 'A+' : score >= 75 ? 'A' : score >= 65 ? 'B+' : score >= 55 ? 'B' : 'C';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        <svg width="192" height="96" viewBox="0 0 192 96">
          <path d="M16,96 A80,80 0 0,1 176,96" fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round"/>
          <path d="M16,96 A80,80 0 0,1 176,96" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251} 251`} style={{ transition: 'stroke-dasharray 1.5s ease' }}/>
          <circle cx={96 + 80 * Math.cos((angle - 180) * Math.PI / 180)} cy={96 + 80 * Math.sin((angle - 180) * Math.PI / 180)}
            r="8" fill={color} style={{ transition: 'all 1.5s ease' }}/>
        </svg>
      </div>
      <div className="font-display text-5xl font-black -mt-4" style={{ color }}>{score}</div>
      <div className="text-xl font-bold mt-1" style={{ color }}>Grade {grade}</div>
      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Resume Score</div>
    </div>
  );
};

export default function ResumeOptimizer() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('text');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (f && f.type === 'application/pdf') { setFile(f); setMode('file'); }
    else toast.error('Please upload a PDF file');
  };

  const analyze = async () => {
    setLoading(true);
    try {
      let res;
      if (mode === 'file' && file) {
        const fd = new FormData();
        fd.append('resume', file);
        res = await API.post('/resume/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else if (mode === 'text' && text.trim()) {
        res = await API.post('/resume/analyze', { resumeText: text });
      } else {
        // Profile-based scoring
        res = await API.get('/resume/score');
      }
      setResult(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>AI Resume Optimizer</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Get ML-powered feedback and improve your resume score</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>Upload Resume</h2>
            
            {/* Mode selector */}
            <div className="flex gap-2 mb-4">
              {[['file', '📁 PDF Upload'], ['text', '✍️ Paste Text'], ['profile', '👤 From Profile']].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={mode === m ? { background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', color: 'white' } : { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  {label}
                </button>
              ))}
            </div>

            {mode === 'file' && (
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                style={{ borderColor: dragOver ? '#4f6ef7' : 'var(--border)', background: dragOver ? 'rgba(79,110,247,0.05)' : 'var(--bg)' }}
                onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                <div className="text-4xl mb-3">📄</div>
                {file ? (
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#10b981' }}>✓ {file.name}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Drop your resume here</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PDF format, max 10MB</p>
                  </div>
                )}
              </div>
            )}

            {mode === 'text' && (
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="Paste your resume text here...&#10;&#10;Include: Education, Skills, Projects, Internships, Certifications"
                rows={10} className="w-full p-4 rounded-xl text-sm outline-none resize-none"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            )}

            {mode === 'profile' && (
              <div className="p-5 rounded-xl text-sm" style={{ background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)' }}>
                <p style={{ color: '#4f6ef7' }}>
                  📊 We'll analyze your resume based on your <strong>profile data</strong> — skills, projects, internships, and certifications you've added.
                </p>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Make sure your profile is complete for accurate results.
                </p>
              </div>
            )}

            <button onClick={analyze} disabled={loading || (mode === 'file' && !file) || (mode === 'text' && !text.trim())}
              className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing with AI...
                </span>
              ) : '🔍 Analyze Resume'}
            </button>
          </div>

          {/* Tips */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text)' }}>💡 Resume Best Practices</h3>
            <div className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              {['Use action verbs: Built, Developed, Led, Implemented', 'Quantify achievements: 40% improvement, 1000+ users', 'Include GitHub links for all projects', 'List relevant certifications with issuer and year', 'Keep it 1 page for freshers', 'Use ATS-friendly format (no tables/images)'].map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span style={{ color: '#4f6ef7' }}>✓</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div>
          {result ? (
            <div className="space-y-4 animate-slide-up">
              <div className="card p-8 text-center">
                <ScoreGauge score={result.score} />
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  Analyzed on {new Date(result.analyzedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div className="card p-5">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2" style={{ color: '#10b981' }}>
                  ✅ Strengths ({result.strengths?.length || 0})
                </h3>
                <div className="space-y-2">
                  {result.strengths?.map((s, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span style={{ color: 'var(--text)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2" style={{ color: '#ef4444' }}>
                  ⚠️ Areas to Improve
                </h3>
                <div className="space-y-2">
                  {result.weakPoints?.map((w, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-red-400">✗</span>
                      <span style={{ color: 'var(--text)' }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-display font-bold mb-4" style={{ color: '#4f6ef7' }}>💡 Suggestions</h3>
                <div className="space-y-3">
                  {result.suggestions?.map((s, i) => (
                    <div key={i} className="flex gap-3 text-sm p-3 rounded-xl" style={{ background: 'rgba(79,110,247,0.06)' }}>
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                        style={{ background: '#4f6ef7' }}>{i+1}</span>
                      <span style={{ color: 'var(--text)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <div className="text-6xl mb-4 animate-float">📄</div>
              <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Ready to Analyze</h3>
              <p style={{ color: 'var(--text-muted)' }}>Upload your resume or paste text and click Analyze to get your AI-powered resume score</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
