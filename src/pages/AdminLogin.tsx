import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Alert02Icon } from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import webiroLogoDark from '@/assets/logo-webiro-dark.svg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError('Ongeldige inloggegevens. Probeer het opnieuw.');
      setLoading(false);
      return;
    }

    navigate('/admin');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={webiroLogo} alt="Webiro" className="h-7 mx-auto mb-6 block dark:hidden" />
          <img src={webiroLogoDark} alt="Webiro" className="h-7 mx-auto mb-6 hidden dark:block" />
          <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Log in om verder te gaan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <HugeiconsIcon icon={Alert02Icon} size={16} />
              {error}
            </div>
          )}

          <FloatingInput
            type="email"
            label="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <FloatingInput
            type="password"
            label="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            showPasswordToggle
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Inloggen...' : (
              <>Inloggen <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
