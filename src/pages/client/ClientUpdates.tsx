import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Rocket01Icon, Settings01Icon, ChartBarLineIcon, Notification02Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const LABELS: Record<string, string> = {
  launch: "Launch",
  optimization: "Optimalisatie",
  performance: "Performance",
  update: "Update",
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
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
      {loading ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i) => <div key={i} className="h-20 bg-muted/40 rounded-lg animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">Nog geen updates.</div>
      ) : (
        <div className="relative">
          {/* Centered vertical line — starts at first icon center, ends at last icon center */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-px bg-border"
               style={{ top: "1.25rem", bottom: "1.25rem" }} />

          <div className="space-y-8 lg:space-y-12">
            {items.map((a, idx) => {
              const Icon = ICONS[a.type] ?? Notification02Icon;
              const isLeft = idx % 2 === 0;
              const colorClass = COLORS[a.type] ?? COLORS.update;
              const label = LABELS[a.type] ?? "Update";

              const card = (
                <div className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-medium border-0", colorClass)}>
                      {label}
                    </Badge>
                    <p className="text-[12px] text-muted-foreground ml-auto whitespace-nowrap">
                      {new Date(a.occurred_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{a.title}</p>
                  {a.description && <p className="text-sm text-muted-foreground">{a.description}</p>}
                </div>
              );

              return (
                <div key={a.id} className="relative">
                  {/* Mobile layout */}
                  <div className="lg:hidden relative pl-12">
                    <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                      <HugeiconsIcon icon={Icon} size={16} />
                    </div>
                    {card}
                  </div>

                  {/* Desktop alternating layout */}
                  <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                    <div className={isLeft ? "" : "invisible"}>{isLeft && card}</div>
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-background ${colorClass}`}>
                      <HugeiconsIcon icon={Icon} size={16} />
                    </div>
                    <div className={!isLeft ? "" : "invisible"}>{!isLeft && card}</div>
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
