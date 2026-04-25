import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, ShieldKeyIcon, Notification01Icon, CodeIcon, Share08Icon } from "@hugeicons/core-free-icons";

const VERSION_KEYS = [
  { key: 'partner_dashboard_version', label: 'Partner Dashboard versie' },
  { key: 'client_dashboard_version', label: 'Client Dashboard versie' },
];

const SOCIAL_KEYS = [
  { key: 'social_facebook_url', label: 'Facebook URL', placeholder: 'https://www.facebook.com/webironl/' },
  { key: 'social_instagram_url', label: 'Instagram URL', placeholder: 'https://www.instagram.com/webiro.nl' },
  { key: 'social_linkedin_url', label: 'LinkedIn URL', placeholder: 'https://www.linkedin.com/company/webironl/' },
  { key: 'social_whatsapp_url', label: 'WhatsApp URL', placeholder: 'https://wa.me/31855055054' },
  { key: 'social_email_url', label: 'E-mail (mailto:)', placeholder: 'mailto:info@webiro.nl' },
];

const AdminSettings = () => {
  const { user } = useAuth();
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [socials, setSocials] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const allKeys = [...VERSION_KEYS.map((v) => v.key), ...SOCIAL_KEYS.map((s) => s.key)];
      const { data } = await supabase
        .from('app_settings')
        .select('key, value')
        .in('key', allKeys);
      const vMap: Record<string, string> = {};
      const sMap: Record<string, string> = {};
      (data ?? []).forEach((row) => {
        if (VERSION_KEYS.some((v) => v.key === row.key)) vMap[row.key] = row.value ?? '';
        if (SOCIAL_KEYS.some((s) => s.key === row.key)) sMap[row.key] = row.value ?? '';
      });
      setVersions(vMap);
      setSocials(sMap);
      setLoading(false);
    };
    load();
  }, []);

  const saveVersion = async (key: string) => {
    setSaving(key);
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value: versions[key] ?? '', updated_by: user?.id ?? null }, { onConflict: 'key' });
    setSaving(null);
    if (error) {
      toast.error('Opslaan mislukt: ' + error.message);
    } else {
      toast.success('Versie opgeslagen');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Settings01Icon} size={18} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Account</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">E-mailadres</span>
              <span className="font-medium text-foreground">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Rol</span>
              <span className="font-medium text-foreground">Administrator</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Lid sinds</span>
              <span className="font-medium text-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('nl-NL') : '—'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={CodeIcon} size={18} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Dashboard versies</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Versienummers die getoond worden onderaan de Partner- en Client-sidebar.
          </p>
          <div className="space-y-4">
            {VERSION_KEYS.map(({ key, label }) => (
              <div key={key} className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor={key} className="text-xs text-muted-foreground">{label}</Label>
                  <Input
                    id={key}
                    value={versions[key] ?? ''}
                    placeholder="1.0.0"
                    disabled={loading}
                    onChange={(e) => setVersions((v) => ({ ...v, [key]: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => saveVersion(key)}
                  disabled={loading || saving === key}
                >
                  {saving === key ? 'Opslaan...' : 'Opslaan'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={ShieldKeyIcon} size={18} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Beveiliging</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Wachtwoord wijzigen en twee-factor authenticatie worden binnenkort ondersteund.
          </p>
        </Card>

        <Card className="border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={Notification01Icon} size={18} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Notificaties</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            E-mailnotificaties voor nieuwe leads en orders worden binnenkort toegevoegd.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
