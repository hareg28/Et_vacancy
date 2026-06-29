'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Building2, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Company = {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  isApproved: boolean;
  createdAt: string;
  employer: { user: { name: string | null; email: string | null; isActive: boolean } };
  _count: { jobs: number };
};

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    const res = await fetch('/api/admin/companies');
    if (res.ok) setCompanies(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchCompanies();
    });
  }, [fetchCompanies]);

  const updateStatus = async (id: string, isApproved: boolean) => {
    setUpdating(id);
    await fetch(`/api/admin/companies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved }),
    });
    await fetchCompanies();
    setUpdating(null);
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-amber-400" />
              Company Management
            </h1>
            <p className="text-muted-foreground mt-1">Approve or reject employer companies</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading companies...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>Employer</th>
                  <th>Jobs</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No companies registered yet</td></tr>
                ) : companies.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.industry || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.location || '—'}</td>
                    <td>
                      <div>{c.employer.user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.employer.user.email}</div>
                    </td>
                    <td>{c._count.jobs}</td>
                    <td>
                      <span className={`badge ${c.isApproved ? 'badge-green' : 'badge-amber'}`}>
                        {c.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!c.isApproved && (
                          <button
                            className="btn-primary"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                            disabled={updating === c.id}
                            onClick={() => updateStatus(c.id, true)}
                          >
                            {updating === c.id ? '...' : 'Approve'}
                          </button>
                        )}
                        {c.isApproved && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                            disabled={updating === c.id}
                            onClick={() => updateStatus(c.id, false)}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
