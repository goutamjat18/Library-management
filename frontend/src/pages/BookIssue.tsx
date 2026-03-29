import { useState, useEffect } from 'react';
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

interface BookItem { _id: string; name: string; author: string; type: string; status: string; }
interface MembershipItem { _id: string; membershipId: string; firstName: string; lastName: string; status: string; }

export default function BookIssue() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [books, setBooks] = useState<BookItem[]>([]);
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [selectedBook, setSelectedBook] = useState(state?.book?._id || '');
  const [authorName, setAuthorName] = useState(state?.book?.author || '');
  const [membershipId, setMembershipId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/books?status=Available').then(r => setBooks(r.data)).catch(() => {});
    axios.get('/api/memberships').then(r => setMemberships(r.data.filter((m: MembershipItem) => m.status === 'Active'))).catch(() => {});
  }, []);

  useEffect(() => {
    if (issueDate) {
      const d = new Date(issueDate);
      d.setDate(d.getDate() + 15);
      setReturnDate(d.toISOString().split('T')[0]);
    }
  }, [issueDate]);

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedBook(id);
    const book = books.find(b => b._id === id);
    setAuthorName(book ? book.author : '');
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    const max = new Date(issueDate); max.setDate(max.getDate() + 15);
    if (d > max) { setError('Return date cannot be more than 15 days from issue date.'); return; }
    setError('');
    setReturnDate(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) { setError('Please select a book name.'); return; }
    if (!membershipId) { setError('Please select a membership.'); return; }
    const today = new Date().toISOString().split('T')[0];
    if (issueDate < today) { setError('Issue date cannot be before today.'); return; }
    setError(''); setLoading(true);
    try {
      await axios.post('/api/transactions/issue', { bookId: selectedBook, membershipId, issueDate, returnDate, remarks });
      navigate('/transactions', { state: { success: 'Book issued successfully!' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to issue book.');
    } finally { setLoading(false); }
  };

  const availableBooks = books.filter(b => b.status === 'Available');

  return (
    <PageLayout title="Issue Book" sidebar={<LibrarySidebar sections={sidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">📖 Issue Book</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Book Name *</Label>
            <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={selectedBook} onChange={handleBookChange} required>
              <option value="">-- Select Book --</option>
              {availableBooks.map(b => (
                <option key={b._id} value={b._id}>{b.name} ({b.type})</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Author Name</Label>
            <Input readOnly value={authorName} placeholder="Auto-populated" className="bg-muted" />
          </div>
          <div>
            <Label>Membership *</Label>
            <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={membershipId} onChange={e => setMembershipId(e.target.value)} required>
              <option value="">-- Select Member --</option>
              {memberships.map(m => (
                <option key={m._id} value={m._id}>{m.membershipId} — {m.firstName} {m.lastName}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Issue Date *</Label>
              <Input type="date" value={issueDate} min={new Date().toISOString().split('T')[0]}
                onChange={e => setIssueDate(e.target.value)} required />
            </div>
            <div><Label>Return Date (max 15 days) *</Label>
              <Input type="date" value={returnDate} onChange={handleReturnDateChange} required />
            </div>
          </div>
          <div>
            <Label>Remarks (Optional)</Label>
            <textarea className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
              value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Confirm Issue'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/transactions')}>Cancel</Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
