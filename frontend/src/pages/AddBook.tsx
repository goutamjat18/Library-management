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

const CATEGORIES = ['Science', 'Economics', 'Fiction', 'Children', 'Personal Development'];

export default function AddBook() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'Book', name: '', author: '', category: '',
    cost: '', procurementDate: new Date().toISOString().split('T')[0], copies: 1
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required: (keyof typeof form)[] = ['name', 'author', 'category', 'cost', 'procurementDate'];
    for (const k of required) {
      if (!form[k]) { setError(`All fields are required. Missing: ${k}`); return; }
    }
    setError(''); setLoading(true);
    try {
      const { data } = await axios.post('/api/books', form);
      setSuccess(`${form.type} added! Serial No: ${data.serialNo}`);
      setForm({ type: 'Book', name: '', author: '', category: '', cost: '',
        procurementDate: new Date().toISOString().split('T')[0], copies: 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book/movie.');
    } finally { setLoading(false); }
  };

  return (
    <PageLayout title="Add Book/Movie" sidebar={<LibrarySidebar sections={maintenanceSidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">📚 Add Book / Movie</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        {success && <StatusAlert type="success">{success}</StatusAlert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Type *</Label>
            <div className="flex gap-5 mt-2">
              {['Book', 'Movie'].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" name="type" value={t} checked={form.type === t}
                    onChange={set('type')} className="accent-primary" /> {t}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{form.type} Name *</Label><Input value={form.name} onChange={set('name')} placeholder={`Enter ${form.type.toLowerCase()} name`} /></div>
            <div><Label>Author / Director *</Label><Input value={form.author} onChange={set('author')} placeholder="Author or director name" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={form.category} onChange={set('category')}>
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><Label>Cost (₹) *</Label><Input type="number" min="0" value={form.cost} onChange={set('cost')} placeholder="0" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Date of Procurement *</Label><Input type="date" value={form.procurementDate} onChange={set('procurementDate')} /></div>
            <div><Label>Quantity / Copies</Label><Input type="number" min="1" value={form.copies} onChange={(e) => setForm(f => ({ ...f, copies: Number(e.target.value) }))} /></div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : `Add ${form.type}`}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/maintenance')}>Cancel</Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
