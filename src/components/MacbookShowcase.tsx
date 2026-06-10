import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  LockIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";


export interface ShowcaseItem {
  title: string;
  cat: string;
  url: string;
  services: string[];
  desc: string;
  tint?: string;
  previewImageUrl?: string | null;
  previewVideoUrl?: string | null;
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

const VIRTUAL_WIDTH = 1440;
const VIRTUAL_HEIGHT = 4200;
const SCROLL_SPEED = 18; // px per second
const RESUME_DELAY = 1800; // ms after interaction

function LiveBrowserPreview({ item }: { item: ShowcaseItem }) {
  const tint = item.tint ?? "234,82%,57%";
  const host = getHostname(item.url);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  // Track container width to compute scale
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / VIRTUAL_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const visibleVirtualHeight = containerRef.current
      ? containerRef.current.clientHeight / scale
      : 900;
    const maxOffset = Math.max(0, VIRTUAL_HEIGHT - visibleVirtualHeight);

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && loaded) {
        offsetRef.current += SCROLL_SPEED * dt;
        if (offsetRef.current > maxOffset) {
          // pause briefly then reset to top
          offsetRef.current = maxOffset;
          pausedRef.current = true;
          window.setTimeout(() => {
            offsetRef.current = 0;
            pausedRef.current = false;
          }, 2500);
        }
        if (iframeRef.current) {
          iframeRef.current.style.transform = `translateY(${-offsetRef.current}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scale, loaded]);

  // Reset when project changes
  useEffect(() => {
    offsetRef.current = 0;
    setLoaded(false);
    if (iframeRef.current) iframeRef.current.style.transform = "translateY(0)";
  }, [item.url]);

  const pauseAuto = () => {
    pausedRef.current = true;
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-border/60 bg-background shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
      style={{ ["--tint" as any]: tint }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 h-9 border-b border-border/60 bg-muted/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 h-5 px-2 rounded bg-background/80 border border-border/60 max-w-[300px] mx-auto">
          <HugeiconsIcon icon={LockIcon} className="h-3 w-3 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground truncate font-mono">{host}</span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-5 w-[44px] rounded text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open in nieuw tabblad"
        >
          <HugeiconsIcon icon={ArrowUpRight01Icon} className="h-3.5 w-3.5" />
        </a>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-muted"
        style={{ aspectRatio: "16 / 10" }}
        onMouseEnter={pauseAuto}
        onMouseMove={pauseAuto}
        onWheel={pauseAuto}
        onTouchStart={pauseAuto}
      >
        {/* Loading shimmer */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
            <div
              className="h-8 w-8 rounded-full border-2 animate-spin"
              style={{
                borderColor: `hsla(${tint}, 0.25)`,
                borderTopColor: `hsl(${tint})`,
              }}
            />
          </div>
        )}

        <div
          style={{
            width: VIRTUAL_WIDTH,
            height: VIRTUAL_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            ref={iframeRef}
            key={item.url}
            src={item.url}
            title={`Live preview ${item.title}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer"
            style={{
              width: VIRTUAL_WIDTH,
              height: VIRTUAL_HEIGHT,
              border: "0",
              display: "block",
              transition: "transform 120ms linear",
              background: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
}


export function MacbookShowcase({ items }: MacbookShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!items.length) return null;
  const active = items[Math.min(activeIndex, items.length - 1)] ?? items[0];
  const tint = active.tint ?? "234,82%,57%";

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 lg:grid-rows-[auto_auto]">
        {/* LEFT — Spotlight (row 1) */}
        <div className="relative lg:row-start-1 lg:col-start-1">
          {/* Glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 opacity-70 blur-3xl transition-colors duration-700"
            style={{
              background: `radial-gradient(60% 60% at 30% 30%, hsla(${tint}, 0.22), transparent 70%)`,
            }}
          />

          <LiveBrowserPreview item={active} />
        </div>

        {/* RIGHT — Project rail (row 1, stretches to mockup height) */}
        <div className="lg:row-start-1 lg:col-start-2 lg:h-full">
          <div className="flex flex-col h-full rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden divide-y divide-border/50">
            {items.map((item, i) => {
              const isActive = i === activeIndex;
              const t = item.tint ?? "234,82%,57%";
              return (
                <button
                  key={item.title + item.url}
                  type="button"
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className={`group relative flex flex-1 items-center gap-4 px-4 py-4 text-left transition-colors duration-300 ${
                    isActive ? "bg-muted/60" : "hover:bg-muted/40"
                  }`}
                >
                  {/* Active bar */}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ background: `hsl(${t})` }}
                  />

                  {/* Initial badge */}
                  <span
                    className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl text-[12px] font-bold tracking-tight transition-transform duration-300 group-hover:scale-105"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, hsla(${t}, 0.95), hsla(${t}, 0.7))`
                        : `hsla(${t}, 0.12)`,

                      color: isActive ? "white" : `hsl(${t})`,
                      boxShadow: isActive ? `0 10px 24px -10px hsla(${t}, 0.6)` : undefined,
                    }}
                  >
                    {item.title
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`truncate text-[14px] font-bold transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/85"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground truncate">
                      <span className="font-semibold uppercase tracking-wider">{item.cat}</span>
                      <span className="mx-1.5 opacity-50">·</span>
                      <span>{item.services.slice(0, 2).join(", ")}</span>
                    </p>
                  </div>

                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    className={`h-4 w-4 shrink-0 transition-all ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                    }`}
                    style={isActive ? { color: `hsl(${t})` } : undefined}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Marquee social proof */}
      <div className="relative mt-16 pt-10 border-t border-border/50 overflow-hidden">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground text-center mb-6">
          Vertrouwd door
        </p>
        <div className="relative">
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
            style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
            style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
          />
          <div className="flex w-max gap-x-14 animate-[marquee_38s_linear_infinite] [will-change:transform]">
            {[0, 1].map((set) => (
              <div key={set} className="flex items-center gap-x-14 flex-shrink-0">
                {items.map((item) => {
                  const t = item.tint ?? "234,82%,57%";
                  return (
                    <a
                      key={`${set}-${item.title}`}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 flex-shrink-0 text-foreground/70 hover:text-foreground transition-colors"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: `hsl(${t})` }}
                        aria-hidden
                      />
                      <span className="text-[15px] font-bold tracking-tight whitespace-nowrap">
                        {item.title}
                      </span>
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
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
