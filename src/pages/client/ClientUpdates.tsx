import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon, Settings01Icon, ChartBarLineIcon, Notification02Icon } from "@hugeicons/core-free-icons";

interface Props { client: Client }
interface Activity {
  id: string; type: string; title: string; description: string | null; occurred_at: string;
}

const ICONS: Record<string, any> = {
  launch: Rocket01Icon,
  optimization: Settings01Icon,
  performance: ChartBarLineIcon,
  update: Notification02Icon,
};

const COLORS: Record<string, string> = {
  launch: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  optimization: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  performance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  update: "bg-muted text-muted-foreground",
};

export default function ClientUpdates({ client }: Props) {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .eq("client_id", client.id)
        .order("occurred_at", { ascending: false });
      setItems((data as Activity[]) ?? []);
      setLoading(false);
    })();
  }, [client.id]);

  return (
    <div className="p-6 lg:p-8 max-w-[900px]">
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Updates</p>
        <h1 className="text-2xl font-semibold text-foreground">Activiteit</h1>
        <p className="text-sm text-muted-foreground mt-1">Wat Webiro voor je gedaan heeft</p>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="h-20 bg-muted/40 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">Nog geen updates.</div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {items.map((a) => {
              const Icon = ICONS[a.type] ?? Notification02Icon;
              return (
                <div key={a.id} className="relative pl-12">
                  <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center ${COLORS[a.type] ?? COLORS.update}`}>
                    <HugeiconsIcon icon={Icon} size={16} />
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <p className="text-[12px] text-muted-foreground whitespace-nowrap">
                        {new Date(a.occurred_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
