'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import { mockJobs } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { BriefcaseBusiness, Building2, ShieldCheck } from 'lucide-react';

const CATEGORIES = [
  { name: 'Technology', count: 1240, icon: '💻', slug: 'Technology' },
  { name: 'Finance & Banking', count: 840, icon: '🏦', slug: 'Finance & Banking' },
  { name: 'Healthcare', count: 620, icon: '🏥', slug: 'Healthcare' },
  { name: 'Engineering', count: 980, icon: '⚙️', slug: 'Engineering' },
  { name: 'Education', count: 560, icon: '📚', slug: 'Education' },
  { name: 'Marketing', count: 430, icon: '📣', slug: 'Marketing' },
  { name: 'Logistics', count: 370, icon: '🚚', slug: 'Logistics' },
  { name: 'NGO / Non-Profit', count: 290, icon: '🤝', slug: 'NGO / Non-Profit' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and build your professional profile with your skills, education, and experience.', icon: '👤' },
  { step: '02', title: 'Discover Opportunities', desc: 'Browse thousands of verified vacancies filtered by role, location, salary, and more.', icon: '🔍' },
  { step: '03', title: 'Apply with Ease', desc: 'Submit your application with your CV and a custom cover letter in minutes.', icon: '📤' },
  { step: '04', title: 'Track & Get Hired', desc: 'Monitor every application in real-time and get interview invitations directly.', icon: '✅' },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  const getRoleDashboardLink = () => {
    const userRole = (session?.user as any)?.role;
    if (userRole === 'ADMIN') return '/admin/dashboard';
    if (userRole === 'EMPLOYER') return '/employer/dashboard';
    return '/dashboard';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ADMIN') return 'Administrator';
    if (role === 'EMPLOYER') return 'Employer';
    return 'Job Seeker';
  };

  return (
    <div className="page-content">



      {/* ── ROLE-BASED ACCESS BANNER ── */}
      {status === 'authenticated' && session?.user && (
        <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.1) 100%)', borderBottom: '1px solid rgba(16,185,129,0.3)', padding: '1rem 1.5rem' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ fontSize: '1.2rem' }}>
                {(session.user as any)?.role === 'ADMIN' && '🛡️'}
                {(session.user as any)?.role === 'EMPLOYER' && '🏢'}
                {(session.user as any)?.role === 'JOB_SEEKER' && '👤'}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome back, {session.user?.name}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {getRoleLabel((session.user as any)?.role)} Account
                </div>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href={getRoleDashboardLink()}>
                {(session.user as any)?.role === 'ADMIN' && '📊 Admin Dashboard'}
                {(session.user as any)?.role === 'EMPLOYER' && '📋 Employer Dashboard'}
                {(session.user as any)?.role === 'JOB_SEEKER' && '💼 My Dashboard'}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '4rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: -100, left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 50, right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-purple" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
            🇪🇹 Ethiopia&apos;s #1 Job Platform
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Find Your Next Career<br />
            <span className="gradient-text">Opportunity in Ethiopia</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Connect with thousands of verified employers. Search, apply, and track your job applications — all in one place.
          </p>

          <SearchBar />

          <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Popular: <Link href="/jobs?q=engineer" style={{ color: '#a5b4fc', marginRight: 8 }}>Engineer</Link>
            <Link href="/jobs?q=finance" style={{ color: '#a5b4fc', marginRight: 8 }}>Finance</Link>
            <Link href="/jobs?q=designer" style={{ color: '#a5b4fc', marginRight: 8 }}>Designer</Link>
            <Link href="/jobs?category=Technology" style={{ color: '#a5b4fc' }}>Tech</Link>
          </p>
        </div>
      </section>

      {/* ── RECENT JOBS ── */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Recently Posted <span className="gradient-text">Vacancies</span></h2>
              <p className="section-subtitle">Discover the newest opportunities on Et_vacancy</p>
            </div>
            <Link href="/jobs" className="btn-secondary">View All Jobs →</Link>
          </div>

          {loadingJobs ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading latest jobs...</div>
          ) : jobs.length > 0 ? (
            <div className="grid-3 stagger-children">
              {jobs.slice(0, 6).map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No jobs posted yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: '0 1.5rem 6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Browse by <span className="gradient-text">Category</span></h2>
            <p className="section-subtitle">Explore roles across all major industries</p>
          </div>
          <div className="grid-4 stagger-children">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/jobs?category=${encodeURIComponent(cat.slug)}`} className="card" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{cat.count.toLocaleString()} open positions</p>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* ── ROLE-BASED ACCESS ── */}
      <section style={{ padding: '0 1.5rem 6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Designed For <span className="gradient-text">Everyone</span></h2>
            <p className="section-subtitle">Different experience for job seekers, employers, and administrators</p>
          </div>
          <div className="grid-3 stagger-children">
            {/* Job Seeker Card */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👤</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Job Seekers</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Find your dream job, track applications, and connect with top employers
                </p>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                  <li>✓ Browse thousands of jobs</li>
                  <li>✓ Apply with one click</li>
                  <li>✓ Track applications</li>
                  <li>✓ Build your profile</li>
                </ul>
                {status === 'unauthenticated' && (
                  <Button asChild variant="outline" style={{ width: '100%', marginTop: '1.5rem' }}>
                    <Link href="/auth/register">Get Started</Link>
                  </Button>
                )}
                {status === 'authenticated' && (session?.user as any)?.role === 'JOB_SEEKER' && (
                  <Button asChild style={{ width: '100%', marginTop: '1.5rem' }}>
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Employer Card */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden', border: '2px solid rgba(16,185,129,0.3)' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', padding: '0.25rem 0.75rem', borderRadius: 999, background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>POPULAR</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏢</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Employers</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Post jobs, recruit talent, and build your team
                </p>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                  <li>✓ Post unlimited jobs</li>
                  <li>✓ Review applications</li>
                  <li>✓ Manage candidates</li>
                  <li>✓ Analytics & insights</li>
                </ul>
                {status === 'unauthenticated' && (
                  <Button asChild variant="outline" style={{ width: '100%', marginTop: '1.5rem' }}>
                    <Link href="/auth/register">Post a Job</Link>
                  </Button>
                )}
                {status === 'authenticated' && (session?.user as any)?.role === 'EMPLOYER' && (
                  <Button asChild style={{ width: '100%', marginTop: '1.5rem' }}>
                    <Link href="/employer/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>

            {/* Admin Card */}
            <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Administrators</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Manage the platform, users, and content
                </p>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                  <li>✓ Manage users</li>
                  <li>✓ Monitor jobs</li>
                  <li>✓ View analytics</li>
                  <li>✓ System settings</li>
                </ul>
                {status === 'authenticated' && (session?.user as any)?.role === 'ADMIN' && (
                  <Button asChild style={{ width: '100%', marginTop: '1.5rem' }}>
                    <Link href="/admin/dashboard">Go to Admin Panel</Link>
                  </Button>
                )}
                {status !== 'authenticated' || (session?.user as any)?.role !== 'ADMIN' && (
                  <Button variant="outline" disabled style={{ width: '100%', marginTop: '1.5rem' }}>
                    Admin Access Only
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding: '0 1.5rem 6rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">How <span className="gradient-text">Et_vacancy</span> Works</h2>
            <p className="section-subtitle">Your journey from job search to hired, simplified</p>
          </div>
          <div className="grid-4 stagger-children">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="card" style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em',
                  padding: '0.25rem 0.75rem', borderRadius: 999,
                }}>STEP {item.step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>{item.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: '0 1.5rem 6rem' }}>
        <div className="container">
          <div style={{
            borderRadius: 24, padding: 'clamp(2rem, 5vw, 4rem)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(16,185,129,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.5, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              {status === 'authenticated' ? (
                <>
                  <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                    Ready to advance your career?
                  </h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
                    {(session?.user as any)?.role === 'JOB_SEEKER' && 'Explore thousands of opportunities matched to your skills and preferences.'}
                    {(session?.user as any)?.role === 'EMPLOYER' && 'Find the best talent for your company. Post a job and start recruiting today.'}
                    {(session?.user as any)?.role === 'ADMIN' && 'Manage users, jobs, and companies on the Et_vacancy platform.'}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {(session?.user as any)?.role === 'JOB_SEEKER' && (
                      <>
                        <Button asChild className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/jobs">Browse Jobs →</Link>
                        </Button>
                        <Button asChild variant="outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/dashboard">My Applications</Link>
                        </Button>
                      </>
                    )}
                    {(session?.user as any)?.role === 'EMPLOYER' && (
                      <>
                        <Button asChild className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/employer/jobs/create">Post a Job →</Link>
                        </Button>
                        <Button asChild variant="outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/employer/dashboard">View Dashboard</Link>
                        </Button>
                        <Button asChild variant="outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/jobs">Browse Jobs</Link>
                        </Button>
                      </>
                    )}
                    {(session?.user as any)?.role === 'ADMIN' && (
                      <>
                        <Button asChild className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/admin/dashboard">Admin Panel →</Link>
                        </Button>
                        <Button asChild variant="outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                          <Link href="/jobs">View All Jobs</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                    Ready to take the next step?
                  </h2>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
                    Join over 180,000 job seekers who found their dream role through Et_vacancy.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button asChild className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                      <Link href="/auth/register">Get Started Free →</Link>
                    </Button>
                    <Button asChild variant="outline" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                      <Link href="/employer/dashboard">Post a Job</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <div className="container">
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.75rem' }}><span className="gradient-text">Et</span>_vacancy</div>
              <p style={{ lineHeight: 1.7, maxWidth: 220 }}>Ethiopia&apos;s premier job vacancy and career development platform.</p>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>For Job Seekers</div>
              {['Find Jobs', 'Career Tips', 'Resume Builder', 'Salary Guide'].map(l => <Link key={l} href="#" style={{ display: 'block', marginBottom: '0.5rem', transition: 'color 0.2s' }}>{l}</Link>)}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>For Employers</div>
              {['Post a Job', 'Browse Candidates', 'Pricing', 'Employer Branding'].map(l => <Link key={l} href="/employer/dashboard" style={{ display: 'block', marginBottom: '0.5rem' }}>{l}</Link>)}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>Company</div>
              <Link href="/about" style={{ display: 'block', marginBottom: '0.5rem' }}>About Us</Link>
              <Link href="#" style={{ display: 'block', marginBottom: '0.5rem' }}>Blog</Link>
              <Link href="#" style={{ display: 'block', marginBottom: '0.5rem' }}>Privacy Policy</Link>
              <Link href="#" style={{ display: 'block', marginBottom: '0.5rem' }}>Terms & Conditions</Link>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p>© 2026 Et_vacancy. All rights reserved.</p>
            <p>🇪🇹 Made with ❤️ in Ethiopia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
