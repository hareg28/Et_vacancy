'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  SHORTLISTED: { label: 'Shortlisted', color: '#4f46e5', bg: 'rgba(79,70,229,0.12)' },
  INTERVIEWED: { label: 'Interviewing', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  ACCEPTED: { label: 'Accepted', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  REJECTED: { label: 'Not Selected', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};
const DEFAULT_STATUS = STATUS_CONFIG.PENDING!;

type Application = {
  id: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string | null;
    salary: string | null;
    company: { name: string; logoUrl: string | null };
  };
};

type RecommendedJob = {
  id: string;
  title: string;
  company: { name: string };
  salary: string | null;
  location: string | null;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchData = useCallback(async () => {
    const [appsRes, jobsRes] = await Promise.all([
      fetch('/api/applications'),
      fetch('/api/jobs'),
    ]);
    if (appsRes.ok) setApplications(await appsRes.json());
    if (jobsRes.ok) {
      const allJobs = await jobsRes.json();
      setJobs(allJobs.slice(0, 3));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filtered = filter === 'ALL' ? applications : applications.filter((app) => app.status === filter);

  if (loading) {
    return (
      <div className="dashboard-ui dashboard-ui-seeker flex items-center justify-center min-h-screen gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <DashboardShell
      role="job-seeker"
      title={`Welcome back, ${session?.user?.name?.split(' ')[0] || 'there'}`}
      subtitle="Track your applications and discover new opportunities"
    >
      <div className="dash-grid dash-grid-3" style={{ marginBottom: '2rem' }}>
        <div className="dash-card dash-card-pad">
          <div className="dash-stat-label">Total Applications</div>
          <div className="dash-stat-value">{applications.length}</div>
          <div className="dash-stat-trend">Updated live</div>
        </div>
        <div className="dash-card dash-card-pad">
          <div className="dash-stat-label">Under Review</div>
          <div className="dash-stat-value" style={{ color: '#f59e0b' }}>{applications.filter((app) => app.status === 'PENDING').length}</div>
          <div className="dash-stat-trend">Pending responses</div>
        </div>
        <div className="dash-card dash-card-pad">
          <div className="dash-stat-label">Accepted</div>
          <div className="dash-stat-value" style={{ color: '#10b981' }}>{applications.filter((app) => app.status === 'ACCEPTED').length}</div>
          <div className="dash-stat-trend">Great progress</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['ALL', 'PENDING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: 99,
              fontSize: '0.8rem',
              fontWeight: 700,
              background: filter === status ? 'rgba(16,185,129,0.14)' : '#ffffff',
              border: `1px solid ${filter === status ? '#10b981' : '#e7ebf2'}`,
              color: filter === status ? '#047857' : '#64748b',
            }}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <h2 className="dash-section-title">My Applications</h2>
      {filtered.length === 0 ? (
        <div className="dash-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>No applications yet</p>
          <Link href="/jobs" className="dash-action">Find Jobs</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {filtered.map((app) => {
            const conf = STATUS_CONFIG[app.status] || DEFAULT_STATUS;
            return (
              <div key={app.id} className="dash-card dash-card-pad">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <Link href={`/jobs/${app.job.id}`} style={{ fontWeight: 750, fontSize: '1.02rem', color: '#111827' }}>{app.job.title}</Link>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{app.job.company.name} - Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="dash-pill" style={{ background: conf.bg, color: conf.color }}>{conf.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="dash-section-title">Recommended Jobs</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {jobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="dash-card" style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#111827' }}>{job.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{job.company.name} - {job.location}</div>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#475569' }}>{job.salary || 'Competitive'}</span>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
