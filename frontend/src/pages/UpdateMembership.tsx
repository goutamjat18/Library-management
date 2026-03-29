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

interface MembershipData {
  _id: string; firstName: string; lastName: string;
  status: string; startDate: string; endDate: string;
}

export default function UpdateMembership() {
  const navigate = useNavigate();
  const [membershipNum, setMembershipNum] = useState('');
  const [membership, setMembership] = useState<MembershipData | null>(null);
  const [extension, setExtension] = useState('6months');
  const [removeFlag, setRemoveFlag] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchMembership = async () => {
    if (!membershipNum) { setError('Membership number is required.'); return; }
    setError(''); setFetching(true);
    try {
      const { data } = await axios.get(`/api/memberships/${membershipNum}`);
      setMembership(data);
    } catch {
      setError('Membership not found.'); setMembership(null);
    } finally { setFetching(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membership) { setError('Please look up a membership first.'); return; }
    setError(''); setLoading(true);
    try {
      const payload = removeFlag ? { membershipRemove: true } : { membershipDuration: extension };
      const { data } = await axios.put(`/api/memberships/${membership._id}`, payload);
      setSuccess(removeFlag ? 'Membership cancelled.' : `Membership extended. New end date: ${new Date(data.endDate).toLocaleDateString('en-IN')}`);
      setMembership(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update membership.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout title="Update Membership" sidebar={<LibrarySidebar sections={maintenanceSidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">✏️ Update Membership</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        {success && <StatusAlert type="success">{success}</StatusAlert>}
        <div className="mb-4">
          <Label>Membership Number *</Label>
          <div className="flex gap-2 mt-1">
            <Input value={membershipNum} onChange={e => setMembershipNum(e.target.value)}
              placeholder="e.g. MEM000001" className="flex-1" />
            <Button onClick={fetchMembership} disabled={fetching}>{fetching ? '...' : 'Lookup'}</Button>
          </div>
        </div>
        {membership && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Name</Label><Input readOnly value={`${membership.firstName} ${membership.lastName}`} className="bg-muted" /></div>
                <div><Label>Status</Label><Input readOnly value={membership.status} className="bg-muted" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Start Date</Label><Input readOnly value={new Date(membership.startDate).toLocaleDateString('en-IN')} className="bg-muted" /></div>
                <div><Label>End Date</Label><Input readOnly value={new Date(membership.endDate).toLocaleDateString('en-IN')} className="bg-muted" /></div>
              </div>
            </div>
            <div>
              <Label>Membership Extension</Label>
              <div className="flex gap-5 mt-2">
                {([['6months', '6 Months'], ['1year', '1 Year'], ['2years', '2 Years']] as const).map(([val, lbl]) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input type="radio" name="ext" value={val} checked={extension === val && !removeFlag}
                      onChange={() => { setExtension(val); setRemoveFlag(false); }} className="accent-primary" /> {lbl}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Cancel Membership</Label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium mt-2">
                <input type="radio" name="ext" checked={removeFlag} onChange={() => setRemoveFlag(true)} className="accent-primary" />
                Remove / Cancel this membership
              </label>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Membership'}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/maintenance')}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
