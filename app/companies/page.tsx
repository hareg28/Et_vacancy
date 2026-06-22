'use client';
import { useState } from 'react';
import Link from 'next/link';
import { mockCompanies, mockJobs } from '@/lib/mock-data';

const INDUSTRIES = ['All', 'Technology', 'Finance & Banking', 'Telecommunications', 'NGO / Non-Profit', 'FinTech', 'Healthcare', 'Education', 'Other'];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem', fontSize: '0.82rem' }}>{rating}</span>
    </span>
  );
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');

  const filtered = mockCompanies.filter(c => {
    const matchesSearch = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industry === 'All' || c.industry === industry;
    return matchesSearch && matchesIndustry;
  });

  const getOpenJobsCount = (companyId: string) => mockJobs.filter(j => j.company.id === companyId).length;

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">Top <span className="gradient-text">Companies</span> Hiring Now</h1>
          <p className="section-subtitle">Explore {mockCompanies.length} verified companies and find your ideal workplace</p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 2, minWidth: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '0 1rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', padding: '0.75rem 0', width: '100%', fontFamily: 'inherit' }} />
          </div>
          <select className="form-select" style={{ width: 'auto', minWidth: 180 }} value={industry} onChange={e => setIndustry(e.target.value)}>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>

        {/* Company Grid */}
        <div className="grid-3 stagger-children" style={{ marginBottom: '2rem' }}>
          {filtered.map(company => (
            <Link key={company.id} href={`/companies/${company.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
                {/* Logo & Name */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.1rem', color: 'white',
                  }}>
                    {company.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>{company.name}</h3>
                      {company.isVerified && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{company.industry}</p>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                  {company.description.length > 100 ? company.description.substring(0, 100) + '...' : company.description}
                </p>

                {/* Meta */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>📍 {company.location}</span>
                  <span>👥 {company.size}</span>
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StarRating rating={company.rating} />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({company.reviews} reviews)</span>
                </div>

                {/* Open Jobs */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span className="badge badge-green">{getOpenJobsCount(company.id)} open positions</span>
                  <span style={{ fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 600 }}>View Jobs →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <h3>No Companies Found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
