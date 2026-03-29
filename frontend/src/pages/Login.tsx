import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusAlert from '@/components/StatusAlert';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Please enter username and password.'); return; }
    setLoading(true); setError('');
    try {
      const user = await login(username, password);
      navigate(user.isAdmin ? '/admin' : '/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">Library Management</h1>
          <p className="text-primary-foreground/50 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          {error && <StatusAlert type="error">{error}</StatusAlert>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">User ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your user ID" className="pl-10" autoFocus />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" className="pl-10" />
              </div>
            </div>
            <Button className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
          <p className="text-center mt-6 text-xs text-muted-foreground">
            Admin: adm / adm &nbsp;·&nbsp; User: user / user
          </p>
        </div>
      </div>
    </div>
  );
}
