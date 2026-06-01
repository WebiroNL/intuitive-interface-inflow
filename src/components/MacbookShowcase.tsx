import { useRef, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, LockIcon } from "@hugeicons/core-free-icons";
import { LazyIframe } from "@/components/LazyIframe";

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

const DESKTOP_W = 1440;
const DESKTOP_H = 900;

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function BrowserPreview({ url, title }: { url: string; title: string }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const calc = () => setScale(el.clientWidth / DESKTOP_W);
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border/60 bg-card shadow-[0_20px_40px_-25px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2 px-2.5 h-7 border-b border-border/60 bg-muted/40">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="w-2 h-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 h-4 px-2 rounded bg-background/80 border border-border/60 max-w-[220px] mx-auto">
          <HugeiconsIcon icon={LockIcon} className="h-2.5 w-2.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground truncate font-mono">
            {getHostname(url)}
          </span>
        </div>
        <div className="w-[36px]" aria-hidden />
      </div>
      <div
        ref={screenRef}
        className="relative w-full overflow-hidden bg-white"
        style={{ aspectRatio: "16 / 10" }}
      >
        <div
          style={{
            width: DESKTOP_W,
            height: DESKTOP_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <LazyIframe src={url} title={title} className="w-full h-full" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

type Variant = "feature" | "compact" | "split";

function ProjectCard({ item, layout }: { item: ShowcaseItem; layout: Variant }) {
  const tint = item.tint ?? "234,82%,57%";

  const Header = (
    <div>
      <div
        className="inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.12em] mb-5"
        style={{
          color: `hsl(${tint})`,
          backgroundColor: `hsla(${tint}, 0.06)`,
          borderColor: `hsla(${tint}, 0.2)`,
        }}
      >
        {item.cat}
      </div>
      <h3
        className={`font-bold text-foreground mb-3 leading-tight ${
          layout === "feature" ? "text-2xl md:text-3xl" : "text-xl"
        }`}
      >
        {item.title}
      </h3>
      <p
        className={`text-muted-foreground leading-relaxed ${
          layout === "feature" ? "text-[15px] mb-6" : "text-[13px] mb-5"
        }`}
      >
        {item.desc}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-6">
        {item.services.slice(0, layout === "feature" ? 4 : 3).map((s) => (
          <span
            key={s}
            className="px-2 py-1 bg-muted/60 border border-border/60 rounded text-[10px] font-semibold text-muted-foreground uppercase tracking-wide"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  const Cta = (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-[13px] font-bold transition-all hover:gap-2.5 group/btn"
      style={{ color: `hsl(${tint})` }}
    >
      Bekijk website
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
      />
    </a>
  );

  const glow = (
    <div
      aria-hidden
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
      style={{ boxShadow: `inset 0 0 0 1px hsla(${tint}, 0.35)` }}
    />
  );

  if (layout === "feature" || layout === "split") {
    return (
      <div
        className={`group relative h-full rounded-[2rem] border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${
          layout === "feature" ? "p-8 md:p-10" : "p-8"
        }`}
      >
        {glow}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 h-full relative">
          <div className="flex-1 flex flex-col justify-between">
            {Header}
            {Cta}
          </div>
          <div className="flex-1 flex items-center">
            <BrowserPreview url={item.url} title={item.title} />
          </div>
        </div>
      </div>
    );
  }

  // compact
  return (
    <div className="group relative h-full rounded-[2rem] border border-border/60 bg-card p-7 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col">
      {glow}
      <div className="relative">{Header}</div>
      <div className="relative mb-6">
        <BrowserPreview url={item.url} title={item.title} />
      </div>
      <div className="relative mt-auto">{Cta}</div>
    </div>
  );
}

export function MacbookShowcase({ items }: MacbookShowcaseProps) {
  if (!items.length) return null;

  const layouts: Array<{ span: string; variant: Variant }> = [
    { span: "md:col-span-8", variant: "feature" },
    { span: "md:col-span-4", variant: "compact" },
    { span: "md:col-span-4", variant: "compact" },
    { span: "md:col-span-8", variant: "feature" },
    { span: "md:col-span-6", variant: "split" },
    { span: "md:col-span-6", variant: "split" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6">
      {items.map((item, i) => {
        const cfg = layouts[i % layouts.length];
        return (
          <div key={item.title} className={cfg.span}>
            <ProjectCard item={item} layout={cfg.variant} />
          </div>
        );
      })}
    </div>
  );
}

export default MacbookShowcase;
