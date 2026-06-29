import Image from 'next/image';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string | { name: string; logoUrl?: string | null };
  location?: string | null;
  salary?: string | null;
  jobType?: string;
  isRemote?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  isVerified?: boolean;
  postedAt?: string;
  deadline?: string | null;
}

interface JobCardProps {
  job: Job;
}

const typeColors: Record<string, string> = {
  FULL_TIME: 'badge-green',
  PART_TIME: 'badge-amber',
  CONTRACT: 'badge-blue',
  INTERNSHIP: 'badge-purple',
  FREELANCE: 'badge-rose',
};

const typeLabels: Record<string, string> = {
  FULL_TIME: 'Full-Time',
  PART_TIME: 'Part-Time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance',
};

export default function JobCard({ job }: JobCardProps) {
  const companyName = !job.company
    ? 'Unknown Company'
    : typeof job.company === 'string'
    ? job.company
    : job.company.name || 'Unknown Company';
  const companyLogo = job.company && typeof job.company === 'object' ? job.company.logoUrl : null;
  const initials = companyName.substring(0, 2).toUpperCase();
  const jobType = job.jobType || 'FULL_TIME';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', opacity: 0, animation: 'fadeInUp 0.5s ease forwards' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        {/* Company Logo */}
        <div style={{
          width: 52, height: 52, borderRadius: 12, flexShrink: 0,
          background: companyLogo ? 'transparent' : 'linear-gradient(135deg, #6366f1, #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--glass-border)', overflow: 'hidden',
          fontWeight: 700, fontSize: '1rem', color: 'white',
        }}>
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={companyName}
              width={52}
              height={52}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              unoptimized
            />
          ) : initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem', lineHeight: 1.3 }}>
            <Link href={`/jobs/${job.id}`} className="job-card-title-link">
              {job.title}
            </Link>
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {companyName}
            {job.isVerified && (
              <svg style={{ marginLeft: 6, verticalAlign: 'middle', color: '#10b981' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            )}
          </p>
        </div>

        {job.isFeatured && (
          <span className="badge badge-amber" style={{ flexShrink: 0 }}>⭐ Featured</span>
        )}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        {job.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
        )}
        {job.isRemote && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>🌐 Remote</span>}
        {job.salary && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {job.salary}
          </span>
        )}
      </div>

      {/* Type + Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
        <span className={`badge ${typeColors[jobType] || 'badge-purple'}`}>{typeLabels[jobType] || jobType}</span>
        {(job.tags || []).map((tag, i) => <span key={i} className="tag">{tag}</span>)}
      </div>

      {/* Deadline */}
      {job.deadline && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Deadline: {new Date(job.deadline).toLocaleDateString('en-ET', { year: 'numeric', month: 'short', day: 'numeric' })}
        </p>
      )}

      {/* CTA */}
      <Link href={`/jobs/${job.id}`} className="btn-primary" style={{ textAlign: 'center', marginTop: 'auto' }}>
        View & Apply →
      </Link>
    </div>
  );
}
