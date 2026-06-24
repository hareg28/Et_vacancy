'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  Users, 
  BriefcaseBusiness, 
  Building2, 
  FileText, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUsers, mockJobs, mockCompanies, mockApplications } from '@/lib/mock-data';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [, forceUpdate] = useState(0);

  // Periodically refresh data
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Total Jobs', value: mockJobs.length, icon: BriefcaseBusiness, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Companies', value: mockCompanies.length, icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Applications', value: mockApplications.length, icon: FileText, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="page-content">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your platform, users, and jobs
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-panel p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
            <div className="space-y-3">
              {mockUsers.slice(0, 5).reverse().map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' :
                    user.role === 'EMPLOYER' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {user.role === 'ADMIN' ? 'Admin' : user.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
            <div className="space-y-3">
              {mockJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs posted yet
                </div>
              ) : (
                mockJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-xs text-muted-foreground">{job.company.name} · {job.location}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {job.applicantsCount} applicants
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link href="/jobs">
                <BriefcaseBusiness className="w-6 h-6" />
                <span>Manage Jobs</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link href="/companies">
                <Building2 className="w-6 h-6" />
                <span>View Companies</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-2">
              <Link href="/">
                <LayoutDashboard className="w-6 h-6" />
                <span>Go to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
