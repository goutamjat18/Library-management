import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Home, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LibraryNavbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-nav text-nav-foreground px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight">Library Management System</h1>
          {title && <span className="text-xs text-nav-foreground/60">{title}</span>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-nav-foreground/80">
          <User className="w-4 h-4" />
          <span>{user?.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary-foreground/90 font-medium">
            {user?.isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-nav-foreground/70 hover:text-nav-foreground hover:bg-nav-foreground/10"
          onClick={() => navigate(user?.isAdmin ? '/admin' : '/home')}
        >
          <Home className="w-4 h-4 mr-1" /> Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1" /> Logout
        </Button>
      </div>
    </nav>
  );
}
