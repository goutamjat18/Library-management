import { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
import StatusAlert from '@/components/StatusAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maintenanceSidebarSections } from './Maintenance';

interface UserItem { _id: string; name: string; username: string; isAdmin: boolean; status: string; }

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', password: '', isAdmin: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    axios.get('/api/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.username || !form.password) { setError('All fields are required.'); return; }
    setError('');
    try {
      await axios.post('/api/users', form);
      setSuccess('User added successfully.');
      setForm({ name: '', username: '', password: '', isAdmin: false });
      setShowAdd(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add user.');
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    try {
      await axios.put(`/api/users/${user._id}`, { status: user.status === 'Active' ? 'Inactive' : 'Active' });
      fetchUsers();
    } catch {}
  };

  return (
    <PageLayout title="User Management" sidebar={<LibrarySidebar sections={maintenanceSidebarSections} />}>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">👥 User Management</h2>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>+ Add User</Button>
        </div>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        {success && <StatusAlert type="success">{success}</StatusAlert>}
        {showAdd && (
          <form onSubmit={handleAdd} className="mb-6 rounded-lg bg-muted/50 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
              <div><Label>Username *</Label><Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="Username" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Password *</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" /></div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="checkbox" checked={form.isAdmin} onChange={e => setForm(f => ({ ...f, isAdmin: e.target.checked }))} /> Admin
                </label>
              </div>
            </div>
            <Button type="submit" size="sm">Create User</Button>
          </form>
        )}
        {loading ? (
          <StatusAlert type="info">Loading users...</StatusAlert>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Username</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{u.username}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.isAdmin ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                      }`}>{u.isAdmin ? 'Admin' : 'User'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(u)}>
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
