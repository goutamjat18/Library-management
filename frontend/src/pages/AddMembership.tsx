import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
import StatusAlert from '@/components/StatusAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maintenanceSidebarSections } from './Maintenance';

export default function AddMembership() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', contactNumber: '',
    contactAddress: '', aadharCardNo: '',
    startDate: new Date().toISOString().split('T')[0],
    membershipDuration: '6months'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof typeof form)[] = ['firstName', 'lastName', 'contactNumber', 'contactAddress', 'aadharCardNo', 'startDate'];
    for (const k of required) {
      if (!form[k]) { setError(`All fields are required. Please fill in ${k}.`); return; }
    }
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/memberships', form);
      setSuccess(`Membership created! ID: ${data.membershipId}`);
      setForm({ firstName: '', lastName: '', contactNumber: '', contactAddress: '', aadharCardNo: '',
        startDate: new Date().toISOString().split('T')[0], membershipDuration: '6months' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create membership.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout title="Add Membership" sidebar={<LibrarySidebar sections={maintenanceSidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">➕ Add Membership</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        {success && <StatusAlert type="success">{success}</StatusAlert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name *</Label><Input value={form.firstName} onChange={set('firstName')} placeholder="First name" /></div>
            <div><Label>Last Name *</Label><Input value={form.lastName} onChange={set('lastName')} placeholder="Last name" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Contact Number *</Label><Input value={form.contactNumber} onChange={set('contactNumber')} placeholder="Mobile number" /></div>
            <div><Label>Aadhar Card No *</Label><Input value={form.aadharCardNo} onChange={set('aadharCardNo')} placeholder="12-digit Aadhar number" /></div>
          </div>
          <div><Label>Contact Address *</Label>
            <textarea className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              value={form.contactAddress} onChange={set('contactAddress')} placeholder="Full address" />
          </div>
          <div><Label>Start Date *</Label><Input type="date" value={form.startDate} onChange={set('startDate')} /></div>
          <div>
            <Label>Membership Duration *</Label>
            <div className="flex gap-5 mt-2">
              {([['6months', '6 Months'], ['1year', '1 Year'], ['2years', '2 Years']] as const).map(([val, lbl]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" name="duration" value={val}
                    checked={form.membershipDuration === val}
                    onChange={() => setForm(f => ({ ...f, membershipDuration: val }))} className="accent-primary" /> {lbl}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Add Membership'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/maintenance')}>Cancel</Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
