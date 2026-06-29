'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const JOB_CATEGORIES = ['Technology', 'Finance & Banking', 'Healthcare', 'Engineering', 'Education', 'Marketing', 'Logistics', 'NGO / Non-Profit', 'Telecommunications', 'Manufacturing'];

export default function CreateJobPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', category: '', location: '', isRemote: false, jobType: 'FULL_TIME',
    expLevel: 'MID', salaryMin: '', salaryMax: '', deadline: '',
    description: '', requirements: '', benefits: '', skills: '',
    isFeatured: false, companyName: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        router.push('/employer/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [submitted, router]);

  const updateForm = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const salary = form.salaryMin && form.salaryMax ? `${form.salaryMin} – ${form.salaryMax} ETB` : 'Competitive';

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        categoryName: form.category,
        location: form.location,
        isRemote: form.isRemote,
        jobType: form.jobType,
        experienceLevel: form.expLevel,
        salary,
        deadline: form.deadline || null,
        description: form.description,
        requirements: form.requirements,
        benefits: form.benefits,
        isFeatured: form.isFeatured,
      }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to post job');
    }
  };

  if (submitted) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '0.75rem' }}>Job Posted Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your vacancy for <strong>{form.title}</strong> is now live and visible to job seekers.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>Redirecting to dashboard...</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/employer/dashboard" className="btn-secondary">Go to Dashboard Now</Link>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(1); setForm({ title: '', category: '', location: '', isRemote: false, jobType: 'FULL_TIME', expLevel: 'MID', salaryMin: '', salaryMax: '', deadline: '', description: '', requirements: '', benefits: '', skills: '', isFeatured: false, companyName: '' }); }}>
              Post Another Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: 780 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="breadcrumb">
            <Link href="/employer/dashboard">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--text-secondary)' }}>Post a Job</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Post a <span className="gradient-text">New Vacancy</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Fill in the details below to publish your job listing</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
          {[{ n: 1, label: 'Basic Info' }, { n: 2, label: 'Details' }, { n: 3, label: 'Preview' }].map(({ n, label }, i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step >= n ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--bg-tertiary)',
                  border: `2px solid ${step >= n ? '#6366f1' : 'var(--border-color)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem', color: step >= n ? 'white' : 'var(--text-muted)',
                  boxShadow: step === n ? '0 0 0 4px rgba(99,102,241,0.2)' : 'none',
                }}>{n}</div>
                <span style={{ fontSize: '0.75rem', color: step >= n ? '#a5b4fc' : 'var(--text-muted)', fontWeight: step === n ? 700 : 400 }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: step > n ? 'rgba(99,102,241,0.5)' : 'var(--border-color)', margin: '0 12px', marginBottom: '1.2rem' }} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── STEP 1: BASIC INFO ── */}
          {step === 1 && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Basic Information</h2>

              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" placeholder="e.g. Senior Software Engineer" value={form.title} onChange={e => updateForm('title', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" placeholder="e.g. Ethio Telecom" value={form.companyName} onChange={e => updateForm('companyName', e.target.value)} required />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => updateForm('category', e.target.value)} required>
                    <option value="">Select Category</option>
                    {JOB_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type *</label>
                  <select className="form-select" value={form.jobType} onChange={e => updateForm('jobType', e.target.value)}>
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="PART_TIME">Part-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-input" placeholder="e.g. Addis Ababa" value={form.location} onChange={e => updateForm('location', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <select className="form-select" value={form.expLevel} onChange={e => updateForm('expLevel', e.target.value)}>
                    <option value="ENTRY">Entry Level (0–2 yrs)</option>
                    <option value="MID">Mid Level (2–5 yrs)</option>
                    <option value="SENIOR">Senior (5–10 yrs)</option>
                    <option value="EXECUTIVE">Executive (10+ yrs)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', padding: '1rem', background: 'rgba(99,102,241,0.05)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.15)' }}>
                <input type="checkbox" id="isRemote" checked={form.isRemote} onChange={e => updateForm('isRemote', e.target.checked)} style={{ accentColor: '#6366f1', width: 16, height: 16 }} />
                <label htmlFor="isRemote" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                  🌐 This is a remote-friendly position
                </label>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Min. Salary (ETB/month)</label>
                  <input className="form-input" type="number" placeholder="e.g. 50000" value={form.salaryMin} onChange={e => updateForm('salaryMin', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max. Salary (ETB/month)</label>
                  <input className="form-input" type="number" placeholder="e.g. 80000" value={form.salaryMax} onChange={e => updateForm('salaryMax', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Application Deadline *</label>
                <input type="date" className="form-input" value={form.deadline} onChange={e => updateForm('deadline', e.target.value)} required min={new Date().toISOString().split('T')[0]} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn-primary" onClick={() => setStep(2)} disabled={!form.title || !form.companyName || !form.category || !form.location || !form.deadline}>
                  Next: Job Details →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: JOB DETAILS ── */}
          {step === 2 && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Job Description & Requirements</h2>

              <div className="form-group">
                <label className="form-label">Job Description *</label>
                <textarea className="form-textarea" style={{ minHeight: 180 }} placeholder="Describe the role, responsibilities, and what the candidate will be working on..." value={form.description} onChange={e => updateForm('description', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Requirements *</label>
                <textarea className="form-textarea" style={{ minHeight: 140 }} placeholder="List the qualifications, experience, and skills required (one per line)..." value={form.requirements} onChange={e => updateForm('requirements', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Benefits & Perks <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <textarea className="form-textarea" style={{ minHeight: 100 }} placeholder="List benefits like health insurance, annual leave, remote work, etc." value={form.benefits} onChange={e => updateForm('benefits', e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
                <input className="form-input" placeholder="e.g. React, Node.js, TypeScript, PostgreSQL" value={form.skills} onChange={e => updateForm('skills', e.target.value)} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(245,158,11,0.05)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.2)' }}>
                <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => updateForm('isFeatured', e.target.checked)} style={{ accentColor: '#f59e0b', width: 16, height: 16 }} />
                <label htmlFor="isFeatured" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                  ⭐ Feature this job (appears at the top of search results)
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="btn-primary" onClick={() => setStep(3)} disabled={!form.description || !form.requirements}>
                  Preview Job Listing →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: PREVIEW ── */}
          {step === 3 && (
            <div>
              <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
                👀 Preview how your job will appear to candidates. Click Publish when you&apos;re happy.
              </div>

              <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'white', flexShrink: 0 }}>ET</div>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {form.isFeatured && <span className="badge badge-amber">⭐ Featured</span>}
                      <span className="badge badge-green">{form.jobType.replace('_', '-')}</span>
                      {form.isRemote && <span className="badge badge-blue">🌐 Remote</span>}
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>{form.title}</h2>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {form.companyName || 'Your Company'} · 📍 {form.location} {form.salaryMin && form.salaryMax ? `· 💰 ${form.salaryMin} – ${form.salaryMax} ETB` : ''}
                    </div>
                  </div>
                </div>
                {form.skills && <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>{form.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => <span key={s} className="tag">{s}</span>)}</div>}
                <div className="divider" />
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', marginTop: '1rem', fontSize: '0.9rem' }}>{form.description}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between' }}>
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>← Edit</button>
                <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                  🚀 Publish Job Listing
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
