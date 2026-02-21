import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

const STREAM_ICONS = { fullstack: '🌐', ml: '🤖', datascience: '📊', backend: '⚙️', devops: '🚀' };
const CATEGORY_COLORS = {
  Frontend: '#4f6ef7', Backend: '#10b981', DevOps: '#f59e0b', ML: '#8b5cf6',
  'Deep Learning': '#6d28d9', Data: '#06b6d4', Programming: '#4f6ef7', Mathematics: '#ef4444',
  Statistics: '#f97316', Database: '#10b981', Visualization: '#8b5cf6', 'Big Data': '#0ea5e9',
  'Soft Skills': '#f59e0b', 'CS Fundamentals': '#4f6ef7', APIs: '#10b981', Security: '#ef4444',
  Performance: '#f97316', Architecture: '#8b5cf6', IaC: '#06b6d4', Networking: '#f59e0b',
  VCS: '#10b981', Containers: '#4f6ef7', Orchestration: '#8b5cf6', 'CI/CD': '#f97316',
  Cloud: '#0ea5e9', Monitoring: '#10b981', Specialization: '#6d28d9', Deployment: '#f59e0b',
  Projects: '#ef4444', Fundamentals: '#4f6ef7'
};

export default function RoadmapPage() {
  const [streams, setStreams] = useState([]);
  const [selected, setSelected] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/roadmap/streams').then(r => setStreams(r.data.streams)).catch(() => {});
    // Load saved progress
    const saved = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    setProgress(saved);
  }, []);

  const loadRoadmap = async (streamId) => {
    setSelected(streamId);
    setLoading(true);
    setAnimating(false);
    try {
      const { data } = await API.get(`/roadmap/${streamId}`);
      setRoadmap(data);
      setTimeout(() => setAnimating(true), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepId) => {
    const key = `${selected}_${stepId}`;
    const saved = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    if (saved[key]) delete saved[key];
    else saved[key] = true;
    localStorage.setItem('roadmapProgress', JSON.stringify(saved));
    setProgress(saved);
  };

  const isCompleted = (stepId) => progress[`${selected}_${stepId}`];
  const completedCount = roadmap?.steps?.filter(s => isCompleted(s.id)).length || 0;
  const completedWeeks = roadmap?.steps?.filter(s => isCompleted(s.id)).reduce((acc, s) => acc + s.weeks, 0) || 0;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Learning Roadmaps</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Follow an animated, step-by-step career path with time estimates</p>
      </div>

      {/* Stream selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {streams.map(stream => (
          <button key={stream.id} onClick={() => loadRoadmap(stream.id)}
            className={`card p-4 text-center transition-all cursor-pointer ${selected === stream.id ? 'ring-2 ring-primary-500' : ''}`}
            style={selected === stream.id ? { borderColor: '#4f6ef7', background: 'rgba(79,110,247,0.08)' } : {}}>
            <div className="text-3xl mb-2">{STREAM_ICONS[stream.id]}</div>
            <div className="text-xs font-semibold" style={{ color: selected === stream.id ? '#4f6ef7' : 'var(--text)' }}>
              {stream.title}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stream.totalWeeks} weeks</div>
          </button>
        ))}
      </div>

      {/* Roadmap display */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p style={{ color: 'var(--text-muted)' }}>Generating your roadmap...</p>
        </div>
      )}

      {roadmap && !loading && (
        <div>
          {/* Progress header */}
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>{roadmap.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {completedCount}/{roadmap.steps.length} steps completed • {completedWeeks}/{roadmap.totalWeeks} weeks done
                </p>
              </div>
              <div className="text-right">
                <div className="font-display font-bold text-3xl gradient-text">
                  {Math.round((completedCount / roadmap.steps.length) * 100)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Complete</div>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(completedCount / roadmap.steps.length) * 100}%` }} />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-4 bottom-4 w-0.5" style={{ background: 'linear-gradient(to bottom, #4f6ef7, transparent)' }} />
            
            <div className="space-y-4">
              {roadmap.steps.map((step, i) => {
                const completed = isCompleted(step.id);
                const catColor = CATEGORY_COLORS[step.category] || '#4f6ef7';
                const delay = animating ? i * 0.1 : 0;
                
                return (
                  <div key={step.id}
                    className="relative flex gap-6 cursor-pointer"
                    style={{
                      opacity: animating ? 1 : 0,
                      transform: animating ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `all 0.5s ease ${delay}s`
                    }}
                    onClick={() => toggleStep(step.id)}>
                    
                    {/* Node */}
                    <div className="flex-shrink-0 w-16 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 transition-all duration-300 ${completed ? 'roadmap-node' : ''}`}
                        style={{
                          background: completed ? catColor : 'var(--border)',
                          boxShadow: completed ? `0 0 15px ${catColor}50` : 'none',
                          border: `2px solid ${catColor}`
                        }}>
                        {completed ? '✓' : i + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`card flex-1 p-5 transition-all duration-300 ${completed ? 'opacity-80' : ''}`}
                      style={completed ? { borderColor: catColor, background: `${catColor}08` } : {}}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold" style={{ color: completed ? catColor : 'var(--text)', textDecoration: completed ? 'line-through' : 'none' }}>
                            {step.skill}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${catColor}15`, color: catColor }}>
                            {step.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs px-3 py-1 rounded-full font-semibold"
                            style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}>
                            ⏱ {step.weeks} {step.weeks === 1 ? 'week' : 'weeks'}
                          </span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all`}
                            style={{ borderColor: catColor, background: completed ? catColor : 'transparent', color: completed ? 'white' : catColor }}>
                            {completed && '✓'}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.resources?.map(r => (
                          <span key={r} className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                            📚 {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!selected && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Choose Your Career Path</h3>
          <p style={{ color: 'var(--text-muted)' }}>Select a stream above to see your personalized animated learning roadmap</p>
        </div>
      )}
    </div>
  );
}
