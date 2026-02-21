import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [domains, setDomains] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/internships').then(r => {
      setInternships(r.data.internships);
      setDomains(r.data.domains);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? internships : internships.filter(i => i.domain === filter);

  const domainColors = { 'Machine Learning': '#8b5cf6', 'Full Stack': '#4f6ef7', 'Data Science': '#10b981', 'DevOps': '#f59e0b', 'IoT': '#06b6d4', 'Embedded Systems': '#ef4444' };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Internship Opportunities</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Discover internships near you filtered by domain</p>
      </div>

      {/* Domain filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={filter === 'all' ? { background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', color: 'white' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          All ({internships.length})
        </button>
        {domains.map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={filter === d ? { background: domainColors[d] || '#4f6ef7', color: 'white' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-48 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(intern => {
            const color = domainColors[intern.domain] || '#4f6ef7';
            return (
              <div key={intern.id} className="card p-5 gradient-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: color }}>
                      {intern.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{intern.company}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{intern.role}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                    style={{ background: `${color}15`, color }}>
                    {intern.domain}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                  <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{intern.stipend}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Stipend</div>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text)' }}>{intern.duration}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Duration</div>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg)' }}>
                    <div className="font-semibold truncate" style={{ color: 'var(--text)' }}>{intern.location.split('/')[0].trim()}</div>
                    <div style={{ color: 'var(--text-muted)' }}>Location</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {intern.skills?.map(s => (
                    <span key={s} className="skill-badge text-xs" style={{ background: `${color}10`, color, border: `1px solid ${color}30` }}>{s}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Deadline: <span className="font-medium" style={{ color: '#ef4444' }}>{new Date(intern.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <a href={intern.link} target="_blank" rel="noreferrer">
                    <button className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                      style={{ background: color }}>
                      Apply Now →
                    </button>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
