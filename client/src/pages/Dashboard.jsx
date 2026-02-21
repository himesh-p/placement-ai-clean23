import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';

const StatCard = ({ label, value, icon, color, sublabel }) => (
  <div className="card p-5 animate-fade-in">
    <div className="flex items-start justify-between mb-3">
      <div className="text-2xl">{icon}</div>
      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: `${color}20`, color }}>
        {sublabel}
      </span>
    </div>
    <div className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>{value}</div>
    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
  </div>
);

const QuickAction = ({ icon, label, to, gradient }) => (
  <Link to={to}>
    <div className="card p-5 cursor-pointer group hover:shadow-lg transition-all duration-300 border-transparent"
      style={{ background: gradient, color: 'white' }}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs opacity-80 mt-1">Get started →</div>
    </div>
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  useEffect(() => {
    if (user?.profileCompleted) {
      setLoadingPredictions(true);
      API.get('/placement/predict')
        .then(r => setPredictions(r.data.predictions?.slice(0, 4) || []))
        .catch(() => {})
        .finally(() => setLoadingPredictions(false));
    }
  }, [user]);

  const stats = [
    { label: 'Skill Score', value: `${user?.skillScore || 0}`, icon: '⚡', color: '#4f6ef7', sublabel: '/100' },
    { label: 'Resume Score', value: `${user?.resumeScore || 0}`, icon: '📄', color: '#10b981', sublabel: '/100' },
    { label: 'Practice Score', value: `${user?.practiceScore || 0}%`, icon: '🎯', color: '#f59e0b', sublabel: 'avg' },
    { label: 'Total Skills', value: `${(user?.skills?.length || 0) + (user?.programmingLanguages?.length || 0)}`, icon: '🛠', color: '#8b5cf6', sublabel: 'tagged' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="gradient-border">
        <div className="card p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #4f6ef7, transparent)', transform: 'translate(30%, -30%)' }}/>
          <div className="relative">
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              Hello, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {user?.profileCompleted
                ? `You're on track to get placed. Keep pushing! 🚀`
                : 'Complete your profile to unlock AI-powered placement predictions.'}
            </p>
            {!user?.profileCompleted && (
              <Link to="/profile">
                <button className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
                  Complete Profile →
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction icon="🎯" label="Placement Predictor" to="/placement" gradient="linear-gradient(135deg, #4f6ef7, #7c3aed)" />
          <QuickAction icon="📄" label="Resume Optimizer" to="/resume" gradient="linear-gradient(135deg, #10b981, #059669)" />
          <QuickAction icon="🗺️" label="Learning Roadmap" to="/roadmap" gradient="linear-gradient(135deg, #f59e0b, #d97706)" />
          <QuickAction icon="💬" label="AI Career Chatbot" to="/chatbot" gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)" />
        </div>
      </div>

      {/* Top Company Matches */}
      {user?.profileCompleted && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>Top Company Matches</h2>
            <Link to="/placement" className="text-sm font-medium" style={{ color: '#4f6ef7' }}>View all →</Link>
          </div>
          
          {loadingPredictions ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="card p-5 h-24 shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((p, i) => (
                <div key={p.companyId} className="card p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: ['linear-gradient(135deg, #4f6ef7,#7c3aed)', 'linear-gradient(135deg, #10b981,#059669)', 'linear-gradient(135deg, #f59e0b,#d97706)', 'linear-gradient(135deg, #ef4444,#dc2626)'][i % 4] }}>
                    {p.companyName.substring(0, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{p.companyName}</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Match: {p.matchPercentage}%</div>
                    <div className="progress-bar mt-2">
                      <div className="progress-fill" style={{ width: `${p.matchPercentage}%` }} />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-lg" style={{ color: p.selectionProbability >= 60 ? '#10b981' : p.selectionProbability >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {p.selectionProbability}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>probability</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity / Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>📚 Today's Tips</h3>
          <div className="space-y-3">
            {[
              'Practice 5 LeetCode problems daily for consistent improvement',
              'Update your GitHub with recent projects to boost your profile',
              'Attend mock interviews to build confidence and communication',
              'Research company culture before applying — it shows in interviews'
            ].map((tip, i) => (
              <div key={i} className="flex gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white font-bold"
                  style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', marginTop: '2px' }}>{i+1}</span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--text)' }}>🏆 Profile Completion</h3>
          <div className="space-y-4">
            {[
              { label: 'Basic Info', done: true },
              { label: 'Skills & Languages', done: (user?.skills?.length || 0) > 0 },
              { label: 'Projects', done: (user?.projects?.length || 0) > 0 },
              { label: 'Internships', done: (user?.internships?.length || 0) > 0 },
              { label: 'Resume Score', done: (user?.resumeScore || 0) > 0 },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text)' }}>{item.label}</span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${item.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'} text-white`}>
                  {item.done ? '✓' : '·'}
                </span>
              </div>
            ))}
          </div>
          <Link to="/profile">
            <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ border: '1px solid #4f6ef7', color: '#4f6ef7' }}>
              Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
