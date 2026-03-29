import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface TransactionItem {
  _id: string;
  bookId: { _id: string; name: string; author: string; serialNo?: string };
  membershipId: { _id: string; firstName: string; lastName: string } | string;
  serialNo?: string;
  issueDate?: string;
}

export default function ReturnBook() {
  const navigate = useNavigate();
  const [activeIssues, setActiveIssues] = useState<TransactionItem[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(null);
  const [serialNo, setSerialNo] = useState('');
  const [actualReturnDate, setActualReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBookName, setSelectedBookName] = useState('');

  useEffect(() => {
    axios.get('/api/transactions/active').then(r => setActiveIssues(r.data)).catch(() => {});
  }, []);

  const bookNames = [...new Set(activeIssues.map(t => t.bookId?.name).filter(Boolean))];

  const filteredIssues = selectedBookName
    ? activeIssues.filter(t => t.bookId?.name === selectedBookName)
    : activeIssues;

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBookName(e.target.value);
    setSelectedTxn(null);
    setSerialNo('');
  };

  const handleSerialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sn = e.target.value;
    setSerialNo(sn);
    const txn = filteredIssues.find(t => t.bookId?.serialNo === sn || t.serialNo === sn);
    if (txn) setSelectedTxn(txn);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) { setError('Please select a book to return.'); return; }
    if (!serialNo) { setError('Serial number is mandatory.'); return; }
    setError(''); setLoading(true);
    try {
      const memId = typeof selectedTxn.membershipId === 'string'
        ? selectedTxn.membershipId
        : selectedTxn.membershipId._id;
      const { data } = await axios.post('/api/transactions/return-initiate', {
        bookId: selectedTxn.bookId._id, membershipId: memId,
        serialNo, actualReturnDate, remarks
      });
      navigate('/transactions/fine', { state: { transaction: data.transaction, fine: data.fineCalculated } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate return.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout title="Return Book" sidebar={<LibrarySidebar sections={sidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">↩️ Return Book</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Book Name *</Label>
            <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={selectedBookName} onChange={handleBookChange}>
              <option value="">-- Select Book --</option>
              {bookNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <Label>Author Name</Label>
            <textarea readOnly className="mt-1 w-full rounded-lg border border-input bg-muted px-3 py-2 text-sm" rows={2}
              value={selectedTxn ? selectedTxn.bookId?.author : filteredIssues[0]?.bookId?.author || ''}
              placeholder="Auto-populated" />
          </div>
          <div>
            <Label>Serial No *</Label>
            <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={serialNo} onChange={handleSerialChange} required>
              <option value="">-- Select Serial No --</option>
              {filteredIssues.map(t => {
                const mem = typeof t.membershipId === 'string' ? '' : `${t.membershipId.firstName} ${t.membershipId.lastName}`;
                return (
                  <option key={t._id} value={t.serialNo || t.bookId?.serialNo}>
                    {t.serialNo || t.bookId?.serialNo} — {mem}
                  </option>
                );
              })}
            </select>
          </div>
          {selectedTxn && (
            <div><Label>Issue Date</Label>
              <Input readOnly value={selectedTxn.issueDate?.split('T')[0] || ''} className="bg-muted" />
            </div>
          )}
          <div><Label>Return Date</Label>
            <Input type="date" value={actualReturnDate} onChange={e => setActualReturnDate(e.target.value)} />
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
