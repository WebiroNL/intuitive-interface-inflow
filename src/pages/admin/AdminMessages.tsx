import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from "@hugeicons/react";
import { MessageMultiple01Icon, Settings02Icon } from "@hugeicons/core-free-icons";

const AdminMessages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Berichten</h1>
        <p className="text-sm text-muted-foreground mt-1">Livechat gesprekken en berichten van klanten</p>
      </div>

      <Card className="border border-border p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
          <HugeiconsIcon icon={MessageMultiple01Icon} size={32} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Livechat komt binnenkort</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          We werken aan een realtime livechat integratie waarmee je direct met bezoekers en klanten kunt communiceren.
        </p>
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <HugeiconsIcon icon={HammerIcon} size={14} />
          In ontwikkeling
        </div>
      </Card>
    </div>
  );
};

export default AdminMessages;
