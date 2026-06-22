import Link from 'next/link';

const USERS = [
  { id: 'u1', name: 'Abebe Bekele',    email: 'abebe@email.com',  role: 'JOB_SEEKER', status: 'ACTIVE',   joined: '2026-06-01' },
  { id: 'u2', name: 'Marta Girma',     email: 'marta@email.com',  role: 'JOB_SEEKER', status: 'ACTIVE',   joined: '2026-06-05' },
  { id: 'u3', name: 'Ethio Telecom',   email: 'hr@et.et',          role: 'EMPLOYER',   status: 'ACTIVE',   joined: '2026-05-20' },
  { id: 'u4', name: 'Dawit Finance',   email: 'dawit@dfin.et',    role: 'EMPLOYER',   status: 'PENDING',  joined: '2026-06-18' },
  { id: 'u5', name: 'Hana Tadesse',    email: 'hana@email.com',   role: 'JOB_SEEKER', status: 'SUSPENDED',joined: '2026-04-12' },
];

const JOBS = [
  { id: 'j1', title: 'Senior Software Engineer',  company: 'Ethio Telecom',  status: 'APPROVED',  applicants: 42, featured: true  },
  { id: 'j2', title: 'Finance Officer',            company: 'Dashen Bank',    status: 'PENDING',   applicants: 12, featured: false },
  { id: 'j3', title: 'Marketing Manager',          company: 'Safaricom',      status: 'APPROVED',  applicants: 28, featured: false },
  { id: 'j4', title: 'Suspicious Job Post',        company: 'Unknown Corp',   status: 'FLAGGED',   applicants: 3,  featured: false },
];

const STATS = [
  { label: 'Total Users', value: 18400, icon: '👥', color: '#a5b4fc' },
  { label: 'Employers', value: 3200,   icon: '🏢', color: '#6ee7b7' },
  { label: 'Active Jobs', value: 12400, icon: '💼', color: '#fbbf24' },
  { label: 'Applications', value: 89600, icon: '📤', color: '#f59e0b' },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  ACTIVE:     { label: 'Active',    className: 'badge badge-green'  },
  PENDING:    { label: 'Pending',   className: 'badge badge-amber'  },
  SUSPENDED:  { label: 'Suspended', className: 'badge badge-rose'   },
  APPROVED:   { label: 'Approved',  className: 'badge badge-green'  },
  FLAGGED:    { label: 'Flagged',   className: 'badge badge-rose'   },
};

export default function AdminDashboardPage() {
  return (
    <div className="page-content">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>Admin Panel</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              <span className="gradient-text">Et_vacancy</span> Admin
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Platform management and oversight</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4 stagger-children" style={{ marginBottom: '2.5rem' }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card animate-fade-in-up">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                <span style={{ fontSize: '1.75rem' }}>{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Section: Pending Employer Approvals */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🕐 Pending Employer Approvals
            <span className="badge badge-amber">{USERS.filter(u => u.status === 'PENDING').length}</span>
          </h2>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {USERS.map(user => {
                  const badge = STATUS_BADGE[user.status] || { label: user.status, className: 'badge' };
                  return (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600 }}>{user.name}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</td>
                      <td><span className="badge badge-blue">{user.role.replace('_', ' ')}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(user.joined).toLocaleDateString()}</td>
                      <td><span className={badge.className}>{badge.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {user.status === 'PENDING' && <button className="btn-success" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Approve</button>}
                          {user.status === 'ACTIVE' && <button className="btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Suspend</button>}
                          {user.status === 'SUSPENDED' && <button className="btn-success" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Reinstate</button>}
                          <button className="btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Job Moderation */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💼 Job Moderation
            <span className="badge badge-rose">{JOBS.filter(j => j.status === 'FLAGGED' || j.status === 'PENDING').length} need review</span>
          </h2>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Job Title</th><th>Company</th><th>Applicants</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {JOBS.map(job => {
                  const badge = STATUS_BADGE[job.status] || { label: job.status, className: 'badge' };
                  return (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 600 }}>{job.title}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{job.company}</td>
                      <td><span className="badge badge-purple">{job.applicants}</span></td>
                      <td>{job.featured ? <span className="badge badge-amber">⭐ Yes</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>}</td>
                      <td><span className={badge.className}>{badge.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {job.status === 'PENDING' && <button className="btn-success" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Approve</button>}
                          {!job.featured && <button className="btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Feature</button>}
                          <button className="btn-danger" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>Remove</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid-4">
          {[
            { label: 'Manage Categories', href: '/admin/categories', icon: '🗂️', desc: 'Add, edit or remove job categories' },
            { label: 'Reports', href: '/admin/reports', icon: '📊', desc: 'View monthly statistics and insights' },
            { label: 'Content Management', href: '/admin/content', icon: '📝', desc: 'FAQs, Blog, Terms & Privacy' },
            { label: 'User Roles', href: '/admin/roles', icon: '🔐', desc: 'Manage user permissions and roles' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="card" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{item.label}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
