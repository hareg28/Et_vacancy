'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loader2, PlusCircle } from 'lucide-react';
import DashboardShell from '@/components/DashboardShell';

const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#b45309', label: 'Under Review' },
  SHORTLISTED: { bg: 'rgba(16,185,129,0.12)', color: '#047857', label: 'Shortlisted' },
  INTERVIEWED: { bg: 'rgba(37,99,235,0.12)', color: '#1d4ed8', label: 'Interviewed' },
  ACCEPTED: { bg: 'rgba(16,185,129,0.12)', color: '#047857', label: 'Hired' },
  REJECTED: { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', label: 'Rejected' },
};
const DEFAULT_STATUS = STATUS_COLORS.PENDING!;

type TabKey = 'overview' | 'jobs' | 'applicants';

type Job = {
  id: string;
  title: string;
  isPublished: boolean;
  isClosed: boolean;
  deadline: string | null;
  createdAt: string;
  _count: { applications: number };
};

type Application = {
  id: string;
  status: string;
  cvUrl: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null };
  job: { title: string; company: { name: string } };
};

function jobStatus(job: Job) {
  if (job.isClosed) return { label: 'Closed', bg: 'rgba(239,68,68,0.12)', color: '#dc2626' };
  if (!job.isPublished) return { label: 'Draft', bg: 'rgba(245,158,11,0.12)', color: '#b45309' };
  return { label: 'Active', bg: 'rgba(16,185,129,0.12)', color: '#047857' };
}

