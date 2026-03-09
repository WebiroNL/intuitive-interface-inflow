import { useState } from "react";
import { Check, Star, Flame, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
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
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">Kies jouw website pakket</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Selecteer één pakket voor design & ontwikkeling.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {packages.map((pkg, index) => {
          const isCustom = typeof pkg.price === "string";
          const isSelected = selected === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`relative rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-md ring-1 ring-primary/20"
                  : pkg.popular
                  ? "border-primary/30 bg-card hover:border-primary/60 hover:shadow-sm"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
              }`}
              onClick={() => !isCustom && onSelect(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-px left-0 right-0 h-[3px] bg-primary rounded-t-2xl" />
              )}

              <div className="p-6">
                {pkg.popular && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full mb-3">
                    <Star className="w-3 h-3" /> Meest gekozen
                  </span>
                )}

                {pkg.savings && !pkg.popular && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[11px] font-medium rounded-full mb-3 dark:bg-green-900/20 dark:text-green-400">
                    <Flame className="w-3 h-3" /> Bespaar €{pkg.savings}
                  </span>
                )}

                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary mb-1">{pkg.badge}</p>
                <h3 className="text-[18px] font-bold text-foreground">{pkg.name}</h3>
                <p className="text-[13px] text-muted-foreground mt-1 mb-4">{pkg.description}</p>

                <div className="mb-5">
                  {typeof pkg.price === "number" ? (
                    <div>
                      {pkg.oldPrice && (
                        <span className="text-[13px] text-muted-foreground line-through mr-2">€{pkg.oldPrice}</span>
                      )}
                      <span className="text-[28px] font-bold text-foreground">€{pkg.price}</span>
                      <span className="text-[13px] text-muted-foreground ml-1">eenmalig (ex. btw)</span>
                    </div>
                  ) : (
                    <span className="text-[22px] font-bold text-foreground">{pkg.price}</span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground">Wat je krijgt:</p>
                  <ul className="space-y-1.5">
                    {pkg.whatYouGet.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                        <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
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
                    className="text-[13px] text-primary font-medium flex items-center gap-1 mb-4 hover:underline"
                  >
                    {expandedId === pkg.id ? "Verberg details" : "Toon alle details"}
                    {expandedId === pkg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                {expandedId === pkg.id && pkg.details && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-4">
                    <ul className="space-y-1.5">
                      {pkg.details.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {isCustom ? (
                  <Link
                    to="/contact"
                    className="block w-full text-center py-2.5 rounded-[6px] border border-primary text-primary font-semibold text-[13px] hover:bg-primary/5 transition-colors"
                  >
                    Offerte aanvragen
                  </Link>
                ) : (
                  <div
                    className={`w-full text-center py-2.5 rounded-[6px] font-semibold text-[13px] transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "border border-input text-foreground hover:border-primary"
                    }`}
                  >
                    {isSelected ? "✓ Geselecteerd" : "Selecteer pakket"}
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
