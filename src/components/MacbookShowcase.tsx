import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, LockIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export interface ShowcaseItem {
  title: string;
  cat: string;
  url: string;
  services: string[];
  desc: string;
  tint?: string;
}

interface MacbookShowcaseProps {
  items: ShowcaseItem[];
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function screenshotUrl(url: string) {
  // Free WordPress mShots screenshot service.
  const clean = encodeURIComponent(url);
  return `https://s.wordpress.com/mshots/v1/${clean}?w=1200&h=750`;
}

function ProjectCard({ item }: { item: ShowcaseItem }) {
  const tint = item.tint ?? "234,82%,57%";
  const host = getHostname(item.url);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col h-full rounded-3xl border border-border/60 bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      style={{ ["--tint" as any]: tint }}
    >
      {/* Tinted hover border glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 0 1px hsla(${tint}, 0.4)` }}
      />

      {/* Content top */}
      <div className="relative p-7 pb-6 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-5">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.12em]"
            style={{
              color: `hsl(${tint})`,
              backgroundColor: `hsla(${tint}, 0.08)`,
              borderColor: `hsla(${tint}, 0.22)`,
            }}
          >
            {item.cat}
          </span>
          <span
            className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full border border-border/60 bg-background/60 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors"
            aria-hidden
          >
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        <h3 className="text-xl md:text-[22px] font-bold text-foreground leading-tight mb-2.5">
          {item.title}
        </h3>
        <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-5 line-clamp-3">
          {item.desc}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {item.services.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 bg-muted/60 border border-border/60 rounded text-[10px] font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Browser mockup bottom */}
      <div className="relative mt-auto px-5 pb-5">
        <div
          className="relative rounded-xl overflow-hidden border border-border/60 bg-background shadow-[0_18px_40px_-22px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-1"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-3 h-7 border-b border-border/60 bg-muted/50">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
              <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
              <span className="w-2 h-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-1.5 h-4 px-2 rounded bg-background/80 border border-border/60 max-w-[220px] mx-auto">
              <HugeiconsIcon icon={LockIcon} className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground truncate font-mono">{host}</span>
            </div>
            <div className="w-[36px]" aria-hidden />
          </div>

          {/* Screenshot */}
          <div
            className="relative w-full overflow-hidden bg-muted"
            style={{ aspectRatio: "16 / 10" }}
          >
            <div
              aria-hidden
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, hsla(${tint}, 0.18), transparent 60%)`,
              }}
            />
            <img
              src={screenshotUrl(item.url)}
              alt={`Screenshot van ${item.title}`}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </a>
  );
}

export function MacbookShowcase({ items }: MacbookShowcaseProps) {
  if (!items.length) return null;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {items.map((item) => (
          <ProjectCard key={item.title + item.url} item={item} />
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Benieuwd naar meer? We laten graag het volledige portfolio zien tijdens een kennismaking.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:gap-2.5 transition-all"
        >
          Plan een kennismaking
          <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export default MacbookShowcase;
