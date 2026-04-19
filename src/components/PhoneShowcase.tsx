import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { LazyIframe } from "@/components/LazyIframe";

export interface ShowcaseItem {
  title: string;
  cat: string;
  url: string;
  services: string[];
  desc: string;
  /** HSL triplet without "hsl()", e.g. "234,82%,57%" — used for the card backdrop tint */
  tint?: string;
}

interface PhoneShowcaseProps {
  items: ShowcaseItem[];
}

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent));

interface PhoneFrameProps {
  url: string;
  title: string;
  /** Whether iframe should be rendered (vs gradient placeholder) */
  active: boolean;
  tint: string;
}

function PhoneFrame({ url, title, active, tint }: PhoneFrameProps) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / 390);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      className="relative mx-auto"
      style={{
        width: "min(280px, 78vw)",
        aspectRatio: "9 / 19.5",
      }}
    >
      {/* Soft glow behind phone */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[60px] blur-2xl opacity-60"
        style={{
          background: `radial-gradient(60% 60% at 50% 40%, hsla(${tint}, 0.35), transparent 70%)`,
        }}
      />

      {/* Outer bezel */}
      <div
        className="relative h-full w-full rounded-[44px] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45),0_10px_25px_-12px_rgba(0,0,0,0.3)]"
        style={{
          background:
            "linear-gradient(160deg, hsl(0,0%,12%) 0%, hsl(0,0%,6%) 50%, hsl(0,0%,14%) 100%)",
        }}
      >
        {/* Inner highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[2px] rounded-[42px] opacity-40"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18), transparent 30%, transparent 70%, rgba(255,255,255,0.08))",
          }}
        />

        {/* Side buttons */}
        <span
          aria-hidden
          className="absolute left-[-2px] top-[22%] h-[60px] w-[3px] rounded-l-sm bg-neutral-800"
        />
        <span
          aria-hidden
          className="absolute left-[-2px] top-[36%] h-[40px] w-[3px] rounded-l-sm bg-neutral-800"
        />
        <span
          aria-hidden
          className="absolute left-[-2px] top-[44%] h-[40px] w-[3px] rounded-l-sm bg-neutral-800"
        />
        <span
          aria-hidden
          className="absolute right-[-2px] top-[28%] h-[70px] w-[3px] rounded-r-sm bg-neutral-800"
        />

        {/* Screen */}
        <div ref={screenRef} className="relative h-full w-full overflow-hidden rounded-[34px] bg-white">
          {/* Dynamic island */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[8px] z-20 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black"
          />

          {/* Auto-scrolling iframe scaled to mobile viewport (390px) */}
          {active ? (
            <div className="absolute inset-0 overflow-hidden">
              {/* Outer scaler: shrinks 390px viewport to fit phone screen width */}
              <div
                className="absolute left-0 top-0"
                style={{
                  width: '390px',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                {/* Inner mover: animates Y-translation only */}
                <div
                  className="animate-[phoneScroll_28s_ease-in-out_infinite_alternate]"
                  style={{ width: '390px', height: '1800px' }}
                >
                  <LazyIframe src={url} title={title} className="h-full w-full" />
                </div>
              </div>
            </div>
          ) : (
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(160deg, hsla(${tint}, 0.18) 0%, hsla(${tint}, 0.05) 60%, hsl(var(--muted)) 100%)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function PhoneShowcase({ items }: PhoneShowcaseProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobile] = useState(() => isMobile());

  // Track which card is most centered so we know which iframe to keep "active" on mobile
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const cCenter = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cCenter - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIndex(best);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Header arrows (desktop) */}
      <div className="absolute right-0 -top-14 hidden md:flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Vorige projecten"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/40 hover:bg-muted/40"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Volgende projecten"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/40 hover:bg-muted/40"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
        </button>
      </div>

      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 md:w-16"
        style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 md:w-16"
        style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
      />

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{
          scrollPaddingInline: "1.5rem",
          paddingInline: "1.5rem",
        }}
      >
        {items.map((item, i) => {
          const tint = item.tint ?? "234,82%,57%";
          // On mobile only render the active iframe + 1 buffer; on desktop render active + 2 buffers
          const buffer = mobile ? 0 : 1;
          const renderIframe = Math.abs(i - activeIndex) <= buffer;
          return (
            <article
              key={item.title}
              data-card
              className="snap-center shrink-0 w-[78vw] sm:w-[420px] md:w-[360px] lg:w-[380px]"
            >
              <div
                className="rounded-3xl border border-border bg-card p-6 lg:p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
                style={{
                  background: `linear-gradient(180deg, hsla(${tint}, 0.06) 0%, hsl(var(--card)) 55%)`,
                }}
              >
                <div className="flex justify-center pt-2 pb-6">
                  <PhoneFrame
                    url={item.url}
                    title={item.title}
                    active={renderIframe}
                    tint={tint}
                  />
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                  {item.cat}
                </p>
                <h3 className="text-[18px] font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
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
            </article>
          );
        })}
      </div>

      {/* Mobile dots */}
      <div className="flex md:hidden justify-center gap-1.5 pt-2">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PhoneShowcase;
