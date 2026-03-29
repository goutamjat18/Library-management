import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import LibrarySidebar from '@/components/LibrarySidebar';
import { Home, UserPlus, RefreshCw, BookPlus, BookCopy, Users } from 'lucide-react';

const sidebarSections = [
  {
    title: 'Maintenance',
    links: [
      { to: '/maintenance', label: 'Overview', icon: Home, end: true },
    ],
  },
  {
    title: 'Membership',
    links: [
      { to: '/maintenance/add-membership', label: 'Add', icon: UserPlus },
      { to: '/maintenance/update-membership', label: 'Update', icon: RefreshCw },
    ],
  },
  {
    title: 'Books / Movies',
    links: [
      { to: '/maintenance/add-book', label: 'Add', icon: BookPlus },
      { to: '/maintenance/update-book', label: 'Update', icon: BookCopy },
    ],
  },
  {
    title: 'Users',
    links: [
      { to: '/maintenance/users', label: 'User Management', icon: Users },
    ],
  },
];

export { sidebarSections as maintenanceSidebarSections };

const menuItems = [
  { icon: UserPlus, label: 'Add Membership', route: '/maintenance/add-membership' },
  { icon: RefreshCw, label: 'Update Membership', route: '/maintenance/update-membership' },
  { icon: BookPlus, label: 'Add Book/Movie', route: '/maintenance/add-book' },
  { icon: BookCopy, label: 'Update Book/Movie', route: '/maintenance/update-book' },
  { icon: Users, label: 'User Management', route: '/maintenance/users' },
];

export default function Maintenance() {
  const navigate = useNavigate();
  return (
    <PageLayout title="Maintenance" sidebar={<LibrarySidebar sections={sidebarSections} />}>
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-1">Maintenance</h2>
        <p className="text-sm text-muted-foreground mb-5">Manage memberships, books, movies, and users</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
