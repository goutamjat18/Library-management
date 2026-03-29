import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
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

const menuItems = [
  { icon: Search, label: 'Is book available?', route: '/transactions/available' },
  { icon: BookOpen, label: 'Issue book', route: '/transactions/issue' },
  { icon: Undo2, label: 'Return book', route: '/transactions/return' },
  { icon: Coins, label: 'Pay Fine', route: '/transactions/fine' },
];

export default function Transactions() {
  const navigate = useNavigate();
  return (
    <PageLayout title="Transactions" sidebar={<LibrarySidebar sections={sidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-1">Transactions</h2>
        <p className="text-sm text-muted-foreground mb-5">Select a transaction type to get started</p>
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="rounded-xl p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <item.icon className="w-7 h-7 text-primary-foreground/80 mb-2" />
              <div className="text-sm font-bold text-primary-foreground">{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
