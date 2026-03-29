import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
import StatusAlert from '@/components/StatusAlert';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, BookOpen, Undo2, Coins } from 'lucide-react';

const sidebarSections = [
  {
    title: 'Transactions',
    links: [
      { to: '/transactions/available', label: 'Book Available?', icon: Search },
      { to: '/transactions/issue', label: 'Issue Book', icon: BookOpen },
      { to: '/transactions/return', label: 'Return Book', icon: Undo2 },
      { to: '/transactions/fine', label: 'Pay Fine', icon: Coins },
    ],
  },
];

interface Book {
  _id: string;
  name: string;
  author: string;
  serialNo?: string;
  available: boolean;
}

export default function BookAvailable() {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState<Book[] | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/books').then(r => setAllBooks(r.data)).catch(() => {});
  }, []);

  const bookNames = [...new Set(allBooks.map(b => b.name))];
  const authors = [...new Set(allBooks.map(b => b.author))];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName && !author) { setError('Please select a book name or author before searching.'); return; }
    setError(''); setResults(null);
    try {
      const params: Record<string, string> = {};
      if (bookName) params.name = bookName;
      if (author) params.author = author;
      const { data } = await axios.get('/api/transactions/availability', { params });
      setResults(data);
    } catch {
      setError('Error searching for books.');
    }
  };

  const handleIssue = (book: Book) => {
    navigate('/transactions/issue', { state: { book } });
  };

  return (
    <PageLayout title="Book Availability" sidebar={<LibrarySidebar sections={sidebarSections} />}>
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-foreground mb-4">📚 Book Availability</h2>
        {error && <StatusAlert type="error">{error}</StatusAlert>}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Book Name</Label>
              <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={bookName} onChange={(e) => setBookName(e.target.value)}>
                <option value="">-- Select Book --</option>
                {bookNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <Label>Author</Label>
              <select className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={author} onChange={(e) => setAuthor(e.target.value)}>
                <option value="">-- Select Author --</option>
                {authors.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit"><Search className="w-4 h-4 mr-2" /> Search</Button>
        </form>
      </div>

      {results !== null && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Search Results</h2>
          {results.length === 0 ? (
            <StatusAlert type="info">No books found matching your criteria.</StatusAlert>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-3 text-left font-semibold">Book Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Author</th>
                    <th className="px-4 py-3 text-left font-semibold">Serial No</th>
                    <th className="px-4 py-3 text-left font-semibold">Available</th>
                    <th className="px-4 py-3 text-left font-semibold">Select to Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((book) => (
                    <tr key={book._id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{book.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{book.author}</td>
                      <td className="px-4 py-3 font-mono text-xs">{book.serialNo || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          book.available ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {book.available ? 'Y' : 'N'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {book.available && (
                          <input type="radio" name="selectedBook" onChange={() => setSelectedBook(book)} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {selectedBook && (
            <div className="flex gap-3 mt-4">
              <Button onClick={() => handleIssue(selectedBook)}>Proceed to Issue Book</Button>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
