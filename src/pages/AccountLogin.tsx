import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon, LockPasswordIcon, ArrowRight01Icon, Alert02Icon, UserAdd01Icon } from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import { updatePageMeta } from '@/utils/seo';
import { useEffect } from 'react';

type Mode = 'login' | 'register' | 'forgot';

const AccountLogin = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [naam, setNaam] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    updatePageMeta(
      'Inloggen | Webiro',
      'Log in op je Webiro account om je bestellingen te bekijken en je profiel te beheren.'
    );
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/account');
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError('Ongeldige inloggegevens. Probeer het opnieuw.');
    } else {
      navigate('/account');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: naam },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Check je e-mail om je account te bevestigen.');
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('We hebben je een link gestuurd om je wachtwoord te resetten.');
    }
    setLoading(false);
  };

  const titles = {
    login: { h: 'Welkom terug', sub: 'Log in op je account' },
    register: { h: 'Account aanmaken', sub: 'Maak een gratis account aan' },
    forgot: { h: 'Wachtwoord vergeten', sub: 'Ontvang een reset-link per e-mail' },
  };

  const onSubmit = mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgot;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 pt-[60px]">
      <div className="w-full max-w-sm py-16">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={webiroLogo} alt="Webiro" className="h-7 mx-auto mb-6" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">{titles[mode].h}</h1>
          <p className="text-sm text-muted-foreground mt-1">{titles[mode].sub}</p>
        </div>

        {success ? (
          <div className="p-4 rounded-lg bg-primary/10 text-primary text-sm text-center">
            {success}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <HugeiconsIcon icon={Alert02Icon} size={16} />
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Naam</label>
                <div className="relative">
                  <HugeiconsIcon icon={UserAdd01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    placeholder="Je volledige naam"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">E-mailadres</label>
              <div className="relative">
                <HugeiconsIcon icon={Mail01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="naam@voorbeeld.nl"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Wachtwoord</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); }}
                      className="text-xs text-primary hover:underline"
                    >
                      Vergeten?
                    </button>
                  )}
                </div>
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
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Even geduld...' : (
                <>
                  {mode === 'login' && 'Inloggen'}
                  {mode === 'register' && 'Account aanmaken'}
                  {mode === 'forgot' && 'Reset-link versturen'}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1" />
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === 'login' ? (
            <>
              Nog geen account?{' '}
              <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} className="text-primary font-medium hover:underline">
                Registreer je
              </button>
            </>
          ) : (
            <>
              Al een account?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-primary font-medium hover:underline">
                Inloggen
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default AccountLogin;
