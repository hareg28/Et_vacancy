'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  if (sent) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: 440 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Check your email</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            We sent a password reset link to <strong>{email}</strong>. The link expires in 30 minutes.
          </p>
          <Link href="/auth/login" className="btn-secondary" style={{ justifyContent: 'center' }}>← Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔑</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Forgot Password?</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No worries. Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fp-email">Email address</label>
              <input id="fp-email" type="email" className="form-input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Remember your password?{' '}
          <Link href="/auth/login" style={{ color: '#a5b4fc', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
