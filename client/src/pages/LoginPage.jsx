import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      {/* Dark mode toggle */}
      <button onClick={toggle} className="fixed top-4 right-4 z-50 w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {dark ? '🌙' : '☀️'}
      </button>

      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: `${100 + i * 80}px`, height: `${100 + i * 80}px`,
                left: `${Math.random() * 80}%`, top: `${Math.random() * 80}%`,
                background: `radial-gradient(circle, rgba(79,110,247,${0.1 - i*0.01}) 0%, transparent 70%)`,
                animation: `float ${3 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white p-12">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl font-black"
            style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>AI</div>
          <h1 className="font-display text-4xl font-bold mb-4">PlacementAI</h1>
          <p className="text-blue-200 text-lg max-w-sm mx-auto leading-relaxed">
            Your intelligent career growth ecosystem. Get placed at your dream company.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[['500+', 'Students Placed'], ['50+', 'Partner Companies'], ['95%', 'Accuracy Rate'], ['12+', 'Learning Paths']].map(([num, label]) => (
              <div key={label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="text-2xl font-bold text-white">{num}</div>
                <div className="text-xs text-blue-200 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)' }}>Sign in to your career dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@college.edu"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all pr-12"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}
              onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-1px)')}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: '#4f6ef7' }}>Create one free</Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)', color: 'var(--text-muted)' }}>
            💡 <strong>Demo:</strong> Register a new account to explore all features with your personalized data.
          </div>
        </div>
      </div>
    </div>
  );
}
