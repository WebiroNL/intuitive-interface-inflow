import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings01Icon, ShieldKeyIcon, Notification01Icon } from "@hugeicons/core-free-icons";

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Instellingen</h1>
        <p className="text-sm text-muted-foreground mt-1">Account- en systeeminstellingen</p>
      </div>

      <div className="grid gap-4 max-w-2xl">
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
