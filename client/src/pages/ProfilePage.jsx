import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { API } from '../context/AuthContext';

const SKILLS_LIST = ['Machine Learning', 'Deep Learning', 'Data Science', 'Computer Vision', 'NLP', 'Statistics', 'Problem Solving', 'Data Analysis', 'System Design', 'Agile'];
const LANGS_LIST = ['Python', 'Java', 'JavaScript', 'C++', 'C', 'C#', 'Go', 'Rust', 'TypeScript', 'Kotlin', 'Swift', 'R', 'Scala', 'PHP', 'Ruby'];
const TOOLS_LIST = ['React', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Angular', 'Vue.js', 'GraphQL', 'Jenkins', 'Terraform'];

const TagSelector = ({ label, options, selected, onChange }) => {
  const [input, setInput] = useState('');
  const filtered = options.filter(o => !selected.includes(o) && o.toLowerCase().includes(input.toLowerCase()));

  const add = (item) => { if (!selected.includes(item)) onChange([...selected, item]); setInput(''); };
  const remove = (item) => onChange(selected.filter(s => s !== item));

  return (
    <div>
      <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>{label}</label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[36px]">
        {selected.map(s => (
          <span key={s} className="skill-badge" style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7', border: '1px solid rgba(79,110,247,0.3)' }}>
            {s}
            <button onClick={() => remove(s)} className="ml-1.5 hover:text-red-400 font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={`Search or type ${label.toLowerCase()}...`}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        {input && filtered.length > 0 && (
          <div className="absolute z-20 w-full mt-1 rounded-xl border shadow-lg max-h-40 overflow-y-auto"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {filtered.slice(0, 8).map(o => (
              <button key={o} onClick={() => add(o)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary-500/10 transition-colors"
                style={{ color: 'var(--text)' }}>{o}</button>
            ))}
          </div>
        )}
        {input && !filtered.includes(input) && (
          <button onClick={() => { if (input.trim()) add(input.trim()); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg text-white"
            style={{ background: '#4f6ef7' }}>+ Add</button>
        )}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    skills: [], programmingLanguages: [], tools: [], cgpa: '',
    projects: [], internships: [], certifications: []
  });

  useEffect(() => {
    if (user) {
      setProfile({
        skills: user.skills || [],
        programmingLanguages: user.programmingLanguages || [],
        tools: user.tools || [],
        cgpa: user.cgpa || '',
        projects: user.projects || [],
        internships: user.internships || [],
        certifications: user.certifications || []
      });
    }
  }, [user]);

  const set = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  const addProject = () => set('projects', [...profile.projects, { title: '', description: '', techStack: [], link: '' }]);
  const updateProject = (i, k, v) => {
    const updated = [...profile.projects];
    updated[i] = { ...updated[i], [k]: v };
    set('projects', updated);
  };
  const removeProject = (i) => set('projects', profile.projects.filter((_, idx) => idx !== i));

  const addInternship = () => set('internships', [...profile.internships, { company: '', role: '', duration: '', description: '' }]);
  const updateInternship = (i, k, v) => {
    const updated = [...profile.internships];
    updated[i] = { ...updated[i], [k]: v };
    set('internships', updated);
  };
  const removeInternship = (i) => set('internships', profile.internships.filter((_, idx) => idx !== i));

  const addCert = () => set('certifications', [...profile.certifications, { name: '', issuer: '', year: new Date().getFullYear() }]);
  const updateCert = (i, k, v) => {
    const updated = [...profile.certifications];
    updated[i] = { ...updated[i], [k]: v };
    set('certifications', updated);
  };
  const removeCert = (i) => set('certifications', profile.certifications.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await API.put('/profile', profile);
      updateUser(data.user);
      toast.success('Profile saved successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>Student Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Complete your profile to unlock placement predictions</p>
        </div>
        <button onClick={handleSave} disabled={loading}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70 transition-all"
          style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <span>👤</span> Basic Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Name</label>
            <input value={user?.name || ''} disabled className={inputClass} style={{ ...inputStyle, opacity: 0.7 }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Email</label>
            <input value={user?.email || ''} disabled className={inputClass} style={{ ...inputStyle, opacity: 0.7 }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>College</label>
            <input value={user?.collegeName || ''} disabled className={inputClass} style={{ ...inputStyle, opacity: 0.7 }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>CGPA</label>
            <input type="number" step="0.1" min="0" max="10"
              value={profile.cgpa} onChange={e => set('cgpa', parseFloat(e.target.value))}
              placeholder="e.g. 8.5"
              className={inputClass} style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4f6ef7'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="card p-6 space-y-5">
        <h2 className="font-display font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text)' }}>
          <span>⚡</span> Skills & Technologies
        </h2>
        <TagSelector label="Technical Skills" options={SKILLS_LIST} selected={profile.skills} onChange={v => set('skills', v)} />
        <TagSelector label="Programming Languages" options={LANGS_LIST} selected={profile.programmingLanguages} onChange={v => set('programmingLanguages', v)} />
        <TagSelector label="Frameworks & Tools" options={TOOLS_LIST} selected={profile.tools} onChange={v => set('tools', v)} />
      </div>

      {/* Projects */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span>🛠️</span> Projects
          </h2>
          <button onClick={addProject} className="text-sm px-4 py-2 rounded-xl font-medium" style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}>
            + Add Project
          </button>
        </div>
        <div className="space-y-4">
          {profile.projects.map((project, i) => (
            <div key={i} className="p-4 rounded-xl relative" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <button onClick={() => removeProject(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-500 font-bold text-lg">×</button>
              <div className="grid grid-cols-2 gap-3">
                <input value={project.title} onChange={e => updateProject(i, 'title', e.target.value)}
                  placeholder="Project Title" className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <input value={project.link} onChange={e => updateProject(i, 'link', e.target.value)}
                  placeholder="GitHub/Demo Link" className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <textarea value={project.description} onChange={e => updateProject(i, 'description', e.target.value)}
                  placeholder="Project description..." rows={2}
                  className={`${inputClass} col-span-2 resize-none`} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#4f6ef7'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>
          ))}
          {profile.projects.length === 0 && (
            <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
              No projects added yet. Click "+ Add Project" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Internships */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span>💼</span> Internships
          </h2>
          <button onClick={addInternship} className="text-sm px-4 py-2 rounded-xl font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
            + Add Internship
          </button>
        </div>
        <div className="space-y-4">
          {profile.internships.map((intern, i) => (
            <div key={i} className="p-4 rounded-xl relative" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <button onClick={() => removeInternship(i)} className="absolute top-3 right-3 text-red-400 font-bold text-lg">×</button>
              <div className="grid grid-cols-2 gap-3">
                <input value={intern.company} onChange={e => updateInternship(i, 'company', e.target.value)}
                  placeholder="Company Name" className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <input value={intern.role} onChange={e => updateInternship(i, 'role', e.target.value)}
                  placeholder="Role / Position" className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <input value={intern.duration} onChange={e => updateInternship(i, 'duration', e.target.value)}
                  placeholder="Duration (e.g. 3 months)" className={inputClass} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                <textarea value={intern.description} onChange={e => updateInternship(i, 'description', e.target.value)}
                  placeholder="What you did..." rows={1}
                  className={`${inputClass} resize-none`} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#10b981'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <span>🏆</span> Certifications
          </h2>
          <button onClick={addCert} className="text-sm px-4 py-2 rounded-xl font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
            + Add Cert
          </button>
        </div>
        <div className="space-y-3">
          {profile.certifications.map((cert, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-xl relative" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <button onClick={() => removeCert(i)} className="absolute top-3 right-3 text-red-400 font-bold">×</button>
              <input value={cert.name} onChange={e => updateCert(i, 'name', e.target.value)}
                placeholder="Certificate Name" className={`${inputClass} flex-1`} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <input value={cert.issuer} onChange={e => updateCert(i, 'issuer', e.target.value)}
                placeholder="Issuer (e.g. Coursera)" className={`${inputClass} flex-1`} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <input type="number" value={cert.year} onChange={e => updateCert(i, 'year', parseInt(e.target.value))}
                placeholder="Year" className={`${inputClass} w-24`} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#f59e0b'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave} disabled={loading}
        className="w-full py-4 rounded-xl text-white font-semibold disabled:opacity-70 transition-all"
        style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
        {loading ? 'Saving your profile...' : '💾 Save Profile'}
      </button>
    </div>
  );
}
