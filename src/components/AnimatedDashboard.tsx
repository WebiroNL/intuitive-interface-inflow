import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const metrics = [
  { label: 'Bezoekers', value: 12847, prefix: '', suffix: '', color: 'text-primary' },
  { label: 'Conversie', value: 4.8, prefix: '', suffix: '%', color: 'text-emerald-500' },
  { label: 'Omzet', value: 24650, prefix: '€', suffix: '', color: 'text-webiro-yellow' },
];

const chartBars = [35, 52, 44, 68, 58, 82, 74, 91, 85, 96, 88, 100];

const notifications = [
  { text: 'Nieuwe lead via Google Ads', icon: '🎯', time: '2s geleden' },
  { text: 'Conversie: offerte aangevraagd', icon: '✅', time: '14s geleden' },
  { text: 'Website pagina snelheid +12%', icon: '⚡', time: '1m geleden' },
  { text: 'E-mail campagne verstuurd', icon: '📧', time: '3m geleden' },
  { text: 'SEO ranking gestegen: #3 → #1', icon: '📈', time: '5m geleden' },
];

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased * 10) / 10);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  const formatted = Number.isInteger(value)
    ? Math.round(display).toLocaleString('nl-NL')
    : display.toFixed(1);

  return <span>{prefix}{formatted}{suffix}</span>;
}

export function AnimatedDashboard() {
  const [activeNotif, setActiveNotif] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotif(prev => (prev + 1) % notifications.length);
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 600);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-border/40 bg-card select-none"
      style={{
        aspectRatio: '16/10',
        boxShadow: '0 25px 60px -12px hsl(var(--primary) / 0.15), 0 12px 30px -8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Browser bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-muted/50 border-b border-border/30">
        <span className="w-3 h-3 rounded-full bg-[hsl(0,70%,60%)]" />
        <span className="w-3 h-3 rounded-full bg-[hsl(44,80%,55%)]" />
        <span className="w-3 h-3 rounded-full bg-[hsl(140,50%,50%)]" />
        <div className="ml-3 flex-1 h-5 rounded-md bg-muted/80 max-w-[200px] flex items-center px-2">
          <span className="text-[8px] text-muted-foreground/60 truncate">dashboard.webiro.nl</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Top metrics row */}
        <div className="grid grid-cols-3 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-border/30 bg-background/60 px-2.5 py-2">
              <p className="text-[8px] text-muted-foreground mb-0.5">{m.label}</p>
              <p className={`text-sm sm:text-base font-bold ${m.color}`}>
                <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
              </p>
            </div>
          ))}
        </div>

        {/* Chart + notifications */}
        <div className="grid grid-cols-[1fr_0.8fr] gap-2">
          {/* Chart */}
          <div className="rounded-lg border border-border/30 bg-background/60 p-2.5">
            <p className="text-[8px] text-muted-foreground mb-2">Groei afgelopen 12 maanden</p>
            <div className="flex items-end gap-[3px] h-16">
              {chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/70"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>

          {/* Live notifications */}
          <div className="rounded-lg border border-border/30 bg-background/60 p-2.5 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${showPulse ? 'animate-ping' : ''}`} />
              <p className="text-[8px] text-muted-foreground">Live activiteit</p>
            </div>
            <div className="space-y-1.5 relative h-[52px] overflow-hidden">
              <AnimatePresence mode="popLayout">
                {[0, 1, 2].map((offset) => {
                  const idx = (activeNotif + offset) % notifications.length;
                  const notif = notifications[idx];
                  return (
                    <motion.div
                      key={`${idx}-${activeNotif}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: offset === 0 ? 1 : 0.4, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="text-[10px]">{notif.icon}</span>
                      <span className="text-[7px] text-foreground/80 truncate flex-1">{notif.text}</span>
                      <span className="text-[6px] text-muted-foreground whitespace-nowrap">{notif.time}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[7px] text-muted-foreground">Alle systemen actief</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[7px] text-muted-foreground">Website <span className="text-emerald-500">●</span></span>
            <span className="text-[7px] text-muted-foreground">Ads <span className="text-emerald-500">●</span></span>
            <span className="text-[7px] text-muted-foreground">E-mail <span className="text-emerald-500">●</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimatedDashboard;
