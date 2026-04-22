import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FlashIcon, ChartIncreaseIcon } from "@hugeicons/core-free-icons";

const phases = [
  { id: 0, label: "Strategie" },
  { id: 1, label: "Live zetten" },
  { id: 2, label: "Optimaliseren" },
];

function StrategyScreen() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="rounded-lg border border-border bg-muted/40 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Doelgroep</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Lokale ondernemers",
            "MKB beslissers",
            "Retargeting",
          ].map((chip) => (
            <div key={chip} className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
              {chip}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Campagnedoel</p>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-foreground">Meer gekwalificeerde leads</p>
            <p className="text-[10px] text-muted-foreground">Kanaalkeuze + budgetverdeling</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LaunchCampaignScreen() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/40">
          <p className="text-[10px] font-semibold text-muted-foreground">Campagnes</p>
          <div className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">Live</div>
        </div>
        <div className="p-3 space-y-2.5">
          {["Google Search", "Meta Leads", "Remarketing"].map((channel, i) => (
            <motion.div
              key={channel}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.3 }}
              className="flex items-center justify-between rounded-md bg-muted/50 px-2.5 py-1.5"
            >
              <p className="text-[11px] font-medium text-foreground">{channel}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-[10px] text-muted-foreground">Actief</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.25 }}
        className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ml-auto"
      >
        <HugeiconsIcon icon={FlashIcon} className="w-5 h-5 text-primary" />
      </motion.div>
    </div>
  );
}

function OptimizeScreen() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "CPL", value: "-22%" },
          { label: "CTR", value: "+31%" },
          { label: "ROAS", value: "4.6x" },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.3 }}
            className="rounded-md bg-muted/50 p-2 text-center"
          >
            <p className="text-[12px] font-bold text-foreground">{metric.value}</p>
            <p className="text-[9px] text-muted-foreground">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-3">
        <p className="text-[10px] text-muted-foreground mb-2">Performance trend</p>
        <div className="flex items-end gap-1 h-10">
          {[35, 45, 40, 55, 62, 70, 78].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
              className="flex-1 rounded-sm bg-primary/35"
            />
          ))}
        </div>
      </div>

      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ml-auto">
        <HugeiconsIcon icon={ChartIncreaseIcon} className="w-5 h-5 text-primary" />
      </div>
    </div>
  );
}

const screens = [StrategyScreen, LaunchCampaignScreen, OptimizeScreen];

type AdsProcessVisualProps = {
  activeStep?: number;
  onStepChange?: (step: number) => void;
  showTabs?: boolean;
};

export default function AdsProcessVisual({
  activeStep,
  onStepChange,
  showTabs = true,
}: AdsProcessVisualProps) {
  const isControlled = typeof activeStep === "number";
  const [internalActive, setInternalActive] = useState(0);
  const currentStep = isControlled ? activeStep : internalActive;
  const ActiveScreen = screens[currentStep];

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      const nextStep = (currentStep + 1) % phases.length;
      if (!isControlled) {
        setInternalActive(nextStep);
      }
      onStepChange?.(nextStep);
    }, 4000);

    return () => clearInterval(timer);
  }, [currentStep, isControlled, onStepChange, isVisible]);

  const handleStepChange = (step: number) => {
    if (!isControlled) {
      setInternalActive(step);
    }
    onStepChange?.(step);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[460px]">
      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        {showTabs && (
          <div className="flex items-center px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              {phases.map((phase, i) => (
                <button
                  key={phase.id}
                  onClick={() => handleStepChange(i)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-300 ${
                    currentStep === i
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative h-[220px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
              className="relative"
            >
              <ActiveScreen />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-1.5 px-4 py-3 border-t border-border">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: currentStep >= i ? "100%" : "0%" }}
                transition={{ duration: currentStep === i ? 4 : 0.3, ease: "linear" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
