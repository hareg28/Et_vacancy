'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  location: string | null;
  salary: string | null;
  jobType: string;
  experienceLevel: string;
  isRemote: boolean;
  deadline: string | null;
  createdAt: string;
  company: { name: string; industry: string | null; location: string | null };
  category: { name: string } | null;
  _count: { applications: number };
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', coverLetter: '', cvUrl: '' });
  const [submitted, setSubmitted] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setJob(data); setLoading(false); });
  }, [params.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/login');
      return;
    }
    setApplying(true);
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        jobId: job!.id, 
        coverLetter: `Name: ${form.fullName}\nPhone: ${form.phone}\n\n${form.coverLetter}`, 
        cvUrl: form.cvUrl 
      }),
    });
    setApplying(false);
    if (res.ok) {
      setSubmitted(true);
      setApplyOpen(false);
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to apply');
    }
  };

  if (loading) {
    return (
      <div className="page-content flex items-center justify-center min-h-[60vh] gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading job...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Job Not Found</h1>
        <Link href="/jobs" className="btn-primary">Browse All Jobs</Link>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Home</Link><span className="breadcrumb-sep">/</span>
          <Link href="/jobs">Jobs</Link><span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{job.title}</span>
        </div>

        {submitted && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            <strong>Application Submitted!</strong> The employer will review your application.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{job.title}</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{job.company.name} · {job.location || 'Remote'}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <span className="badge badge-green">{job.jobType.replace('_', ' ')}</span>
                <span className="badge badge-blue">{job.experienceLevel}</span>
                {job.isRemote && <span className="badge badge-purple">Remote</span>}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{job.description}</p>
              {job.requirements && (
                <>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Requirements</h3>
                  <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{job.requirements}</p>
                </>
              )}
              {job.benefits && (
                <>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Benefits</h3>
                  <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{job.benefits}</p>
                </>
              )}
            </div>
          </div>

          <aside>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: 90 }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Salary</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{job.salary || 'Competitive'}</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline</div>
                <div style={{ fontWeight: 600 }}>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open'}</div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applicants</div>
                <div style={{ fontWeight: 600 }}>{job._count.applications}</div>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setApplyOpen(true)}>
                Apply Now
              </button>
            </div>
          </aside>
        </div>

        {applyOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setApplyOpen(false)}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: 520, width: '100%' }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Apply for {job.title}</h3>
              <form onSubmit={handleApply}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" required placeholder="John Doe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Contact Number</label>
                    <input className="form-input" required type="tel" placeholder="+251 9..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Letter</label>
                  <textarea className="form-textarea" required placeholder="Why are you a great fit for this role?" value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} style={{ minHeight: 120 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">CV / Resume URL</label>
                  <input className="form-input" required type="url" placeholder="https://link-to-your-cv.com (Google Drive, Dropbox, etc.)" value={form.cvUrl} onChange={(e) => setForm({ ...form, cvUrl: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setApplyOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