export default function EmployerDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const [jobsRes, appsRes] = await Promise.all([
      fetch('/api/jobs?mine=true'),
      fetch('/api/applications?employer=true'),
    ]);
    if (jobsRes.ok) setJobs(await jobsRes.json());
    if (appsRes.ok) setApplications(await appsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const updateApplicationStatus = async (id: string, status: string) => {
    await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const closeJob = async (id: string) => {
    await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isClosed: true }),
    });
    fetchData();
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const activeJobs = jobs.filter((job) => job.isPublished && !job.isClosed);
  const filteredApps = filterStatus === 'ALL' ? applications : applications.filter((app) => app.status === filterStatus);

  const stats = [
    { label: 'Active Jobs', value: activeJobs.length, trend: '+2 from last month' },
    { label: 'Total Applications', value: applications.length, trend: '+10% from last month' },
    { label: 'Under Review', value: applications.filter((app) => app.status === 'PENDING').length, trend: 'Needs attention' },
    { label: 'Hires', value: applications.filter((app) => app.status === 'ACCEPTED').length, trend: '+7% from last month' },
  ];

  if (loading) {
    return (
      <div className="dashboard-ui dashboard-ui-employer flex items-center justify-center min-h-screen gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  return (
    <DashboardShell
      role="employer"
      title="Employer Dashboard"
      subtitle={session?.user?.name || 'Manage hiring activity from one place'}
      action={<Link href="/employer/jobs/create" className="dash-action"><PlusCircle size={15} /> Post New Job</Link>}
    >
      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid #e8ecf4', marginBottom: '1.25rem' }}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'jobs', label: 'My Jobs' },
          { key: 'applicants', label: 'Candidates' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            style={{
              padding: '0.72rem 1rem',
              fontWeight: 750,
              fontSize: '0.82rem',
              color: activeTab === tab.key ? '#2563eb' : '#64748b',
              borderBottom: `2px solid ${activeTab === tab.key ? '#2563eb' : 'transparent'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="dash-grid dash-grid-4" style={{ marginBottom: '1.5rem' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="dash-card dash-card-pad">
                <div className="dash-stat-label">{stat.label}</div>
                <div className="dash-stat-value">{stat.value}</div>
                <div className="dash-stat-trend">{stat.trend}</div>
              </div>
            ))}
          </div>

          <div className="dash-grid dash-grid-2">
            <div className="dash-card dash-card-pad">
              <h2 className="dash-section-title">Recent Applications</h2>
              <table className="dash-table">
                <thead><tr><th>Candidate</th><th>Position</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => {
                    const conf = STATUS_COLORS[app.status] || DEFAULT_STATUS;
                    return (
                      <tr key={app.id}>
                        <td>{app.user.name || 'Unnamed Candidate'}</td>
                        <td>{app.job.title}</td>
                        <td><span className="dash-pill" style={{ background: conf.bg, color: conf.color }}>{conf.label}</span></td>
                        <td>
                          {app.status === 'PENDING' && (
                            <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem' }} onClick={() => updateApplicationStatus(app.id, 'SHORTLISTED')}>Shortlist</button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {applications.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No applications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="dash-card dash-card-pad">
              <h2 className="dash-section-title">Jobs Overview</h2>
              <table className="dash-table">
                <thead><tr><th>Job Title</th><th>Applications</th><th>Status</th></tr></thead>
                <tbody>
                  {jobs.slice(0, 5).map((job) => {
                    const st = jobStatus(job);
                    return (
                      <tr key={job.id}>
                        <td>{job.title}</td>
                        <td>{job._count.applications}</td>
                        <td><span className="dash-pill" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                      </tr>
                    );
                  })}
                  {jobs.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No jobs posted yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'jobs' && (
        <div className="dash-card dash-card-pad">
          <h2 className="dash-section-title">My Jobs</h2>
          {jobs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#64748b', marginBottom: '1rem' }}>No jobs posted yet</p>
              <Link href="/employer/jobs/create" className="dash-action">Post Your First Job</Link>
            </div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Job Title</th><th>Posted</th><th>Deadline</th><th>Applicants</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {jobs.map((job) => {
                  const st = jobStatus(job);
                  return (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>{job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</td>
                      <td>{job._count.applications}</td>
                      <td><span className="dash-pill" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Link href={`/jobs/${job.id}`} className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem' }}>View</Link>
                          {!job.isClosed && <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem', background: '#64748b' }} onClick={() => closeJob(job.id)}>Close</button>}
                          <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem', background: '#ef4444' }} onClick={() => deleteJob(job.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'applicants' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            {['ALL', 'PENDING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '0.4rem 1rem',
                  borderRadius: 99,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: filterStatus === status ? 'rgba(37,99,235,0.12)' : '#ffffff',
                  border: `1px solid ${filterStatus === status ? '#2563eb' : '#e7ebf2'}`,
                  color: filterStatus === status ? '#1d4ed8' : '#64748b',
                }}
              >
                {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="dash-card dash-card-pad">
            <h2 className="dash-section-title">Candidates</h2>
            <table className="dash-table">
              <thead><tr><th>Candidate</th><th>Email</th><th>Position</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredApps.map((app) => {
                  const conf = STATUS_COLORS[app.status] || DEFAULT_STATUS;
                  return (
                    <tr key={app.id}>
                      <td>{app.user.name || 'Unnamed Candidate'}</td>
                      <td>{app.user.email}</td>
                      <td>{app.job.title}</td>
                      <td><span className="dash-pill" style={{ background: conf.bg, color: conf.color }}>{conf.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {app.status === 'PENDING' && (
                            <>
                              <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem' }} onClick={() => updateApplicationStatus(app.id, 'SHORTLISTED')}>Shortlist</button>
                              <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem', background: '#ef4444' }} onClick={() => updateApplicationStatus(app.id, 'REJECTED')}>Reject</button>
                            </>
                          )}
                          {app.status === 'SHORTLISTED' && (
                            <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem' }} onClick={() => updateApplicationStatus(app.id, 'INTERVIEWED')}>Mark Interviewed</button>
                          )}
                          {app.status === 'INTERVIEWED' && (
                            <>
                              <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem' }} onClick={() => updateApplicationStatus(app.id, 'ACCEPTED')}>Accept</button>
                              <button className="dash-action" style={{ minHeight: 28, padding: '0.25rem 0.55rem', background: '#ef4444' }} onClick={() => updateApplicationStatus(app.id, 'REJECTED')}>Reject</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredApps.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No candidates in this category</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
