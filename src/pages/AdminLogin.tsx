import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { Checkbox } from '@/components/ui/checkbox';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Alert02Icon } from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import webiroLogoDark from '@/assets/logo-webiro-dark.svg';

const REMEMBER_KEY = 'webiro_admin_remember';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REMEMBER_KEY);
      if (raw) {
        const data = JSON.parse(atob(raw));
        if (data.email) setEmail(data.email);
        if (data.password) setPassword(data.password);
        setRemember(true);
      }
    } catch {
      // ignore
    }
  }, []);

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

    if (remember) {
      try {
        localStorage.setItem(REMEMBER_KEY, btoa(JSON.stringify({ email, password })));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem(REMEMBER_KEY);
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

          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none py-1">
            <Checkbox
              checked={remember}
              onCheckedChange={(v) => setRemember(v === true)}
            />
            Onthoud mijn inloggegevens
          </label>

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
