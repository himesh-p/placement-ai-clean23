import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/alumni'), API.get('/alumni/companies')])
      .then(([a, c]) => { setAlumni(a.data.alumni); setCompanies(c.data.companies); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? alumni : alumni.filter(a => a.company === filter);

  const bgForCompany = (company) => {
    const map = { 'Google': '#4285F4', 'Microsoft': '#00BCF2', 'Amazon': '#FF9900', 'TCS': '#1C3A68', 'Infosys': '#007CC3', 'Wipro': '#341C6B', 'Accenture': '#A100FF', 'Deloitte': '#86BC25', 'Cognizant': '#1A6696', 'Jio Platforms': '#0066CC', 'L&T Technology Services': '#E31E24' };
    return map[company] || '#4f6ef7';
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Alumni Network</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Connect with seniors working at top companies • {alumni.length} alumni</p>
      </div>

      {/* Company filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('all')}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
          style={filter === 'all' ? { background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', color: 'white' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          All Companies
        </button>
        {companies.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={filter === c ? { background: bgForCompany(c), color: 'white' } : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {c.split(' ')[0]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="card h-48 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map(alum => (
            <div key={alum.id} className="card p-5 gradient-border">
              <div className="flex items-start gap-4 mb-4">
                <img src={alum.avatar} alt={alum.name} className="w-14 h-14 rounded-xl flex-shrink-0"
                  style={{ border: `2px solid ${bgForCompany(alum.company)}` }} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{alum.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{alum.role}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: bgForCompany(alum.company) }} />
                    <span className="text-xs font-medium" style={{ color: bgForCompany(alum.company) }}>{alum.company}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {alum.skills?.map(s => (
                  <span key={s} className="skill-badge text-xs" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Class of {alum.graduationYear} • {alum.college?.split(' ')[0]}</span>
                <span>📍 {alum.location}</span>
              </div>

              <a href={alum.linkedin} target="_blank" rel="noreferrer" className="block mt-3">
                <button className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: bgForCompany(alum.company) }}>
                  View LinkedIn Profile →
                </button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
