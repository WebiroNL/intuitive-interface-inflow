import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { RocketIcon } from "@hugeicons/core-free-icons";

const phases = [
  {
    id: 0,
    label: "Kennismaking",
    color: "hsl(var(--primary))",
    screen: "meeting",
  },
  {
    id: 1,
    label: "Ontwerp & bouw",
    color: "hsl(var(--accent))",
    screen: "design",
  },
  {
    id: 2,
    label: "Lancering",
    color: "hsl(var(--webiro-yellow))",
    screen: "launch",
  },
];

/* ── Tiny sub-screens ── */

function MeetingScreen() {
  return (
    <div className="flex flex-col gap-3 p-5">
      {/* Video call mockup */}
      <div className="flex gap-2.5">
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.2, duration: 0.4 }}
            className="flex-1 rounded-lg bg-primary/10 dark:bg-primary/15 aspect-video flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">{i === 0 ? "JIJ" : "WIJ"}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Chat messages */}
      <div className="space-y-2 mt-1">
        {["Wat zijn je doelen?", "Meer leads via Google", "Top, dat gaan we regelen!"].map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.5, duration: 0.35 }}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium max-w-[75%] ${
                i % 2 === 0
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {msg}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DesignScreen() {
  return (
    <div className="flex flex-col gap-3 p-5">
      {/* Browser mockup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-lg border border-border overflow-hidden"
      >
        <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive/40" />
            <div className="w-2 h-2 rounded-full bg-webiro-yellow/40" />
            <div className="w-2 h-2 rounded-full bg-green-400/40" />
          </div>
          <div className="flex-1 mx-2 h-4 rounded bg-background/80 flex items-center px-2">
            <span className="text-[8px] text-muted-foreground">jouwbedrijf.nl</span>
          </div>
        </div>
        <div className="p-3 bg-card space-y-2">
          {/* Header skeleton */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-3 rounded bg-primary/20"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="h-2 rounded bg-muted"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="h-2 rounded bg-muted"
          />
          {/* CTA button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.3, type: "spring" }}
            className="w-16 h-5 rounded bg-primary mt-2"
          />
        </div>
      </motion.div>
      {/* Cursor */}
      <motion.div
        initial={{ x: -20, y: -30, opacity: 0 }}
        animate={{ x: 40, y: -20, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeInOut" }}
        className="absolute"
        style={{ bottom: "30%", right: "30%" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 1L6 14L8 8L14 6L1 1Z" fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
}

function LaunchScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-5 py-6">
      {/* Rocket */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
      >
        <HugeiconsIcon icon={RocketIcon} className="w-5 h-5 text-primary" />
      </motion.div>
      {/* Stats */}
      <div className="flex gap-3 w-full">
        {[
          { label: "Bezoekers", value: "+248%" },
          { label: "Leads", value: "+89" },
          { label: "Omzet", value: "+34%" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.2, duration: 0.4 }}
            className="flex-1 rounded-lg bg-muted/60 p-2.5 text-center"
          >
            <p className="text-[13px] font-bold text-foreground">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      {/* Confetti dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0.5],
            x: Math.cos((i / 8) * Math.PI * 2) * 60,
            y: Math.sin((i / 8) * Math.PI * 2) * 40 - 20,
          }}
          transition={{ delay: 0.3 + i * 0.08, duration: 1.2 }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: i % 3 === 0 ? "hsl(var(--primary))" : i % 3 === 1 ? "hsl(var(--accent))" : "hsl(var(--webiro-yellow))",
          }}
        />
      ))}
    </div>
  );
}

const screens = [MeetingScreen, DesignScreen, LaunchScreen];

export default function ProcessVisual() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[460px]">
      {/* Device frame */}
      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex gap-1.5">
            {phases.map((phase, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-300 ${
                  active === i
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        {/* Screen area */}
        <div className="relative min-h-[220px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {screens[active]()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 px-4 py-3 border-t border-border">
          {phases.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{
                  width: active === i ? "100%" : active > i ? "100%" : "0%",
                }}
                transition={{
                  duration: active === i ? 4 : 0.3,
                  ease: active === i ? "linear" : "easeOut",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
