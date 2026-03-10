import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, MousePointerClick, BarChart3 } from "lucide-react";
import { SilkWaves } from "@/components/SilkWaves";

/* ─── Animated counter ─── */
function AnimCounter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 1800;
    const step = 16;
    const inc = target / (dur / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{val.toLocaleString("nl-NL")}{suffix}</>;
}

/* ─── Website Mockup ─── */
const WebsiteMockup = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotateY: -4 }}
    animate={{ opacity: 1, y: 0, rotateY: 0 }}
    transition={{ duration: 0.7, delay: 0.2 }}
    className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card"
    style={{ aspectRatio: "16/10" }}
  >
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-[hsl(44,90%,60%)]/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    <div className="absolute inset-0 top-9 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Nav */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <div className="w-12 h-3 rounded-sm bg-primary/40" />
        <div className="flex gap-2 ml-auto">
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className="w-14 h-5 rounded-sm bg-primary/60" />
        </div>
      </div>
      {/* Content */}
      <div className="px-4 py-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "75%" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="h-4 rounded bg-foreground/15 mb-2"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "50%" }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="h-3 rounded bg-foreground/10 mb-4"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-20 h-6 rounded bg-primary/50"
        />
      </div>
      {/* Cards */}
      <div className="absolute bottom-3 left-4 right-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.15 }}
            className="rounded-lg border border-border/30 bg-background/60 p-2"
          >
            <div className="w-6 h-6 rounded mb-1.5 bg-primary/30" />
            <div className="w-full h-2 rounded bg-foreground/10 mb-1" />
            <div className="w-2/3 h-1.5 rounded bg-foreground/8" />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

/* ─── Marketing Dashboard Mockup ─── */
const MarketingDashboard = () => {
  const bars = [40, 65, 45, 80, 55, 90, 70];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: 4 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card"
      style={{ aspectRatio: "16/10" }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-[hsl(44,90%,60%)]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
        <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
      </div>
      <div className="absolute inset-0 top-9 bg-gradient-to-br from-accent/5 via-background to-accent/10 p-3">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { icon: Users, value: 1240, label: "Leads", prefix: "" },
            { icon: MousePointerClick, value: 420, label: "CPC", prefix: "€", divisor: 100 },
            { icon: TrendingUp, value: 34, label: "Conv.", suffix: "%" },
          ].map(({ icon: Icon, value, label, prefix, suffix, divisor }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="rounded-lg border border-border/30 bg-background/60 px-2 py-1.5"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <Icon className="w-2.5 h-2.5 text-primary/60" />
                <p className="text-[9px] font-bold text-primary">
                  {prefix}{divisor ? (value / divisor).toFixed(2) : <AnimCounter target={value} />}{suffix}
                </p>
              </div>
              <p className="text-[7px] text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>
        {/* Chart */}
        <div className="rounded-lg border border-border/30 bg-background/60 p-2">
          <div className="flex items-center gap-1 mb-1.5">
            <BarChart3 className="w-2.5 h-2.5 text-muted-foreground/60" />
            <span className="text-[7px] text-muted-foreground">Leads per week</span>
          </div>
          <div className="flex items-end gap-1 h-8">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.5, delay: 1 + i * 0.08 }}
                className="flex-1 rounded-sm bg-primary/40"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Hero Stats Strip ─── */
const stats = [
  { value: 50, suffix: "+", label: "websites opgeleverd" },
  { value: 98, suffix: "%", label: "klanttevredenheid" },
  { value: 449, prefix: "€", label: "instapprijs" },
];

export function PakkettenHero() {
  return (
    <section className="relative border-b border-border bg-background pt-[100px] overflow-hidden">
      <SilkWaves variant="pakketten" />
      <div
        className="absolute inset-y-0 left-0 w-[55%] pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to right, hsl(var(--background)) 40%, hsl(var(--background)/0.6) 70%, transparent 100%)" }}
      />
      <div className="relative z-[2] max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7"
            >
              Pakket samenstellen
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold tracking-[-0.03em] leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.4rem, 4.8vw, 4rem)" }}
            >
              <span className="text-foreground">Configureer jouw pakket</span>
              <span className="text-primary">.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[16px] text-muted-foreground leading-relaxed mb-8 max-w-[520px]"
            >
              Van website bouw tot online marketing. Transparante prijzen, geen verborgen kosten.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex gap-8"
            >
              {stats.map((s, i) => (
                <div key={i} className={`${i > 0 ? "border-l border-border pl-8" : ""}`}>
                  <p className="text-[24px] font-bold text-foreground tracking-tight">
                    {s.prefix}<AnimCounter target={s.value} />{s.suffix}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Interactive Mockups */}
          <div className="hidden lg:grid grid-cols-2 gap-4" style={{ perspective: "800px" }}>
            <div className="col-span-1">
              <WebsiteMockup />
            </div>
            <div className="col-span-1">
              <MarketingDashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
