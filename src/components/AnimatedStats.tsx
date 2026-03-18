import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Clock01Icon, Rocket01Icon, CheckmarkCircle02Icon, ShieldKeyIcon } from "@hugeicons/core-free-icons";

/* ─── Animated Counter ─── */
function Counter({ value, suffix = "", prefix = "", duration = 2 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = 16;
    const inc = value / (duration * 1000 / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 10) / 10);
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  const display = value % 1 !== 0 ? count.toFixed(1) : Math.floor(count).toString();

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

const stats = [
  {
    icon: Clock01Icon,
    value: 7,
    suffix: "",
    label: "dagen",
    sublabel: "gemiddelde levertijd",
  },
  {
    icon: StarIcon,
    value: 5.0,
    suffix: "",
    label: "rating",
    sublabel: "op Google Reviews",
    hasStars: true,
  },
  {
    icon: CheckmarkCircle02Icon,
    value: 100,
    suffix: "%",
    label: "maatwerk",
    sublabel: "geen templates",
  },
  {
    icon: ShieldKeyIcon,
    value: 0,
    prefix: "€",
    suffix: "",
    label: "verborgen kosten",
    sublabel: "transparante prijzen",
  },
];

export function AnimatedStats() {
  return (
    <section className="border-t border-border bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.sublabel}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative text-center ${i > 0 ? "lg:border-l lg:border-border" : ""}`}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/8 mb-5">
                <HugeiconsIcon icon={stat.icon} className="w-5 h-5 text-primary" />
              </div>

              {/* Big number */}
              <div className="mb-1">
                <span className="text-5xl lg:text-[3.5rem] font-bold tracking-[-0.04em] text-foreground leading-none">
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix={stat.prefix || ""}
                    duration={1.8}
                  />
                </span>
              </div>

              {/* Stars for rating */}
              {stat.hasStars && (
                <div className="flex items-center justify-center gap-0.5 mt-2 mb-1">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + j * 0.1, type: "spring", stiffness: 300 }}
                    >
                      <HugeiconsIcon icon={StarIcon} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Labels */}
              <p className="text-[15px] font-semibold text-foreground mt-2">{stat.label}</p>
              <p className="text-[13px] text-muted-foreground">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
