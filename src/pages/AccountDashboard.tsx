import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShoppingCart01Icon,
  User03Icon,
  Logout01Icon,
  Package01Icon,
  ArrowRight01Icon,
  Loading01Icon,
  InboxIcon,
} from '@hugeicons/core-free-icons';
import webiroLogo from '@/assets/logo-webiro.svg';
import { updatePageMeta } from '@/utils/seo';

interface Order {
  id: string;
  order_number: string | null;
  pakket: string | null;
  status: string | null;
  totaal: number | null;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  nieuw: { label: 'Nieuw', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_behandeling: { label: 'In behandeling', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  afgerond: { label: 'Afgerond', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  geannuleerd: { label: 'Geannuleerd', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const AccountDashboard = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null; email: string | null } | null>(null);

  useEffect(() => {
    updatePageMeta('Mijn Account | Webiro', 'Bekijk je bestellingen en beheer je account.');
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/account/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
      setProfile(profileData);

      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, pakket, status, totaal, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders((ordersData as Order[]) || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center pt-[60px]">
        <HugeiconsIcon icon={Loading01Icon} size={32} className="text-primary animate-spin" />
      </main>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Klant';

  return (
    <main className="min-h-screen bg-background pt-[60px]">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-10 pb-8 border-b border-border">
          <div>
            <p className="text-sm font-medium text-primary tracking-wide uppercase mb-2">Mijn account</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Hallo, {displayName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
            <HugeiconsIcon icon={Logout01Icon} size={14} />
            Uitloggen
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <Card className="p-5 border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={ShoppingCart01Icon} size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
            <p className="text-xs text-muted-foreground">Bestellingen</p>
          </Card>
          <Card className="p-5 border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={Package01Icon} size={16} className="text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {orders.filter(o => o.status === 'in_behandeling').length}
            </p>
            <p className="text-xs text-muted-foreground">In behandeling</p>
          </Card>
          <Card className="p-5 border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <HugeiconsIcon icon={Package01Icon} size={16} className="text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {orders.filter(o => o.status === 'afgerond').length}
            </p>
            <p className="text-xs text-muted-foreground">Afgerond</p>
          </Card>
        </div>

        {/* Orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">Bestellingen</h2>
            <Link
              to="/pakketten"
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Nieuw project starten <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <HugeiconsIcon icon={Loading01Icon} size={24} className="text-muted-foreground animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 border-border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center mb-4">
                <HugeiconsIcon icon={InboxIcon} size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Nog geen bestellingen</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-sm">
                Zodra je een pakket bestelt via onze configurator, verschijnt het hier.
              </p>
              <Link to="/pakketten">
                <Button className="gap-2">
                  Bekijk pakketten <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const status = statusLabels[order.status || 'nieuw'] || statusLabels.nieuw;
                return (
                  <Card
                    key={order.id}
                    className="p-5 border-border hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                          <HugeiconsIcon icon={Package01Icon} size={18} className="text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {order.order_number || 'Bestelling'}
                            </p>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.pakket || 'Website pakket'} · {new Date(order.created_at).toLocaleDateString('nl-NL', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          €{order.totaal?.toLocaleString('nl-NL', { minimumFractionDigits: 2 }) || '0,00'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">incl. BTW</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AccountDashboard;
