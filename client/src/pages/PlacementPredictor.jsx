import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const ProbabilityCircle = ({ value, size = 100 }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? '#10b981' : value >= 50 ? '#f59e0b' : value >= 30 ? '#f97316' : '#ef4444';
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold" style={{ fontSize: size * 0.22, color }}>{value}%</span>
      </div>
    </div>
  );
};

export default function PlacementPredictor() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user?.profileCompleted) fetchPredictions();
  }, [user]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/placement/predict');
      setPredictions(data.predictions);
    } catch (err) {
      toast.error('Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillGap = async (company) => {
    setSelected(company);
    try {
      const { data } = await API.get(`/placement/skill-gap/${company.companyId}`);
      setSkillGap(data);
    } catch (err) {
      toast.error('Failed to fetch skill gap');
    }
  };

  const filtered = predictions.filter(p => {
    if (filter === 'high') return p.selectionProbability >= 60;
    if (filter === 'medium') return p.selectionProbability >= 30 && p.selectionProbability < 60;
    if (filter === 'low') return p.selectionProbability < 30;
    return true;
  });

  if (!user?.profileCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>Complete Your Profile First</h2>
        <p style={{ color: 'var(--text-muted)' }} className="mb-6">Add your skills, projects and experience to get personalized placement predictions</p>
        <Link to="/profile">
          <button className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
            Go to Profile →
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Placement Predictor</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>AI-powered company match analysis based on your profile</p>
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'text-white' : ''}`}
              style={filter === f ? { background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {f === 'all' ? 'All' : f === 'high' ? '60%+ Match' : f === 'medium' ? '30-60%' : 'Under 30%'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Company list */}
        <div className="lg:col-span-2 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="card h-28 shimmer" />
            ))
          ) : filtered.map((p, i) => (
            <div key={p.companyId}
              onClick={() => fetchSkillGap(p)}
              className={`card p-4 cursor-pointer transition-all duration-300 ${selected?.companyId === p.companyId ? 'ring-2 ring-primary-500' : ''}`}
              style={selected?.companyId === p.companyId ? { borderColor: '#4f6ef7' } : {}}>
              <div className="flex items-center gap-4">
                <ProbabilityCircle value={p.selectionProbability} size={60} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{p.companyName}</div>
                  <div className="text-xs mt-1 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}>{p.type}</span>
                    <span>{p.package}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      <span>Skill Match</span><span>{p.matchPercentage}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${p.matchPercentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skill gap detail */}
        <div className="lg:col-span-3">
          {skillGap ? (
            <div className="space-y-4 animate-slide-up">
              <div className="card p-6">
                <h3 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text)' }}>{skillGap.companyName}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{skillGap.company?.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(79,110,247,0.08)' }}>
                    <div className="font-bold text-xl" style={{ color: '#4f6ef7' }}>{skillGap.matchPercentage}%</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Skill Match</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)' }}>
                    <div className="font-bold text-xl" style={{ color: '#10b981' }}>{skillGap.selectionProbability}%</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Current Prob.</div>
                  </div>
                  <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)' }}>
                    <div className="font-bold text-xl" style={{ color: '#f59e0b' }}>{skillGap.potentialProbabilityAfterImprovement}%</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>After Upskilling</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-1" style={{ color: '#10b981' }}>
                      ✅ Matching Skills ({skillGap.matchedRequired?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.matchedRequired?.map(s => (
                        <span key={s} className="skill-badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-1" style={{ color: '#ef4444' }}>
                      ❌ Missing Skills ({skillGap.missingRequired?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skillGap.missingRequired?.map(s => (
                        <span key={s} className="skill-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {skillGap.recommendations?.length > 0 && (
                <div className="card p-6">
                  <h4 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>🎯 Skill Improvement Recommendations</h4>
                  <div className="space-y-4">
                    {skillGap.recommendations.map((rec, i) => (
                      <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{rec.skill}</span>
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>High Priority</span>
                          </div>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⏱ {rec.estimatedTime}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {rec.resources?.map(r => (
                            <span key={r} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(79,110,247,0.08)', color: '#4f6ef7' }}>📚 {r}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection process */}
              <div className="card p-6">
                <h4 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>📋 Selection Process</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  {skillGap.company?.selectionProcess?.map((step, i) => (
                    <React.Fragment key={i}>
                      <span className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}>{step}</span>
                      {i < skillGap.company.selectionProcess.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card h-full flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <div className="text-5xl mb-4">👆</div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>Select a Company</h3>
              <p style={{ color: 'var(--text-muted)' }}>Click on any company to see detailed skill gap analysis and improvement recommendations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
