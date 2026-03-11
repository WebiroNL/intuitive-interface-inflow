import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockPasswordIcon, ArrowRight01Icon, Alert02Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import { Link } from 'react-router-dom';

const AccountResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for recovery token in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      // No recovery token, redirect
      navigate('/account/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/account'), 2000);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 pt-[60px]">
      <div className="w-full max-w-sm py-16">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={webiroLogo} alt="Webiro" className="h-7 mx-auto mb-6" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Nieuw wachtwoord instellen</h1>
          <p className="text-sm text-muted-foreground mt-1">Kies een nieuw wachtwoord voor je account</p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-primary/10 text-primary text-sm text-center">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={32} />
            <p className="font-medium">Wachtwoord succesvol gewijzigd!</p>
            <p className="text-muted-foreground">Je wordt doorgestuurd...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <HugeiconsIcon icon={Alert02Icon} size={16} />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nieuw wachtwoord</label>
              <div className="relative">
                <HugeiconsIcon icon={LockPasswordIcon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Bevestig wachtwoord</label>
              <div className="relative">
                <HugeiconsIcon icon={LockPasswordIcon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Even geduld...' : (
                <>Wachtwoord opslaan <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" /></>
              )}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AccountResetPassword;
