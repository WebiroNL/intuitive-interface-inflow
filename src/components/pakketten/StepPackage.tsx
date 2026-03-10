import { useState } from "react";
import { Check, Star, Flame, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { packages } from "./data";

interface StepPackageProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function StepPackage({ selected, onSelect }: StepPackageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-10">
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          <span className="text-foreground">Kies jouw website pakket</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
          Selecteer één pakket voor design & ontwikkeling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((pkg, index) => {
          const isCustom = typeof pkg.price === "string";
          const isSelected = selected === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`group relative rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                isCustom ? "cursor-default" : "cursor-pointer"
              } ${
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                  : pkg.popular
                  ? "border-primary/30 bg-card hover:border-primary/60 hover:shadow-md"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
              }`}
              onClick={() => !isCustom && onSelect(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-accent" />
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 min-h-[28px]">
                  {pkg.popular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full">
                      <Star className="w-3 h-3" /> Meest gekozen
                    </span>
                  )}
                  {pkg.savings && !pkg.popular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-medium rounded-full dark:bg-green-900/20 dark:text-green-400">
                      <Flame className="w-3 h-3" /> Bespaar €{pkg.savings}
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-1">{pkg.badge}</p>
                <h3 className="text-[18px] font-bold text-foreground tracking-[-0.01em]">{pkg.name}</h3>
                <p className="text-[13px] text-muted-foreground mt-1 mb-5">{pkg.description}</p>

                <div className="mb-6">
                  {typeof pkg.price === "number" ? (
                    <div className="flex items-baseline gap-2">
                      {pkg.oldPrice && (
                        <span className="text-[14px] text-muted-foreground line-through">€{pkg.oldPrice}</span>
                      )}
                      <span className="text-[32px] font-bold text-foreground tracking-[-0.02em]">€{pkg.price}</span>
                      <span className="text-[13px] text-muted-foreground">eenmalig (ex. btw)</span>
                    </div>
                  ) : (
                    <span className="text-[24px] font-bold text-foreground">{pkg.price}</span>
                  )}
                </div>

                <div className="space-y-3 mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground">Wat je krijgt</p>
                  <ul className="space-y-2">
                    {pkg.whatYouGet.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {pkg.details && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === pkg.id ? null : pkg.id);
                    }}
                    className="text-[13px] text-primary font-medium flex items-center gap-1 mb-5 hover:underline"
                  >
                    {expandedId === pkg.id ? "Verberg details" : "Toon alle details"}
                    {expandedId === pkg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                <AnimatePresence>
                  {expandedId === pkg.id && pkg.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-5 overflow-hidden"
                    >
                      <ul className="space-y-2">
                        {pkg.details.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 dark:text-green-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isCustom ? (
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-primary text-primary font-semibold text-[13px] hover:bg-primary/5 transition-colors"
                  >
                    Offerte aanvragen
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <div
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-[13px] transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground group-hover:border-primary/40"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        Geselecteerd
                      </>
                    ) : (
                      "Selecteer pakket"
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
