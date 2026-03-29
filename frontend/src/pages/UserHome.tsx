import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { BarChart3, ArrowLeftRight } from 'lucide-react';

const CATEGORIES = [
  { from: 'SC(B/M)000001', to: 'SC(B/M)000004', cat: 'Science' },
  { from: 'EC(B/M)000001', to: 'EC(B/M)000004', cat: 'Economics' },
  { from: 'FC(B/M)000001', to: 'FC(B/M)000004', cat: 'Fiction' },
  { from: 'CH(B/M)000001', to: 'CH(B/M)000004', cat: 'Children' },
  { from: 'PD(B/M)000001', to: 'PD(B/M)000004', cat: 'Personal Development' },
];

export default function UserHome() {
  const navigate = useNavigate();
  return (
    <PageLayout title="Home">
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-bold text-foreground mb-1">Welcome to the Library</h2>
        <p className="text-sm text-muted-foreground mb-5">Browse reports and manage your transactions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: BarChart3, label: 'Reports', route: '/reports', desc: 'View library data & analytics' },
            { icon: ArrowLeftRight, label: 'Transactions', route: '/transactions', desc: 'Issue, return & check books' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="group rounded-xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <item.icon className="w-8 h-8 text-primary-foreground/80 mb-3" />
              <div className="text-base font-bold text-primary-foreground">{item.label}</div>
              <div className="text-xs text-primary-foreground/60 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Product Code Reference</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left font-semibold">Code No From</th>
                <th className="px-4 py-3 text-left font-semibold">Code No To</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((c, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{c.from}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.to}</td>
                  <td className="px-4 py-3">{c.cat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
