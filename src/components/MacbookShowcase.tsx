import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, ArrowRight01Icon, LockIcon } from "@hugeicons/core-free-icons";
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

function BrowserFrame({ url, title, tint }: { url: string; title: string; tint: string }) {
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

  const host = getHostname(url);

  return (
    <div className="relative w-full">
      {/* Ambient glow behind the browser */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[60px] blur-3xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(55% 55% at 50% 40%, hsla(${tint}, 0.35), transparent 70%)`,
        }}
      />

      {/* Browser window */}
      <div className="relative rounded-xl overflow-hidden border border-border/60 bg-card shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35),0_6px_16px_-10px_rgba(0,0,0,0.2)]">
        {/* Chrome */}
        <div className="flex items-center gap-2 px-2.5 h-7 border-b border-border/60 bg-muted/40">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <span className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-2 flex items-center justify-center gap-1.5 h-4 px-2 rounded bg-background/80 border border-border/60 max-w-[220px] mx-auto">
            <HugeiconsIcon icon={LockIcon} className="h-2.5 w-2.5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground truncate font-mono">{host}</span>
          </div>
          <div className="w-[36px]" aria-hidden />
        </div>

        {/* Viewport */}
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
            <LazyIframe src={url} title={title} className="w-full h-full" loading="eager" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MacbookShowcase({ items }: MacbookShowcaseProps) {
  const [active, setActive] = useState(0);
  const item = items[active];
  const activeTint = useMemo(() => item?.tint ?? "234,82%,57%", [item]);
  if (!item) return null;

  return (
    <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6 lg:gap-8 items-stretch">
      {/* LEFT: Big bento card with browser preview */}
      <div className="relative group">
        {/* Border glow */}
        <div
          aria-hidden
          className="absolute -inset-px rounded-[20px] opacity-70 blur-[2px] pointer-events-none transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, hsla(${activeTint}, 0.5), hsla(270, 70%, 60%, 0.35), transparent 70%)`,
          }}
        />
        <div className="relative h-full rounded-[20px] border border-border/60 bg-gradient-to-br from-card via-card to-card/40 p-6 sm:p-8 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col flex-1"
            >
              <BrowserFrame url={item.url} title={item.title} tint={activeTint} />

              {/* Caption */}
              <div className="mt-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  {item.cat}
                </p>
                <h3 className="text-[22px] sm:text-[24px] font-bold text-foreground mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-xl mb-4">
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {item.services.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:gap-2.5 transition-all"
                >
                  Bekijk website
                  <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Numbered list bento card */}
      <div className="relative h-full rounded-[20px] border border-border/60 bg-gradient-to-br from-card via-card to-card/40 p-6 sm:p-7 flex flex-col">
        <div className="flex items-baseline justify-between mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Recent werk
          </p>
          <span className="text-[11px] font-mono text-muted-foreground/70">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>

        <ul className="flex flex-col -mx-2">
          {items.map((it, i) => {
            const isActive = i === active;
            return (
              <li key={it.title}>
                <button
                  onClick={() => setActive(i)}
                  className={`relative w-full flex items-center gap-4 py-4 px-3 rounded-lg text-left transition-colors duration-200 border-b border-border/40 last:border-b-0 ${
                    isActive ? "bg-primary/5" : "hover:bg-muted/40"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="showcase-active-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span
                    className={`text-[12px] font-mono tabular-nums ${
                      isActive ? "text-primary" : "text-muted-foreground/70"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[14px] font-semibold truncate ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {it.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {it.cat}
                    </p>
                  </div>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className={`h-4 w-4 flex-shrink-0 transition-all ${
                      isActive
                        ? "text-primary opacity-100 translate-x-0"
                        : "text-muted-foreground/40 opacity-0 -translate-x-1 group-hover:opacity-100"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MacbookShowcase;
