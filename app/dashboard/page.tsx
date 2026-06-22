'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { mockJobs, mockApplications } from '@/lib/mock-data';

const MOCK_APPLICATIONS = [
  { id: 'a1', jobTitle: 'Senior Software Engineer', company: 'Ethio Telecom', status: 'INTERVIEWING', dateApplied: '2026-06-15', logo: null },
  { id: 'a2', jobTitle: 'Product Designer', company: 'Flutterwave', status: 'REVIEWED', dateApplied: '2026-06-18', logo: null },
  { id: 'a3', jobTitle: 'UX Researcher', company: 'Creative Labs', status: 'REJECTED', dateApplied: '2026-06-10', logo: null },
  { id: 'a4', jobTitle: 'Data Analyst', company: 'CBE', status: 'PENDING', dateApplied: '2026-06-19', logo: null },
];

const SAVED_JOBS = [
  { id: '4', title: 'Marketing Manager', company: 'Safaricom Ethiopia', salary: '55,000–85,000 ETB', location: 'Addis Ababa' },
  { id: '9', title: 'Program Officer', company: 'UNICEF Ethiopia', salary: 'Competitive', location: 'Addis Ababa' },
];

const RECOMMENDED = [
  { id: '5', title: 'Backend Developer (Python)', company: 'Kifiya Financial', salary: '70,000–100,000 ETB', matchScore: 94 },
  { id: '7', title: 'Full-Stack Engineer', company: 'M-Pesa Africa', salary: '90,000–130,000 ETB', matchScore: 88 },
  { id: '8', title: 'DevOps Engineer', company: 'CBE Digital', salary: '85,000–115,000 ETB', matchScore: 82 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:      { label: 'Pending Review', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
  REVIEWED:     { label: 'Under Review',   color: '#93c5fd', bg: 'rgba(59,130,246,0.1)'  },
  INTERVIEWING: { label: 'Interviewing',   color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)'  },
  ACCEPTED:     { label: 'Accepted! 🎉',   color: '#a5b4fc', bg: 'rgba(99,102,241,0.15)' },
  REJECTED:     { label: 'Not Selected',   color: '#fb7185', bg: 'rgba(244,63,94,0.1)'   },
};

const STATUS_STEPS = ['PENDING', 'REVIEWED', 'INTERVIEWING', 'ACCEPTED'];

function StatusTracker({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  const isRejected = status === 'REJECTED';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: '1rem' }}>
      {STATUS_STEPS.map((step, i) => {
        const isDone = currentIdx >= i && !isRejected;
        const isCurrent = currentIdx === i && !isRejected;
        const label = { PENDING: 'Applied', REVIEWED: 'Reviewed', INTERVIEWING: 'Interview', ACCEPTED: 'Hired' }[step];
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: isDone ? (isCurrent ? '#6366f1' : 'rgba(99,102,241,0.4)') : 'var(--bg-tertiary)',
                border: `2px solid ${isDone ? '#6366f1' : 'var(--border-color)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isCurrent ? '0 0 12px rgba(99,102,241,0.5)' : 'none',
              }}>
                {isDone && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span style={{ fontSize: '0.7rem', color: isDone ? '#a5b4fc' : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 2, background: isDone ? 'rgba(99,102,241,0.5)' : 'var(--border-color)', margin: '0 4px', marginBottom: '1.2rem' }} />}
          </div>
        );
      })}
      {isRejected && <span className="badge badge-rose" style={{ marginLeft: '1rem' }}>Not Selected</span>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'recommended'>('applications');
  const [, forceUpdate] = useState(0); // To refresh when mock data changes
  
  // Periodically refresh the UI to show new jobs/applications
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Filter applications for current jobseeker
  const currentJobSeekerId = (session?.user as any)?.id || '1';
  const userApplications = mockApplications.filter(a => a.jobSeekerId === currentJobSeekerId);
  
  const stats = [
    { value: userApplications.length, label: 'Total Applied', icon: '📤', color: '#a5b4fc' },
    { value: userApplications.filter(a => a.status === 'INTERVIEWED' || a.status === 'SHORTLISTED').length, label: 'Interviews', icon: '🎙️', color: '#6ee7b7' },
    { value: 0, label: 'Saved Jobs', icon: '🔖', color: '#fbbf24' },
    { value: userApplications.filter(a => a.status === 'ACCEPTED').length, label: 'Offers', icon: '🏆', color: '#f59e0b' },
  ];

  return (
    <div className="page-content">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Welcome back, <span className="gradient-text">{session?.user?.name || 'Abebe'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Track your job applications and discover new opportunities</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/profile" className="btn-secondary">Edit Profile</Link>
            <Link href="/jobs" className="btn-primary">Browse Jobs →</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4 stagger-children" style={{ marginBottom: '2.5rem' }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card animate-fade-in-up">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Interview Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.08))',
          border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16, padding: '1.5rem',
          marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ fontSize: '2.5rem' }}>📅</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Upcoming Interview – <span className="gradient-text">Ethio Telecom</span></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Tomorrow, June 21 · 10:00 AM · Video Call</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-success">Join Meeting</button>
            <button className="btn-secondary">Reschedule</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          {([
            { key: 'applications', label: 'My Applications', count: userApplications.length },
            { key: 'saved', label: 'Saved Jobs', count: 0 },
            { key: 'recommended', label: '✨ Recommended', count: mockJobs.length },
          ] as { key: typeof activeTab; label: string; count: number }[]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: 600,
              color: activeTab === tab.key ? '#a5b4fc' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab.key ? '#6366f1' : 'transparent'}`,
              background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              {tab.label}
              <span style={{
                background: activeTab === tab.key ? 'rgba(99,102,241,0.2)' : 'var(--bg-tertiary)',
                color: activeTab === tab.key ? '#a5b4fc' : 'var(--text-muted)',
                padding: '0.1rem 0.5rem', borderRadius: 99, fontSize: '0.75rem',
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {userApplications.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7h-9a2 2 0 00-2 2v10a2 2 0 002 2h9a2 2 0 002-2V9a2 2 0 00-2-2zM16 5H4a2 2 0 00-2 2v10a2 2 0 002 2" />
                </svg>
                <h3>No Applications Yet</h3>
                <p>Start browsing jobs to find your next opportunity!</p>
                <Link href="/jobs" className="btn-primary" style={{ marginTop: '1rem' }}>Browse Jobs</Link>
              </div>
            ) : (
              userApplications.map(app => {
                const config = STATUS_CONFIG[app.status] || { label: 'Pending Review', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' };
                const job = mockJobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="glass-panel" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="avatar" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #10b981)' }}>
                          {job?.company?.name?.substring(0, 2).toUpperCase() || '??'}
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                            <Link href={`/jobs/${app.jobId}`} style={{ transition: 'color 0.2s' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#a5b4fc')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}>
                              {app.jobTitle}
                            </Link>
                          </h3>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{job?.company?.name || 'Unknown Company'}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                        <span style={{ padding: '0.3rem 0.875rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, background: config.bg, color: config.color }}>
                          {config.label}
                        </span>
                        {app.status !== 'REJECTED' && app.status !== 'ACCEPTED' && (
                          <button className="btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Withdraw</button>
                        )}
                      </div>
                    </div>
                    <StatusTracker status={app.status === 'SHORTLISTED' ? 'REVIEWED' : app.status} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {SAVED_JOBS.map(job => (
              <div key={job.id} className="card">
                <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{job.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{job.company}</p>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <span>📍 {job.location}</span>
                  <span>💰 {job.salary}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link href={`/jobs/${job.id}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.875rem', padding: '0.6rem' }}>Apply Now</Link>
                  <button className="btn-danger" style={{ padding: '0.6rem 0.875rem', fontSize: '0.875rem' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommended' && (
          <div>
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
              ✨ <strong>AI-Powered:</strong> These jobs are matched to your profile, skills, and application history.
            </div>
            {mockJobs.length === 0 ? (
              <div className="empty-state">
                <h3>No Jobs Available</h3>
                <p>Check back later for new job postings!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {mockJobs.map(job => (
                  <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontWeight: 700 }}>{job.title}</h3>
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>90% match</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{job.company.name} · {job.salary}</p>
                    </div>
                    <Link href={`/jobs/${job.id}`} className="btn-primary" style={{ fontSize: '0.875rem' }}>View Job →</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
