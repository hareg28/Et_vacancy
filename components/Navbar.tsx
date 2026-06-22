'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Determine nav links based on user role
  const getNavLinks = () => {
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any)?.role;

      if (userRole === 'EMPLOYER') {
        return [
          { href: '/employer/dashboard', label: 'Dashboard' },
          { href: '/employer/jobs/create', label: 'Post Job' },
          { href: '/companies', label: 'Companies' },
        ];
      }

      // Job Seeker links (default)
      return [
        { href: '/jobs', label: 'Find Jobs' },
        { href: '/companies', label: 'Companies' },
        { href: '/dashboard', label: 'My Applications' },
      ];
    }

    // Not authenticated links
    return [
      { href: '/jobs', label: 'Find Jobs' },
      { href: '/companies', label: 'Companies' },
      { href: '/about', label: 'About' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
        background: 'rgba(7,7,15,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)', height: '70px',
      }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            <span className="gradient-text">Et</span>_vacancy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.9rem', fontWeight: 500,
              color: pathname === link.href ? '#a5b4fc' : 'var(--text-secondary)',
              background: pathname === link.href ? 'rgba(99,102,241,0.12)' : 'transparent',
              transition: 'all 0.2s ease',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {status === 'authenticated' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>{session.user?.name}</span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', padding: '0.25rem 0.5rem', borderRadius: 4 }}>
                  {(session.user as any)?.role === 'EMPLOYER' ? 'Employer' : 'Job Seeker'}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="btn-secondary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Log In
              </Link>
              <Link href="/auth/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Sign Up
              </Link>
            </>
          )}
          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ display: 'none', padding: '0.5rem', color: 'var(--text-secondary)' }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(7,7,15,0.98)', borderTop: '1px solid var(--border-color)',
          padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
              padding: '0.75rem 1rem', borderRadius: 8, fontWeight: 500, fontSize: '0.95rem',
              color: pathname === link.href ? '#a5b4fc' : 'var(--text-secondary)',
              background: pathname === link.href ? 'rgba(99,102,241,0.12)' : 'transparent',
            }}>
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            {status === 'authenticated' ? (
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Log Out
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link href="/auth/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
