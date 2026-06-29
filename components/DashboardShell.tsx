'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  FileText,
  Home,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

type ShellRole = 'admin' | 'job-seeker' | 'employer';

const nav = {
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/companies', label: 'Companies', icon: Building2 },
    { href: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  ],
  'job-seeker': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/jobs', label: 'Find Jobs', icon: Search },
    { href: '/dashboard', label: 'My Applications', icon: FileText },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/profile', label: 'Profile', icon: User },
  ],
  employer: [
    { href: '/employer/dashboard', label: 'Dashboard', icon: Home },
    { href: '/employer/jobs/create', label: 'Post Job', icon: PlusCircle },
    { href: '/employer/dashboard', label: 'My Jobs', icon: BriefcaseBusiness },
    { href: '/employer/dashboard', label: 'Applications', icon: FileText },
    { href: '/admin/companies', label: 'Company Profile', icon: Building2 },
  ],
} satisfies Record<ShellRole, { href: string; label: string; icon: typeof Home }[]>;

const roleAccent = {
  admin: 'admin',
  'job-seeker': 'seeker',
  employer: 'employer',
} as const;

export default function DashboardShell({
  role,
  title,
  subtitle,
  children,
  action,
}: {
  role: ShellRole;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'VA';

  return (
    <div className={`dashboard-ui dashboard-ui-${roleAccent[role]}`}>
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-brand">
          <span className="dashboard-brand-mark"><BriefcaseBusiness size={16} /></span>
          <span>Vacancy</span>
        </Link>

        <nav className="dashboard-nav">
          {nav[role].map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={`${item.href}-${item.label}`} href={item.href} className={cn('dashboard-nav-link', active && 'active')}>
                <item.icon size={15} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-nav dashboard-nav-bottom">
          <Link href="/profile" className="dashboard-nav-link"><Settings size={15} /><span>Settings</span></Link>
          <button className="dashboard-nav-link" onClick={() => signOut({ callbackUrl: '/auth/login' })}>
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-search">
            <Search size={15} />
            <span>Search anything...</span>
          </div>
          <div className="dashboard-top-actions">
            <button className="icon-button" aria-label="Notifications"><Bell size={16} /></button>
            <div className="dashboard-user">
              <span className="dashboard-avatar">{initials}</span>
              <span>
                <strong>{session?.user?.name || title}</strong>
                <small>{session?.user?.role?.replace('_', ' ') || 'Account'}</small>
              </span>
            </div>
          </div>
        </header>

        <div className="dashboard-heading">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>

        {role === 'admin' && (
          <div className="role-ribbon">
            <ShieldCheck size={16} />
            Admin UI
          </div>
        )}
        {children}
      </section>
    </div>
  );
}
