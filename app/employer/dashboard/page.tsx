'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { mockJobs, mockApplications } from '@/lib/mock-data';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:     { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24' },
  SHORTLISTED: { bg: 'rgba(99,102,241,0.15)', color: '#a5b4fc' },
  INTERVIEWED: { bg: 'rgba(59,130,246,0.1)',  color: '#93c5fd' },
  ACCEPTED:    { bg: 'rgba(16,185,129,0.1)',  color: '#6ee7b7' },
  REJECTED:    { bg: 'rgba(244,63,94,0.1)',   color: '#fb7185' },
};

type TabKey = 'overview' | 'jobs' | 'applicants' | 'messages' | 'settings';

export default function EmployerDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [scheduleOpen, setScheduleOpen] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  // Periodically refresh
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Active Jobs', value: mockJobs.filter(j => j.isVerified).length, icon: '💼', color: '#a5b4fc' },
    { label: 'Total Applicants', value: mockApplications.length, icon: '👥', color: '#6ee7b7' },
    { label: 'Interviews Scheduled', value: mockApplications.filter(a => a.status === 'INTERVIEWED').length, icon: '🎙️', color: '#fbbf24' },
    { label: 'Positions Filled', value: mockApplications.filter(a => a.status === 'ACCEPTED').length, icon: '✅', color: '#10b981' },
  ];

  const filteredApps = filterStatus === 'ALL' ? mockApplications : mockApplications.filter(a => a.status === filterStatus);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'jobs', label: '💼 My Jobs' },
    { key: 'applicants', label: '👥 Applicants' },
    { key: 'messages', label: '💬 Messages' },
    { key: 'settings', label: '⚙️ Company Settings' },
  ];

  return (
    <div className="page-content">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>
              {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'ET'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{session?.user?.name || 'Your Company'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Employer Dashboard</p>
            </div>
          </div>
          <Link href="/employer/jobs/create" className="btn-primary">
            + Post New Job
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '0.75rem 1.25rem', fontWeight: 600, fontSize: '0.875rem',
              color: activeTab === tab.key ? '#a5b4fc' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab.key ? '#6366f1' : 'transparent'}`,
              background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <>
            <div className="grid-4 stagger-children" style={{ marginBottom: '2.5rem' }}>
              {stats.map(s => (
                <div key={s.label} className="stat-card animate-fade-in-up">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                    <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Applications */}
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Applications</h2>
            <div className="table-wrapper">
              <table>
                <thead><tr>
                  <th>Candidate</th><th>Position</th><th>Applied</th><th>Status</th><th>Action</th>
                </tr></thead>
                <tbody>
                  {mockApplications.slice(0, 5).map(app => {
                    const conf = STATUS_COLORS[app.status] || STATUS_COLORS.PENDING;
                    return (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>{app.jobSeekerName}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{app.jobTitle}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                        <td><span style={{ padding: '0.25rem 0.75rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, background: conf.bg, color: conf.color }}>{app.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a href={app.cvUrl} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>📄 CV</a>
                            {app.status === 'PENDING' && <button className="btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }} onClick={() => {}}>Shortlist</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── JOBS ── */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <Link href="/employer/jobs/create" className="btn-primary">+ Post New Job</Link>
            </div>
            {mockJobs.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>No jobs posted yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Get started by posting your first job!</p>
                <Link href="/employer/jobs/create" className="btn-primary">Post Your First Job</Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>Job Title</th><th>Posted</th><th>Deadline</th><th>Applicants</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {mockJobs.map(job => (
                      <tr key={job.id}>
                        <td style={{ fontWeight: 600 }}>{job.title}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(job.postedAt).toLocaleDateString()}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(job.deadline).toLocaleDateString()}</td>
                        <td><span className="badge badge-purple">{job.applicantsCount}</span></td>
                        <td><span className={job.isVerified ? 'badge badge-green' : 'badge badge-rose'}>{job.isVerified ? 'ACTIVE' : 'DRAFT'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link href={`/jobs/${job.id}`} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>View</Link>
                            <button className="btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Delete</button>
                            {job.isVerified && <button className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Close</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── APPLICANTS ── */}
        {activeTab === 'applicants' && (
          <div>
            {/* Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {['ALL', 'PENDING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: '0.4rem 1rem', borderRadius: 99, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  background: filterStatus === s ? 'rgba(99,102,241,0.2)' : 'transparent',
                  border: `1px solid ${filterStatus === s ? '#6366f1' : 'var(--border-color)'}`,
                  color: filterStatus === s ? '#a5b4fc' : 'var(--text-muted)', transition: 'all 0.2s',
                }}>{s}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredApps.map(app => {
                const conf = STATUS_COLORS[app.status] || STATUS_COLORS.PENDING;
                return (
                  <div key={app.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="avatar">{app.jobSeekerName.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <h4 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{app.jobSeekerName}</h4>
                          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{app.jobTitle}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ padding: '0.3rem 0.875rem', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, background: conf.bg, color: conf.color }}>{app.status}</span>
                        <a href={app.cvUrl} className="btn-secondary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>📄 Download CV</a>
                        {app.status === 'PENDING' && (
                          <>
                            <button className="btn-primary" style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>Shortlist</button>
                            <button className="btn-danger" style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>Reject</button>
                          </>
                        )}
                        {app.status === 'SHORTLISTED' && (
                          <button className="btn-success" style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }} onClick={() => setScheduleOpen(app.id)}>
                            Schedule Interview
                          </button>
                        )}
                        {app.status === 'INTERVIEWED' && (
                          <>
                            <button className="btn-success" style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>Accept ✓</button>
                            <button className="btn-danger" style={{ padding: '0.4rem 0.875rem', fontSize: '0.82rem' }}>Reject</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Schedule Interview Modal */}
            {scheduleOpen && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setScheduleOpen(null)}>
                <div className="glass-panel" style={{ padding: '2rem', maxWidth: 480, width: '100%' }} onClick={e => e.stopPropagation()}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem' }}>Schedule Interview</h3>
                  <form onSubmit={e => { e.preventDefault(); setScheduleOpen(null); }}>
                    <div className="form-group"><label className="form-label">Date & Time</label><input type="datetime-local" className="form-input" required /></div>
                    <div className="form-group"><label className="form-label">Interview Type</label>
                      <select className="form-select"><option>Video Call</option><option>In-Person</option><option>Phone Call</option></select>
                    </div>
                    <div className="form-group"><label className="form-label">Meeting Link (optional)</label><input type="url" className="form-input" placeholder="https://meet.google.com/..." /></div>
                    <div className="form-group"><label className="form-label">Notes for Candidate</label><textarea className="form-textarea" style={{ minHeight: 80 }} /></div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setScheduleOpen(null)}>Cancel</button>
                      <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Send Invitation</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {activeTab === 'messages' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 0, border: '1px solid var(--border-color)', borderRadius: 12, overflow: 'hidden', minHeight: 400 }}>
              {/* Contacts */}
              <div style={{ borderRight: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                {['Abebe Bekele', 'Marta Girma', 'Dawit Alemu'].map((name, i) => (
                  <div key={i} style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', gap: '0.75rem', alignItems: 'center', background: i === 0 ? 'rgba(99,102,241,0.1)' : 'transparent', transition: 'background 0.2s' }}>
                    <div className="avatar avatar-sm">{name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Re: Senior Eng position</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Chat */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>Abebe Bekele</div>
                <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ alignSelf: 'flex-start', background: 'var(--bg-tertiary)', borderRadius: '12px 12px 12px 4px', padding: '0.75rem 1rem', maxWidth: '70%', fontSize: '0.875rem' }}>
                    Hello! I saw your application for the Senior Software Engineer role. Would you be available for an interview next week?
                  </div>
                  <div style={{ alignSelf: 'flex-end', background: 'rgba(99,102,241,0.2)', borderRadius: '12px 12px 4px 12px', padding: '0.75rem 1rem', maxWidth: '70%', fontSize: '0.875rem' }}>
                    Yes, I am available Monday–Wednesday in the morning. Looking forward to it!
                  </div>
                </div>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
                  <input className="form-input" placeholder="Type a message..." style={{ flex: 1 }} />
                  <button className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === 'settings' && (
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: 640 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem' }}>Company Profile Settings</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" defaultValue={session?.user?.name || 'Your Company'} /></div>
              <div className="form-group"><label className="form-label">Industry</label><input className="form-input" defaultValue="Other" /></div>
              <div className="form-group"><label className="form-label">Company Size</label>
                <select className="form-select" defaultValue="1-10">
                  <option value="1-10">1–10 employees</option><option value="11-50">11–50</option><option value="51-200">51–200</option>
                  <option value="201-1000">201–1,000</option><option value="1001-10000">1,001–10,000</option><option value="10000+">10,000+</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Website</label><input type="url" className="form-input" /></div>
              <div className="form-group"><label className="form-label">Location</label><input className="form-input" defaultValue="Addis Ababa, Ethiopia" /></div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" defaultValue="A new company hiring on Et_vacancy!" /></div>
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
