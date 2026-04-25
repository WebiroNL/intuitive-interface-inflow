import { useEffect, useState } from "react";
import type { Client } from "@/hooks/useClient";
import { supabase } from "@/integrations/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon, VideoReplayIcon, File02Icon, Download01Icon } from "@hugeicons/core-free-icons";

interface Props { client: Client }
interface FileItem {
  id: string; category: string; name: string; file_url: string;
  file_size: number | null; mime_type: string | null; created_at: string;
}

export default function ClientFiles({ client }: Props) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("client_files")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false });
      setFiles((data as FileItem[]) ?? []);
      setLoading(false);
    })();
  }, [client.id]);

  const filtered = tab === "all" ? files : files.filter((f) => f.category === tab);

  const iconFor = (cat: string, mime: string | null) => {
    if (cat === "video" || mime?.startsWith("video/")) return VideoReplayIcon;
    if (cat === "creative" || mime?.startsWith("image/")) return Image01Icon;
    return File02Icon;
  };

  const tabs = [
    { key: "all", label: "Alle" },
    { key: "creative", label: "Creatives" },
    { key: "video", label: "Video's" },
    { key: "document", label: "Documenten" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({length:6}).map((_,i) => <div key={i} className="aspect-square bg-muted/40 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">Nog geen bestanden.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((f) => (
            <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer"
               className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
              <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
                {f.mime_type?.startsWith("image/") ? (
                  <img src={f.file_url} alt={f.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <HugeiconsIcon icon={iconFor(f.category, f.mime_type)} size={36} className="text-muted-foreground" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur rounded p-1.5">
                  <HugeiconsIcon icon={Download01Icon} size={14} />
                </div>
              </div>
              <div className="p-3">
                <p className="text-[13px] font-medium text-foreground truncate">{f.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(f.created_at).toLocaleDateString("nl-NL")}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
