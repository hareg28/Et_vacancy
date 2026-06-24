import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-content">
      <div className="container" style={{ maxWidth: 900 }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>🇪🇹 Our Story</span>
          <h1 className="section-title">About <span className="gradient-text">Et_vacancy</span></h1>
          <p className="section-subtitle" style={{ maxWidth: 600, margin: '0.75rem auto 0' }}>
            We&apos;re on a mission to connect Ethiopia&apos;s workforce with opportunities that matter — transparently, efficiently, and at scale.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
            To eliminate the frustration of job searching and hiring in Ethiopia by building a transparent, verified, and data-driven platform that empowers both job seekers and employers to make confident decisions.
          </p>
        </div>

        {/* Values */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {[
            { icon: '🔍', title: 'Transparency', desc: 'Every job posting is verified. Every application status is visible. No more ghosting.' },
            { icon: '⚡', title: 'Efficiency', desc: 'Apply in minutes, not hours. Our streamlined process respects your time.' },
            { icon: '🤝', title: 'Opportunity', desc: 'We believe everyone deserves access to quality opportunities, regardless of their background.' },
          ].map(v => (
            <div key={v.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{v.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{v.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: '3rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.75rem', marginBottom: '1rem' }}>Ready to get started?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Join thousands of professionals finding their dream roles on Et_vacancy today.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>Create Free Account →</Link>
            <Link href="/jobs" className="btn-secondary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>Browse Jobs</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
