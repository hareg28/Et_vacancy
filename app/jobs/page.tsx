'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import JobCard from '@/components/JobCard';
import { mockJobs } from '@/lib/mock-data';

// --- Types ---
const JOB_TYPES = ['All', 'FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
const EXP_LEVELS = ['All', 'ENTRY', 'MID', 'SENIOR', 'EXECUTIVE'];
const SORT_OPTIONS = ['Latest', 'Salary (High to Low)', 'Deadline'];

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-Time', PART_TIME: 'Part-Time', CONTRACT: 'Contract',
  INTERNSHIP: 'Internship', FREELANCE: 'Freelance',
};

const EXP_LABELS: Record<string, string> = {
  ENTRY: 'Entry Level', MID: 'Mid Level', SENIOR: 'Senior', EXECUTIVE: 'Executive',
};

const CATEGORIES = [
  { name: 'All', slug: 'All' },
  { name: 'Technology', slug: 'Technology' },
  { name: 'Finance & Banking', slug: 'Finance & Banking' },
  { name: 'Healthcare', slug: 'Healthcare' },
  { name: 'Engineering', slug: 'Engineering' },
  { name: 'Education', slug: 'Education' },
  { name: 'Marketing', slug: 'Marketing' },
  { name: 'Logistics', slug: 'Logistics' },
  { name: 'NGO / Non-Profit', slug: 'NGO / Non-Profit' },
];

export default function JobsPage() {
  const [search, setSearch] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('q') || '';
  });
  const [location, setLocation] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('location') || '';
  });
  const [category, setCategory] = useState(() => {
    if (typeof window === 'undefined') return 'All';
    return new URLSearchParams(window.location.search).get('category') || 'All';
  });
  const [jobType, setJobType] = useState('All');
  const [expLevel, setExpLevel] = useState('All');
  const [isRemote, setIsRemote] = useState(false);
  const [salary, setSalary] = useState('');
  const [sort, setSort] = useState('Latest');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [jobs, setJobs] = useState(mockJobs);


  // Refresh jobs periodically
  useEffect(() => {
    const interval = setInterval(() => setJobs([...mockJobs]), 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = jobs.filter(j => {
    if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.name.toLowerCase().includes(search.toLowerCase()) && !j.tags.join(' ').toLowerCase().includes(search.toLowerCase())) return false;
    if (location && !j.location.toLowerCase().includes(location.toLowerCase())) return false;
    if (category !== 'All' && j.category !== category) return false;
    if (jobType !== 'All' && j.jobType !== jobType) return false;
    if (expLevel !== 'All' && j.expLevel !== expLevel) return false;
    if (isRemote && !j.isRemote) return false;
    return true;
  });

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="page-content">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">Browse <span className="gradient-text">Jobs</span></h1>
          <p className="section-subtitle">Discover {jobs.length}+ verified vacancies across Ethiopia</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* ── SIDEBAR FILTERS ── */}
          <aside>
            <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: 90 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 700 }}>Filters</h3>
                <button className="btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => { setCategory('All'); setJobType('All'); setExpLevel('All'); setIsRemote(false); setLocation(''); setSearch(''); }}>
                  Clear All
                </button>
              </div>

              {/* Keyword */}
              <div className="form-group">
                <label className="form-label">Keyword</label>
                <input className="form-input" placeholder="Job title or skill..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="City or region..." value={location} onChange={e => setLocation(e.target.value)} />
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              {/* Job Type */}
              <div className="form-group">
                <label className="form-label">Job Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {JOB_TYPES.map(t => (
                    <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <input type="radio" name="jobType" checked={jobType === t} onChange={() => setJobType(t)} style={{ accentColor: '#6366f1' }} />
                      {t === 'All' ? 'All Types' : TYPE_LABELS[t]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {EXP_LEVELS.map(e => (
                    <label key={e} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <input type="radio" name="expLevel" checked={expLevel === e} onChange={() => setExpLevel(e)} style={{ accentColor: '#6366f1' }} />
                      {e === 'All' ? 'All Levels' : EXP_LABELS[e]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Remote only</label>
                <button type="button" onClick={() => setIsRemote(!isRemote)} style={{
                  width: 44, height: 24, borderRadius: 999,
                  background: isRemote ? '#6366f1' : 'var(--bg-tertiary)',
                  border: '2px solid ' + (isRemote ? '#6366f1' : 'var(--border-color)'),
                  cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
                }}>
                  <span style={{
                    position: 'absolute', top: 2, left: isRemote ? 22 : 2, width: 16, height: 16,
                    borderRadius: '50%', background: 'white', transition: 'left 0.2s',
                  }} />
                </button>
              </div>
            </div>
          </aside>

          {/* ── RESULTS ── */}
          <div>
            {/* Sort + count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> jobs
                {category !== 'All' && ` in ${CATEGORIES.find(c => c.slug === category)?.name}`}
              </p>
              <select className="form-select" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3>No Jobs Found</h3>
                <p>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filtered.map(job => (
                  <div key={job.id} style={{ position: 'relative' }}>
                    <JobCard job={job} />
                    {/* Save button overlay */}
                    <button onClick={(e) => { e.preventDefault(); toggleSave(job.id); }} title={saved.has(job.id) ? 'Unsave' : 'Save job'}
                      style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: saved.has(job.id) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid ' + (saved.has(job.id) ? 'rgba(99,102,241,0.4)' : 'var(--border-color)'),
                        borderRadius: 8, padding: '0.4rem', cursor: 'pointer',
                        color: saved.has(job.id) ? '#a5b4fc' : 'var(--text-muted)', transition: 'all 0.2s',
                      }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved.has(job.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
