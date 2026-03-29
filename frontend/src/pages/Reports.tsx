import { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '@/components/PageLayout';
import StatusAlert from '@/components/StatusAlert';
import { BookOpen, FileText, Users, ClipboardList, AlertTriangle, Inbox } from 'lucide-react';

const fmt = (d: string) => d ? new Date(d).toLocaleDateString('en-IN') : '—';

const endpointMap: Record<string, string> = {
  books: '/api/reports/books',
  movies: '/api/reports/movies',
  memberships: '/api/reports/memberships',
  'active-issues': '/api/reports/active-issues',
  overdue: '/api/reports/overdue',
  requests: '/api/reports/issue-requests',
};

const reportItems = [
  { key: 'books', label: 'Master List of Books', icon: BookOpen },
  { key: 'movies', label: 'Master List of Movies', icon: FileText },
  { key: 'memberships', label: 'Memberships', icon: Users },
  { key: 'active-issues', label: 'Active Issues', icon: ClipboardList },
  { key: 'overdue', label: 'Overdue Returns', icon: AlertTriangle },
  { key: 'requests', label: 'Issue Requests', icon: Inbox },
];

export default function Reports() {
  const [active, setActive] = useState('books');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(endpointMap[active])
      .then(r => setData(r.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [active]);

  const renderTable = () => {
    if (loading) return <StatusAlert type="info">Loading...</StatusAlert>;
    if (!data.length) return <StatusAlert type="info">No data available.</StatusAlert>;

    if (active === 'books' || active === 'movies') {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-left font-semibold">Serial No</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Author</th>
            <th className="px-4 py-3 text-left font-semibold">Category</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Cost (₹)</th>
            <th className="px-4 py-3 text-left font-semibold">Procurement Date</th>
          </tr></thead>
          <tbody>{data.map((b: any) => (
            <tr key={b._id} className="border-t border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">{b.serialNo}</td>
              <td className="px-4 py-3 font-medium">{b.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{b.author}</td>
              <td className="px-4 py-3">{b.category}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  b.status === 'Available' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning-foreground'
                }`}>{b.status}</span>
              </td>
              <td className="px-4 py-3">₹{b.cost}</td>
              <td className="px-4 py-3">{fmt(b.procurementDate)}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (active === 'memberships') {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-left font-semibold">Membership ID</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Contact</th>
            <th className="px-4 py-3 text-left font-semibold">Start Date</th>
            <th className="px-4 py-3 text-left font-semibold">End Date</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Fine Pending (₹)</th>
          </tr></thead>
          <tbody>{data.map((m: any) => (
            <tr key={m._id} className="border-t border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">{m.membershipId}</td>
              <td className="px-4 py-3 font-medium">{m.firstName} {m.lastName}</td>
              <td className="px-4 py-3">{m.contactNumber}</td>
              <td className="px-4 py-3">{fmt(m.startDate)}</td>
              <td className="px-4 py-3">{fmt(m.endDate)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                  m.status === 'Active' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>{m.status}</span>
              </td>
              <td className="px-4 py-3">₹{m.amountPending}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (active === 'active-issues') {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-left font-semibold">Serial No</th>
            <th className="px-4 py-3 text-left font-semibold">Book/Movie</th>
            <th className="px-4 py-3 text-left font-semibold">Membership ID</th>
            <th className="px-4 py-3 text-left font-semibold">Member Name</th>
            <th className="px-4 py-3 text-left font-semibold">Issue Date</th>
            <th className="px-4 py-3 text-left font-semibold">Return Date</th>
          </tr></thead>
          <tbody>{data.map((t: any) => (
            <tr key={t._id} className="border-t border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">{t.bookId?.serialNo}</td>
              <td className="px-4 py-3 font-medium">{t.bookId?.name}</td>
              <td className="px-4 py-3 font-mono text-xs">{t.membershipId?.membershipId}</td>
              <td className="px-4 py-3">{t.membershipId?.firstName} {t.membershipId?.lastName}</td>
              <td className="px-4 py-3">{fmt(t.issueDate)}</td>
              <td className="px-4 py-3">{fmt(t.returnDate)}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (active === 'overdue') {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-primary text-primary-foreground">
            <th className="px-4 py-3 text-left font-semibold">Serial No</th>
            <th className="px-4 py-3 text-left font-semibold">Book Name</th>
            <th className="px-4 py-3 text-left font-semibold">Membership ID</th>
            <th className="px-4 py-3 text-left font-semibold">Issue Date</th>
            <th className="px-4 py-3 text-left font-semibold">Due Date</th>
            <th className="px-4 py-3 text-left font-semibold">Fine (₹)</th>
          </tr></thead>
          <tbody>{data.map((t: any) => (
            <tr key={t._id} className="border-t border-border hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs">{t.bookId?.serialNo}</td>
              <td className="px-4 py-3 font-medium">{t.bookId?.name}</td>
              <td className="px-4 py-3 font-mono text-xs">{t.membershipId?.membershipId}</td>
              <td className="px-4 py-3">{fmt(t.issueDate)}</td>
              <td className="px-4 py-3 text-destructive font-semibold">{fmt(t.returnDate)}</td>
              <td className="px-4 py-3 text-destructive font-semibold">₹{t.fineCalculated}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    return (
      <table className="w-full text-sm">
        <thead><tr className="bg-primary text-primary-foreground">
          <th className="px-4 py-3 text-left font-semibold">Membership ID</th>
          <th className="px-4 py-3 text-left font-semibold">Book/Movie</th>
          <th className="px-4 py-3 text-left font-semibold">Requested Date</th>
          <th className="px-4 py-3 text-left font-semibold">Fulfilled Date</th>
        </tr></thead>
        <tbody>{data.map((t: any) => (
          <tr key={t._id} className="border-t border-border hover:bg-muted/50 transition-colors">
            <td className="px-4 py-3 font-mono text-xs">{t.membershipId?.membershipId}</td>
            <td className="px-4 py-3 font-medium">{t.bookId?.name}</td>
            <td className="px-4 py-3">{fmt(t.requestedDate)}</td>
            <td className="px-4 py-3">{fmt(t.requestFulfilledDate)}</td>
          </tr>
        ))}</tbody>
      </table>
    );
  };

  return (
    <PageLayout title="Reports">
      <div className="flex gap-6 items-start">
        <aside className="w-56 shrink-0">
          <div className="glass-card p-4 sticky top-4">
            <h3 className="text-[0.68rem] uppercase tracking-widest text-muted-foreground font-semibold mb-2 px-3">Reports</h3>
            <div className="space-y-0.5">
              {reportItems.map((item) => (
                <button key={item.key} onClick={() => setActive(item.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                    active === item.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}>
                  <item.icon className="w-4 h-4" />{item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {reportItems.find((r) => r.key === active)?.label}
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              {renderTable()}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
