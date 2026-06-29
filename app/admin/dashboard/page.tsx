'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, BriefcaseBusiness, Building2, FileText, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardShell from '@/components/DashboardShell';

type Stats = {
  users: number;
  jobs: number;
  companies: number;
  applications: number;
  jobSeekers: number;
  employers: number;
};

type RecentUser = { id: string; name: string | null; email: string | null; role: string };
type RecentJob = { id: string; title: string; company: { name: string }; _count: { applications: number } };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
      setRecentJobs(data.recentJobs);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const statCards = stats ? [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Job Seekers', value: stats.jobSeekers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Employers', value: stats.employers, icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Jobs', value: stats.jobs, icon: BriefcaseBusiness, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Companies', value: stats.companies, icon: Building2, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Applications', value: stats.applications, icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ] : [];

  if (loading) {
    return (
      <div className="dashboard-ui flex items-center justify-center min-h-screen gap-2 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard...
      </div>
    );
  }

  return (
    <DashboardShell
      role="admin"
      title="Admin Dashboard"
      subtitle="Manage users, companies, and jobs across the platform"
      action={<Link href="/employer/jobs/create" className="dash-action">+ Post Job</Link>}
    >

        <div className="dash-grid dash-grid-3 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="dash-card dash-card-pad">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="dash-stat-value">{stat.value}</div>
                  <div className="dash-stat-label">{stat.label}</div>
                  <div className="dash-stat-trend">+12.5% from last month</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-grid dash-grid-2 mb-8">
          <div className="dash-card dash-card-pad">
            <h2 className="dash-section-title">Recent Users</h2>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm">
                      {(user.name || user.email || '?').charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <span className={`dash-pill ${user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : user.role === 'EMPLOYER' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card dash-card-pad">
            <h2 className="dash-section-title">Recent Jobs</h2>
            <div className="space-y-3">
              {recentJobs.length === 0 ? (
                <p className="text-center py-8 text-slate-500">No jobs posted yet</p>
              ) : recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div>
                    <div className="font-medium text-slate-900">{job.title}</div>
                    <div className="text-xs text-slate-500">{job.company.name}</div>
                  </div>
                  <div className="text-xs text-slate-500">{job._count.applications} applicants</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="dash-section-title">Quick Actions</h2>
        <div className="dash-grid dash-grid-4">
          <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
            <Link href="/admin/users"><Users className="w-6 h-6" /><span>Manage Users</span></Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
            <Link href="/admin/companies"><Building2 className="w-6 h-6" /><span>Company Status</span></Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
            <Link href="/jobs"><BriefcaseBusiness className="w-6 h-6" /><span>Browse Jobs</span></Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
            <Link href="/employer/jobs/create"><BriefcaseBusiness className="w-6 h-6" /><span>Post Job</span></Link>
          </Button>
        </div>
    </DashboardShell>
  );
}
