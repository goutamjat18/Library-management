import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
import StatusAlert from '@/components/StatusAlert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maintenanceSidebarSections } from './Maintenance';

const STATUSES = ['Available', 'Issued', 'Damaged', 'Lost'];

interface BookItem { _id: string; name: string; author: string; serialNo?: string; status: string; type: string; }

export default function UpdateBook() {
  const navigate = useNavigate();
  const [type, setType] = useState('Book');
  const [books, setBooks] = useState<BookItem[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [serialNo, setSerialNo] = useState('');
  const [status, setStatus] = useState('Available');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/books?type=${type}`).then(r => setBooks(r.data)).catch(() => {});
    setSelectedName(''); setSelectedBook(null); setSerialNo('');
  }, [type]);

  const names = [...new Set(books.map(b => b.name))];

  const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedName(e.target.value);
    const book = books.find(b => b.name === e.target.value);
    if (book) { setSelectedBook(book); setSerialNo(book.serialNo || ''); setStatus(book.status); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) { setError('All fields are required.'); return; }
    setError(''); setLoading(true);
    try {
      await axios.put(`/api/books/${selectedBook._id}`, { status, date });
      setSuccess('Book/Movie updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout title="Update Book/Movie" sidebar={<LibrarySidebar sections={maintenanceSidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">🔄 Update Book / Movie</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        {success && <StatusAlert type="success">{success}</StatusAlert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Type *</Label>
            <div className="flex gap-5 mt-2">
              {['Book', 'Movie'].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" name="type" value={t} checked={type === t}
                    onChange={() => setType(t)} className="accent-primary" /> {t}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{type} Name *</Label>
              <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={selectedName} onChange={handleNameChange}>
                <option value="">-- Select {type} --</option>
                {names.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div><Label>Serial No</Label><Input readOnly value={serialNo} placeholder="Auto-populated" className="bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status *</Label>
              <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/maintenance')}>Cancel</Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
