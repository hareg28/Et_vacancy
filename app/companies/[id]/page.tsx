'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockCompanies, mockJobs } from '@/lib/mock-data';

function StarRating({ rating }: { rating: number }) {
  return <span style={{ color: '#fbbf24' }}>{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>;
}

export default function CompanyDetailPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'reviews'>('about');
  const [newReview, setNewReview] = useState({ rating: 5, title: '', content: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const company = mockCompanies.find(c => c.id === params.id);
  
  if (!company) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Company Not Found</h1>
        <Link href="/companies" className="btn-primary">Browse All Companies</Link>
      </div>
    );
  }
  
  const openJobs = mockJobs.filter(j => j.company.id === company.id);

  return (
    <div className="page-content">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Home</Link><span className="breadcrumb-sep">/</span>
          <Link href="/companies">Companies</Link><span className="breadcrumb-sep">/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{company.name}</span>
        </div>

        {/* Company Hero */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: 96, height: 96, borderRadius: 20, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '2rem', color: 'white',
            }}>
              {company.name.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{company.name}</h1>
                {company.isVerified && <span className="badge badge-green">✓ Verified</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{company.industry} · {company.location}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <span>👥 {company.size}</span>
                <span><StarRating rating={company.rating} /> {company.rating} ({company.reviews} reviews)</span>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#a5b4fc' }}>🌐 Website</a>
                )}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={{ textAlign: 'center', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '1rem 1.5rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a5b4fc' }}>{openJobs.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Open Positions</div>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setActiveTab('jobs')}>
                View All Jobs →
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          {(['about', 'jobs', 'reviews'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.75rem 1.5rem', fontWeight: 600, fontSize: '0.9rem',
              color: activeTab === tab ? '#a5b4fc' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab ? '#6366f1' : 'transparent'}`,
              background: 'transparent', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
            }}>
              {tab === 'jobs' ? `Jobs (${openJobs.length})` : tab === 'reviews' ? `Reviews (${company.reviews})` : 'About'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.25rem' }}>About {company.name}</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.95rem' }}>{company.description}</div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {openJobs.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <h3>No Open Positions</h3>
                <p>This company is not hiring right now. Check back later!</p>
              </div>
            ) : (
              openJobs.map(job => (
                <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.35rem' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary}</span>
                      <span>⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Link href={`/jobs/${job.id}`} className="btn-primary" style={{ fontSize: '0.875rem' }}>View & Apply →</Link>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Rating Summary */}
            <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fbbf24' }}>{company.rating}</div>
                <StarRating rating={company.rating} />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{company.reviews} reviews</div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                {[5,4,3,2,1].map(star => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: 16 }}>{star}★</span>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%` }} />
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', width: 30 }}>{star === 5 ? '60%' : star === 4 ? '25%' : star === 3 ? '10%' : star === 2 ? '3%' : '2%'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Placeholder reviews since we don't store them in mock data yet */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <StarRating rating={5} />
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Great Place to Work</h4>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Anonymous Employee</p>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString()}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>Professional environment with good career growth opportunities.</p>
              </div>
            </div>

            {/* Write a Review */}
            {!reviewSubmitted ? (
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Write a Review</h3>
                <form onSubmit={e => { e.preventDefault(); setReviewSubmitted(true); }}>
                  <div className="form-group">
                    <label className="form-label">Your Rating</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {[1,2,3,4,5].map(star => (
                        <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })} style={{ fontSize: '1.75rem', color: star <= newReview.rating ? '#fbbf24' : 'var(--text-muted)', transition: 'color 0.15s', background: 'none', border: 'none', cursor: 'pointer' }}>★</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review Title</label>
                    <input className="form-input" placeholder="Summarize your experience..." value={newReview.title} onChange={e => setNewReview({ ...newReview, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea className="form-textarea" placeholder="Share details about your experience working here..." value={newReview.content} onChange={e => setNewReview({ ...newReview, content: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              </div>
            ) : (
              <div className="alert alert-success">✅ Your review has been submitted. Thank you!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
