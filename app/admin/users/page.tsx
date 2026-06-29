'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  employer?: { company: { name: string; isApproved: boolean } | null } | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUsers();
    });
  }, [fetchUsers]);

  const toggleActive = async (id: string, isActive: boolean) => {
    setUpdating(id);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
    await fetchUsers();
    setUpdating(null);
  };

  const roleBadge = (role: string) => {
    if (role === 'ADMIN') return 'badge-amber';
    if (role === 'EMPLOYER') return 'badge-green';
    return 'badge-blue';
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Users className="w-7 h-7 text-indigo-400" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-1">View and manage all platform users</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">← Back to Dashboard</Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading users...
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td><span className={`badge ${roleBadge(u.role)}`}>{u.role.replace('_', ' ')}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.employer?.company?.name || '—'}</td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-green' : 'badge-rose'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className={u.isActive ? 'btn-secondary' : 'btn-primary'}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}
                        disabled={updating === u.id}
                        onClick={() => toggleActive(u.id, !u.isActive)}
                      >
                        {updating === u.id ? '...' : u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
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
