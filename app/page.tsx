'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import JobCard from '@/components/JobCard';
import { mockJobs } from '@/lib/mock-data';

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
  const [jobs, setJobs] = useState(mockJobs);

  // Periodically refresh jobs
  useEffect(() => {
    const interval = setInterval(() => setJobs([...mockJobs]), 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: `${jobs.length}+`, label: 'Active Jobs', icon: '💼' },
    { value: '3,200+', label: 'Companies', icon: '🏢' },
    { value: '180,000+', label: 'Job Seekers', icon: '👥' },
    { value: '94%', label: 'Success Rate', icon: '🎯' },
  ];

  return (
    <div className="page-content">

      {/* ── HERO ── */}
      <section style={{ textAlign: 'center', padding: '4rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: -100, left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 50, right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div className="animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-purple" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
            🇪🇹 Ethiopia's #1 Job Platform
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

      {/* ── STATS ── */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div className="container">
          <div className="grid-4 stagger-children">
            {stats.map(stat => (
              <div key={stat.label} className="stat-card animate-fade-in-up" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div className="stat-value gradient-text">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
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

      {/* ── FEATURED JOBS ── */}
      <section style={{ padding: '0 1.5rem 6rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Featured <span className="gradient-text">Vacancies</span></h2>
              <p className="section-subtitle">Hand-picked opportunities from top Ethiopian companies</p>
            </div>
            <Link href="/jobs" className="btn-secondary">View All Jobs →</Link>
          </div>

          <div className="grid-3 stagger-children">
            {jobs.slice(0, 3).map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
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
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
                Ready to take the next step?
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
                Join over 180,000 job seekers who found their dream role through Et_vacancy.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                  Get Started Free →
                </Link>
                <Link href="/employer/dashboard" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
                  Post a Job
                </Link>
              </div>
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
              <p style={{ lineHeight: 1.7, maxWidth: 220 }}>Ethiopia's premier job vacancy and career development platform.</p>
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
              {['About Us', 'Blog', 'Privacy Policy', 'Terms & Conditions'].map(l => <Link key={l} href={`/${l.toLowerCase().replace(/ /g, '-')}`} style={{ display: 'block', marginBottom: '0.5rem' }}>{l}</Link>)}
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
