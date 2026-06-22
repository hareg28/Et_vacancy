'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Role = 'JOB_SEEKER' | 'EMPLOYER';

export default function RegisterPage() {
  const [role, setRole] = useState<Role>('JOB_SEEKER');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role;
      if (role === 'EMPLOYER') {
        router.push('/employer/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Account Created!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your account has been created successfully. You can now log in.</p>
          <Link href="/auth/login" className="btn-primary" style={{ justifyContent: 'center' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem', position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1000, pointerEvents: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.5rem' }}>
            <span className="gradient-text">Et</span>_vacancy
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join thousands of professionals on Et_vacancy</p>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1000 }}>
          {(['JOB_SEEKER', 'EMPLOYER'] as Role[]).map(r => (
            <button key={r} type="button" onClick={() => {
                console.log(`${r} clicked!`);
                setRole(r);
            }} style={{
              padding: '1rem', borderRadius: 12, border: `2px solid ${role === r ? '#6366f1' : 'var(--border-color)'}`,
              background: role === r ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
              color: role === r ? '#a5b4fc' : 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s ease', fontFamily: 'inherit', pointerEvents: 'auto', position: 'relative',
              zIndex: 1000,
            }}>
              <span style={{ fontSize: '1.5rem' }}>{r === 'JOB_SEEKER' ? '👤' : '🏢'}</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r === 'JOB_SEEKER' ? 'Job Seeker' : 'Employer'}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{r === 'JOB_SEEKER' ? 'Find your next role' : 'Hire top talent'}</span>
            </button>
          ))}
        </div>

        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', zIndex: 1000 }}>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">{role === 'EMPLOYER' ? 'Company Name' : 'Full Name'}</label>
              <input id="name" type="text" className="form-input" placeholder={role === 'EMPLOYER' ? 'Acme Corp Ltd.' : 'Abebe Bekele'}
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <input id="reg-password" type="password" className="form-input" placeholder="Min. 8 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" className="form-input" placeholder="Repeat password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              By signing up, you agree to our{' '}
              <Link href="/terms-and-conditions" style={{ color: '#a5b4fc' }}>Terms</Link> and{' '}
              <Link href="/privacy-policy" style={{ color: '#a5b4fc' }}>Privacy Policy</Link>.
            </p>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : `Create ${role === 'EMPLOYER' ? 'Employer' : ''} Account`}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#a5b4fc', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
