'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ defaultQuery = '', defaultLocation = '' }) {
  const [query, setQuery] = useState(defaultQuery);
  const [location, setLocation] = useState(defaultLocation);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    startTransition(() => {
      router.push(`/jobs?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} style={{
      display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)',
      borderRadius: 16, padding: '0.625rem',
      boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
      maxWidth: 680, margin: '0 auto',
    }}>
      {/* Search input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 2, minWidth: 200, padding: '0.25rem 0.75rem' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Job title, skill, or company..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%', fontFamily: 'inherit' }}
        />
      </div>

      {/* Separator */}
      <div style={{ width: 1, background: 'var(--border-color)', margin: '4px 0' }} />

      {/* Location input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 150, padding: '0.25rem 0.75rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <input
          type="text"
          placeholder="Location..."
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem', width: '100%', fontFamily: 'inherit' }}
        />
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary" disabled={isPending} style={{ flexShrink: 0 }}>
        {isPending ? 'Searching...' : 'Search Jobs'}
      </button>
    </form>
  );
}
