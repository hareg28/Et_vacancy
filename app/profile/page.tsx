'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const SKILLS = ['React', 'Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'AWS'];

const EDUCATION = [
  { id: 'e1', institution: 'Addis Ababa University', degree: 'BSc', field: 'Computer Science', startDate: '2016', endDate: '2020', current: false },
];

const EXPERIENCE = [
  { id: 'x1', company: 'TechCorp Ethiopia', title: 'Software Developer', location: 'Addis Ababa', startDate: '2020-07', endDate: '', current: true, description: 'Built and maintained React/Node.js applications for fintech clients.' },
];

import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState<string>('personal');
  
  // Use session data if available, fallback to default
  const [profile, setProfile] = useState({
    name: session?.user?.name || 'Abebe Bekele', 
    headline: 'Full-Stack Software Engineer', 
    email: session?.user?.email || 'abebe@email.com',
    phone: '+251 91 234 5678', 
    location: 'Addis Ababa, Ethiopia', 
    website: 'https://abebe.dev',
    bio: 'Passionate software engineer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud technologies.',
  });
  
  // Update profile if session changes after mount
  useEffect(() => {
    if (session?.user) {
      queueMicrotask(() => {
        setProfile(p => ({
          ...p,
          name: session.user?.name || p.name,
          email: session.user?.email || p.email
        }));
      });
    }
  }, [session]);

  const [skills, setSkills] = useState<string[]>(SKILLS);
  const [newSkill, setNewSkill] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const sections = [
    { key: 'personal',    label: 'Personal Info',   icon: '👤' },
    { key: 'skills',      label: 'Skills',           icon: '⚡' },
    { key: 'education',   label: 'Education',        icon: '🎓' },
    { key: 'experience',  label: 'Experience',       icon: '💼' },
    { key: 'cv',          label: 'CV / Resume',      icon: '📄' },
    { key: 'security',    label: 'Security',         icon: '🔐' },
  ];

  return (
    <div className="page-content">
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          My <span className="gradient-text">Profile</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Keep your profile up to date to improve your job match score</p>

        {saved && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>✅ Profile updated successfully!</div>}

        {/* Profile completeness */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="avatar avatar-lg">{profile.name.split(' ').map(n => n[0]).join('')}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.2rem' }}>{profile.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{profile.headline}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Profile Strength:</span>
              <div className="progress-bar" style={{ width: 200 }}>
                <div className="progress-fill" style={{ width: '72%' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 700 }}>72%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/dashboard" className="btn-secondary">← Dashboard</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem' }}>
          {/* Sidebar Nav */}
          <div className="sidebar">
            {sections.map(sec => (
              <button key={sec.key} onClick={() => setActiveSection(sec.key)} className={`sidebar-link ${activeSection === sec.key ? 'active' : ''}`} style={{ width: '100%', cursor: 'pointer', border: 'none' }}>
                <span>{sec.icon}</span>{sec.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="glass-panel" style={{ padding: '2rem' }}>

            {/* Personal Info */}
            {activeSection === 'personal' && (
              <form onSubmit={handleSave}>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Personal Information</h2>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Professional Headline</label><input className="form-input" value={profile.headline} onChange={e => setProfile({ ...profile, headline: e.target.value })} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></div>
                </div>
                <div className="grid-2">
                  <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Website / Portfolio</label><input type="url" className="form-input" value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} /></div>
                </div>
                <div className="form-group"><label className="form-label">Bio</label><textarea className="form-textarea" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} /></div>
                <div className="form-group">
                  <label className="form-label">Profile Picture</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="avatar avatar-lg">{profile.name.split(' ').map(n => n[0]).join('')}</div>
                    <button type="button" className="btn-secondary" style={{ fontSize: '0.875rem' }}>Upload Photo</button>
                  </div>
                </div>
                <button type="submit" className="btn-primary">Save Changes</button>
              </form>
            )}

            {/* Skills */}
            {activeSection === 'skills' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Skills & Expertise</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {skills.map(skill => (
                    <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 8, padding: '0.4rem 0.75rem' }}>
                      <span style={{ color: '#a5b4fc', fontSize: '0.875rem', fontWeight: 500 }}>{skill}</span>
                      <button onClick={() => setSkills(skills.filter(s => s !== skill))} style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input className="form-input" placeholder="Add a skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { e.preventDefault(); setSkills([...skills, newSkill.trim()]); setNewSkill(''); } }} />
                  <button className="btn-primary" onClick={() => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } }} style={{ flexShrink: 0 }}>Add</button>
                </div>
              </div>
            )}

            {/* Education */}
            {activeSection === 'education' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Education History</h2>
                  <button className="btn-primary" style={{ fontSize: '0.875rem' }}>+ Add Education</button>
                </div>
                {EDUCATION.map(ed => (
                  <div key={ed.id} className="card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{ed.degree} in {ed.field}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{ed.institution}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{ed.startDate} – {ed.current ? 'Present' : ed.endDate}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
                        <button className="btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {activeSection === 'experience' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Work Experience</h2>
                  <button className="btn-primary" style={{ fontSize: '0.875rem' }}>+ Add Experience</button>
                </div>
                {EXPERIENCE.map(ex => (
                  <div key={ex.id} className="card" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{ex.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{ex.company} · {ex.location}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{ex.startDate} – {ex.current ? 'Present' : ex.endDate}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{ex.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
                        <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Edit</button>
                        <button className="btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CV Upload */}
            {activeSection === 'cv' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>CV / Resume</h2>
                <div style={{ border: '2px dashed rgba(99,102,241,0.3)', borderRadius: 12, padding: '3rem 2rem', textAlign: 'center', marginBottom: '1.5rem', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)')}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                  <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Drag & drop your CV here</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>PDF, DOC, DOCX — max 5MB</p>
                  <button className="btn-primary">Choose File</button>
                </div>
                <div className="alert alert-info">
                  💡 A well-formatted CV increases your chances of getting shortlisted. Our AI can also analyze your CV and provide improvement suggestions.
                </div>
                <button className="btn-secondary" style={{ marginTop: '1rem' }}>🤖 Analyze CV with AI</button>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Security Settings</h2>
                <form onSubmit={e => e.preventDefault()}>
                  <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Change Password</h3>
                  <div className="form-group"><label className="form-label">Current Password</label><input type="password" className="form-input" placeholder="••••••••" /></div>
                  <div className="form-group"><label className="form-label">New Password</label><input type="password" className="form-input" placeholder="Min. 8 characters" /></div>
                  <div className="form-group"><label className="form-label">Confirm New Password</label><input type="password" className="form-input" placeholder="Repeat new password" /></div>
                  <button type="submit" className="btn-primary" style={{ marginBottom: '2rem' }}>Update Password</button>
                  <div className="divider" />
                  <h3 style={{ fontWeight: 600, fontSize: '0.95rem', margin: '1.5rem 0 1rem', color: 'var(--text-secondary)' }}>Danger Zone</h3>
                  <button type="button" className="btn-danger">Delete My Account</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
