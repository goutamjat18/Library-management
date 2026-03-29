import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
import StatusAlert from '@/components/StatusAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, BookOpen, Undo2, Coins } from 'lucide-react';

const sidebarSections = [{ title: 'Transactions', links: [
  { to: '/transactions/available', label: 'Book Available?', icon: Search },
  { to: '/transactions/issue', label: 'Issue Book', icon: BookOpen },
  { to: '/transactions/return', label: 'Return Book', icon: Undo2 },
  { to: '/transactions/fine', label: 'Pay Fine', icon: Coins },
]}];

export default function PayFine() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const txn = state?.transaction;
  const fineCalculated = state?.fine || 0;

  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState(txn?.remarks || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!txn) {
    return (
      <PageLayout title="Pay Fine" sidebar={<LibrarySidebar sections={sidebarSections} />}>
        <div className="glass-card p-6">
          <StatusAlert type="info">
            No transaction selected. Please go to <a href="/transactions/return" className="text-primary underline">Return Book</a> first.
          </StatusAlert>
        </div>
      </PageLayout>
    );
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fineCalculated > 0 && !finePaid) {
      setError('Fine must be paid (check the "Fine Paid" checkbox) before completing the return.');
      return;
    }
    setError(''); setLoading(true);
    try {
      await axios.post('/api/transactions/return-confirm', {
        transactionId: txn._id, finePaid, remarks
      });
      navigate('/transactions', { state: { success: 'Book returned successfully!' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete return.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout title="Pay Fine" sidebar={<LibrarySidebar sections={sidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">💰 Pay Fine</h2>
        {fineCalculated > 0
          ? <StatusAlert type="warning">⚠️ Fine of ₹{fineCalculated} is due. Please pay before confirming.</StatusAlert>
          : <StatusAlert type="success">✅ No fine applicable. You can confirm the return.</StatusAlert>
        }
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Book Name</Label><Input readOnly value={txn.bookId?.name || ''} className="bg-muted" /></div>
            <div><Label>Author</Label><Input readOnly value={txn.bookId?.author || ''} className="bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Serial No</Label><Input readOnly value={txn.serialNo || ''} className="bg-muted" /></div>
            <div><Label>Issue Date</Label><Input readOnly value={txn.issueDate?.split('T')[0] || ''} className="bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Expected Return Date</Label><Input readOnly value={txn.returnDate?.split('T')[0] || ''} className="bg-muted" /></div>
            <div><Label>Actual Return Date</Label><Input readOnly value={txn.actualReturnDate?.split('T')[0] || ''} className="bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Fine Calculated (₹)</Label><Input readOnly value={fineCalculated} className="bg-muted" /></div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input type="checkbox" checked={finePaid} onChange={e => setFinePaid(e.target.checked)}
                  disabled={fineCalculated === 0} className="rounded border-input" />
                Fine Paid
              </label>
            </div>
          </div>
          <div>
            <Label>Remarks (Optional)</Label>
            <textarea className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Confirm Return'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/transactions')}>Cancel</Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
