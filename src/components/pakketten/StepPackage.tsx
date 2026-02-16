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
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Kies jouw website pakket<span className="text-primary">.</span>
      </h2>
      <p className="text-muted-foreground mb-8">
        Selecteer één pakket voor design & ontwikkeling. Wil je meerdere websites? Vul dan het formulier opnieuw in.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg, index) => {
          const isCustom = typeof pkg.price === "string";
          const isSelected = selected === pkg.id;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg"
                  : pkg.popular
                  ? "border-primary/30 bg-card hover:border-primary/60"
                  : "border-border bg-card hover:border-primary/50"
              }`}
              onClick={() => !isCustom && onSelect(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    <Star className="w-3 h-3" /> Meest gekozen
                  </span>
                </div>
              )}

              {pkg.savings && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full dark:bg-green-900/30 dark:text-green-400">
                    <Flame className="w-3 h-3" /> Bespaar €{pkg.savings}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-xs text-primary font-medium">{pkg.badge}</span>
                <h3 className="text-xl font-bold text-foreground mt-1">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
              </div>

              <div className="mb-6">
                {typeof pkg.price === "number" ? (
                  <div>
                    {pkg.oldPrice && (
                      <span className="text-sm text-muted-foreground line-through mr-2">
                        €{pkg.oldPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-foreground">€{pkg.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">eenmalig</span>
                    <p className="text-xs text-muted-foreground mt-0.5">ex. btw</p>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-foreground">{pkg.price}</span>
                )}
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2">Wat je krijgt:</h4>
                  <ul className="space-y-1.5">
                    {pkg.whatYouGet.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {pkg.details && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(expandedId === pkg.id ? null : pkg.id);
                  }}
                  className="text-sm text-primary font-medium flex items-center gap-1 mb-4 hover:underline"
                >
                  {expandedId === pkg.id ? "Verberg details" : "Toon alle details"}
                  {expandedId === pkg.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              {expandedId === pkg.id && pkg.details && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mb-4"
                >
                  <ul className="space-y-1.5">
                    {pkg.details.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {isCustom ? (
                <Link
                  to="/contact"
                  className="block w-full text-center py-2.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
                >
                  Offerte aanvragen
                </Link>
              ) : (
                <div
                  className={`w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "border-2 border-border text-foreground hover:border-primary"
                  }`}
                >
                  {isSelected ? "✓ Geselecteerd" : "Selecteer pakket"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
