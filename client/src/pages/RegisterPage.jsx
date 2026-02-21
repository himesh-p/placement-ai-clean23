import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const COLLEGES = [
  "DAIICT - Dhirubhai Ambani Institute of ICT, Gandhinagar",
  "Nirma University, Ahmedabad", "L.D. College of Engineering, Ahmedabad",
  "Ahmedabad University", "PDEU - Pandit Deendayal Energy University, Gandhinagar",
  "SVNIT - Sardar Vallabhbhai National Institute of Technology, Surat",
  "GTU - Gujarat Technological University", "Sardar Patel University, Vallabh Vidyanagar",
  "BVM Engineering College, Vallabh Vidyanagar", "CSPIT - Charotar University of Science and Technology, Anand",
  "GLS University, Ahmedabad", "Silver Oak University, Ahmedabad", "Indus University, Ahmedabad",
  "LDRP Institute of Technology, Gandhinagar", "Ganpat University, Mehsana",
  "Government Engineering College, Rajkot", "Marwadi University, Rajkot",
  "Parul University, Vadodara", "MS University, Vadodara", "KSV University, Gandhinagar"
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', collegeName: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.collegeName) {
      return toast.error('All fields are required');
    }
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.collegeName);
      toast.success('Account created! Complete your profile to get started 🚀');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg)' }}>
      <button onClick={toggle} className="fixed top-4 right-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {dark ? '🌙' : '☀️'}
      </button>

      <div className="w-full max-w-lg animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>AI</div>
          <h1 className="font-display text-3xl font-bold" style={{ color: 'var(--text)' }}>Start your journey</h1>
          <p style={{ color: 'var(--text-muted)' }} className="mt-2">Create your free PlacementAI account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Full Name</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required
                  placeholder="Raj Patel"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>College</label>
                <select value={form.collegeName} onChange={e => set('collegeName', e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: form.collegeName ? 'var(--text)' : 'var(--text-muted)' }}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                  <option value="">Select your college...</option>
                  {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  placeholder="raj@college.edu"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 mt-2"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : 'Create Account & Get Started →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#4f6ef7' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
