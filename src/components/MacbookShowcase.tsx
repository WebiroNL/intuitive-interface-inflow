import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
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

function MacBookFrame({ url, title, tint }: { url: string; title: string; tint: string }) {
  return (
    <div className="relative w-full">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[60px] blur-3xl opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(60% 60% at 50% 40%, hsla(${tint}, 0.35), transparent 70%)`,
        }}
      />

      {/* Screen + bezel */}
      <div
        className="relative rounded-[18px] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45),0_10px_25px_-12px_rgba(0,0,0,0.3)]"
        style={{
          background: "linear-gradient(160deg, hsl(0,0%,14%) 0%, hsl(0,0%,6%) 60%, hsl(0,0%,16%) 100%)",
        }}
      >
        {/* Notch / camera */}
        <div className="absolute left-1/2 top-[3px] -translate-x-1/2 z-20 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-neutral-700" />
        </div>

        <div
          className="relative w-full overflow-hidden rounded-[10px] bg-white"
          style={{ aspectRatio: "16 / 10" }}
        >
          {/* Browser chrome */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 px-3 h-7 bg-neutral-100 border-b border-neutral-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="ml-3 flex-1 h-4 rounded bg-white border border-neutral-200 flex items-center px-2">
              <span className="text-[9px] text-neutral-500 truncate">{url.replace(/^https?:\/\//, "")}</span>
            </div>
          </div>

          <div className="absolute inset-0 pt-7">
            <LazyIframe src={url} title={title} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Base / hinge */}
      <div className="relative mx-auto" style={{ width: "108%" }}>
        <div
          className="h-[10px] rounded-b-[14px]"
          style={{
            background: "linear-gradient(180deg, hsl(0,0%,18%) 0%, hsl(0,0%,8%) 100%)",
          }}
        />
        <div className="mx-auto h-[5px] w-1/3 rounded-b-[10px] bg-neutral-900/80" />
      </div>
    </div>
  );
}

export function MacbookShowcase({ items }: MacbookShowcaseProps) {
  const [active, setActive] = useState(0);
  const item = items[active];
  if (!item) return null;
  const tint = item.tint ?? "234,82%,57%";

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12 items-start">
      {/* MacBook display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <MacBookFrame url={item.url} title={item.title} tint={tint} />

            {/* Caption under macbook */}
            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                {item.cat}
              </p>
              <h3 className="text-[20px] font-bold text-foreground mb-2">{item.title}</h3>
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
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:gap-3 transition-all"
              >
                Bekijk website
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Clickable list (mirrors ReviewsSection selector) */}
      <div className="flex flex-col gap-2">
        {items.map((it, i) => (
          <button
            key={it.title}
            onClick={() => setActive(i)}
            className={`relative flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
              i === active
                ? "bg-card border border-primary/30 shadow-sm"
                : "hover:bg-card/60 border border-transparent"
            }`}
          >
            <div
              className="w-9 h-9 rounded-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, hsla(${it.tint ?? "234,82%,57%"}, 0.9), hsla(${it.tint ?? "234,82%,57%"}, 0.5))`,
              }}
            />
            <div className="min-w-0 flex-1">
              <p className={`text-[13px] font-semibold truncate ${i === active ? "text-foreground" : "text-muted-foreground"}`}>
                {it.title}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">{it.cat}</p>
            </div>
            {i === active && (
              <motion.div
                layoutId="showcase-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MacbookShowcase;
