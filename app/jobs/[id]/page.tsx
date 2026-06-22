'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { mockJobs, addApplication } from '@/lib/mock-data';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const job = mockJobs.find((j) => j.id === params.id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ coverLetter: '', cvUrl: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ cv?: string }>({});

  if (!job) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Job Not Found</h1>
        <Link href="/jobs" className="btn-primary">Browse All Jobs</Link>
      </div>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { cv?: string } = {};
    if (!form.cvUrl) {
      newErrors.cv = 'Please upload your CV or use saved CV';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const jobSeekerId = (session?.user as any)?.id || '1';
    const jobSeekerName = session?.user?.name || 'Unknown';
    
    addApplication({
      jobId: job.id,
      jobTitle: job.title,
      jobSeekerId,
      jobSeekerName,
      coverLetter: form.coverLetter,
      cvUrl: form.cvUrl,
    });
    
    setErrors({});
    setSubmitted(true);
    setApplyOpen(false);
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Home</Link><span className="breadcrumb-sep">/</span>
          <Link href="/jobs">Jobs</Link><span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{job.title}</span>
        </div>

        {submitted && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>🎉</span>
            <span><strong>Application Submitted!</strong> Your application has been received successfully!</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* ── MAIN CONTENT ── */}
          <div>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #10b981)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.5rem', color: 'white',
                }}>
                  {job.company.name.substring(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {job.isFeatured && <span className="badge badge-amber">⭐ Featured</span>}
                    <span className="badge badge-green">{job.jobType.replace('_', '-')}</span>
                    {job.isRemote && <span className="badge badge-blue">🌐 Remote</span>}
                  </div>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>{job.title}</h1>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '0.9rem', alignItems: 'center' }}>
                    <span>{job.company.name}</span>
                    {job.company.isVerified && (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Verified
                      </span>
                    )}
                    <span>·</span>
                    <span>📍 {job.location}</span>
                    <span>·</span>
                    <span>💰 {job.salary}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {job.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            </div>

            {job.description && (
              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Job Description</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{job.description}</div>
              </div>
            )}

            {job.requirements && (
              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Requirements</h2>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 2, fontSize: '0.95rem' }}>
                  {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                    <li key={i}>{req.replace(/^- /, '')}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Benefits & Perks</h2>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 2, fontSize: '0.95rem' }}>
                  {job.benefits.split('\n').filter(b => b.trim()).map((ben, i) => (
                    <li key={i} style={{ color: '#6ee7b7' }}>{ben.replace(/^- /, '')}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a5b4fc' }}>{job.applicantsCount}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>applicants so far</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fbbf24' }}>
                    {new Date(job.deadline).toLocaleDateString('en-ET', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {submitted ? (
                <div className="btn-success" style={{ width: '100%', justifyContent: 'center', pointerEvents: 'none' }}>✅ Applied Successfully</div>
              ) : (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
                  onClick={() => setApplyOpen(true)}>
                  Apply Now →
                </button>
              )}
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }}>
                🔖 Save Job
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>About {job.company.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}><span>🏭</span><span>{job.company.industry}</span></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}><span>👥</span><span>{job.company.size}</span></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}><span>📍</span><span>{job.company.location}</span></div>
                {job.company.website && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span>🌐</span>
                    <a href={job.company.website} target="_blank" rel="noreferrer" style={{ color: '#a5b4fc' }}>{job.company.website}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── APPLY MODAL ── */}
      {applyOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={() => setApplyOpen(false)}>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.3rem' }}>Apply for this Role</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{job.title} at {job.company.name}</p>
              </div>
              <button onClick={() => setApplyOpen(false)} style={{ color: 'var(--text-muted)', padding: '0.25rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleApply}>
              <div className="form-group">
                <label className="form-label">CV / Resume</label>
                {errors.cv && <div className="alert alert-danger" style={{ padding: '0.5rem 0.75rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}>{errors.cv}</div>}
                <div style={{
                  border: `2px dashed ${errors.cv ? '#f87171' : 'var(--border-color)'}`, borderRadius: 10, padding: '2rem',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = errors.cv ? '#f87171' : '#6366f1')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = errors.cv ? '#f87171' : 'var(--border-color)')}
                  onClick={() => document.getElementById('cv-upload')?.click()}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Drag & drop your CV or <span style={{ color: '#a5b4fc' }}>browse to upload</span></p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PDF, DOC, DOCX (max 5MB)</p>
                  <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} id="cv-upload" 
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setForm(prev => ({ ...prev, cvUrl: e.target.files![0].name }));
                        setErrors({});
                      }
                    }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div className="divider" style={{ flex: 1, margin: 0 }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>or use saved</span>
                  <div className="divider" style={{ flex: 1, margin: 0 }} />
                </div>
                <button type="button" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.875rem' }}
                  onClick={() => {
                    setForm(prev => ({ ...prev, cvUrl: 'saved-cv.pdf' }));
                    setErrors({});
                  }}>
                  Use CV from Profile
                </button>
                {form.cvUrl && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📄</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{form.cvUrl}</span>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, cvUrl: '' })} style={{ marginLeft: 'auto', color: 'var(--text-muted)', padding: '0.25rem' }}>✕</button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea className="form-textarea" placeholder="Tell the employer why you're a great fit for this role..."
                  value={form.coverLetter} onChange={e => setForm({ ...form, coverLetter: e.target.value })} style={{ minHeight: 140 }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setApplyOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '0.85rem' }}>Submit Application →</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
