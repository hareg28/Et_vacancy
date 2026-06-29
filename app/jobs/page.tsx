'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import JobCard from '@/components/JobCard';
import { Loader2 } from 'lucide-react';

const JOB_TYPES = ['All', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
const EXP_LEVELS = ['All', 'ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'];

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-Time', PART_TIME: 'Part-Time', CONTRACT: 'Contract',
  INTERNSHIP: 'Internship', FREELANCE: 'Freelance',
};

const EXP_LABELS: Record<string, string> = {
  ENTRY: 'Entry Level', MID: 'Mid Level', SENIOR: 'Senior', EXECUTIVE: 'Executive',
};

type Job = {
  id: string;
  title: string;
  location: string | null;
  salary: string | null;
  jobType: string;
  experienceLevel: string;
  isRemote: boolean;
  isFeatured: boolean;
  deadline: string | null;
  createdAt: string;
  company: { name: string; logoUrl: string | null; isApproved: boolean };
  category: { name: string } | null;
  _count: { applications: number };
};

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [expLevel, setExpLevel] = useState('All');
  const [isRemote, setIsRemote] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    const res = await fetch('/api/jobs');
    if (res.ok) setJobs(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchJobs();
    });
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const filtered = jobs.filter((j) => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (location && !j.location?.toLowerCase().includes(location.toLowerCase())) return false;
    if (jobType !== 'All' && j.jobType !== jobType) return false;
    if (expLevel !== 'All' && j.experienceLevel !== expLevel) return false;
    if (isRemote && !j.isRemote) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="page-content flex items-center justify-center min-h-[60vh] gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading jobs...
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Browse <span className="gradient-text">Jobs</span></h1>
          <p className="section-subtitle">Discover {jobs.length} verified vacancies — updated live</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          <aside>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: 90 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700 }}>Filters</h3>
                <button className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => { setJobType('All'); setExpLevel('All'); setIsRemote(false); setLocation(''); setSearch(''); }}>
                  Clear All
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Keyword</label>
                <input className="form-input" placeholder="Job title or company..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="City or region..." value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Job Type</label>
                {JOB_TYPES.map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    <input type="radio" name="jobType" checked={jobType === t} onChange={() => setJobType(t)} style={{ accentColor: '#6366f1' }} />
                    {t === 'All' ? 'All Types' : TYPE_LABELS[t]}
                  </label>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                {EXP_LEVELS.map((e) => (
                  <label key={e} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    <input type="radio" name="expLevel" checked={expLevel === e} onChange={() => setExpLevel(e)} style={{ accentColor: '#6366f1' }} />
                    {e === 'All' ? 'All Levels' : EXP_LABELS[e]}
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Remote only</label>
                <button type="button" onClick={() => setIsRemote(!isRemote)} style={{
                  width: 44, height: 24, borderRadius: 999,
                  background: isRemote ? '#6366f1' : 'var(--bg-tertiary)',
                  border: '2px solid ' + (isRemote ? '#6366f1' : 'var(--border-color)'),
                  cursor: 'pointer', position: 'relative',
                }}>
                  <span style={{ position: 'absolute', top: 2, left: isRemote ? 22 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </button>
              </div>
            </div>
          </aside>

          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> jobs
            </p>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <h3>No Jobs Found</h3>
                <p>Try adjusting your filters or check back later for new postings.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filtered.map((job) => (
                  <JobCard
                    key={job.id}
                    job={{
                      id: job.id,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      salary: job.salary,
                      jobType: job.jobType,
                      isRemote: job.isRemote,
                      isFeatured: job.isFeatured,
                      postedAt: job.createdAt,
                      deadline: job.deadline,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
