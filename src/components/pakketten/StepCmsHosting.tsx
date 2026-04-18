import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cmsHostingTiers, contractDiscounts } from "./data";
import { ContractDuration } from "./types";

interface StepCmsHostingProps {
  selected: string | null;
  onSelect: (id: string) => void;
  contractDuration: ContractDuration;
  onContractChange: (d: ContractDuration) => void;
}

export function StepCmsHosting({ selected, onSelect, contractDuration, onContractChange }: StepCmsHostingProps) {
  return (
    <div>
      <div className="mb-10">
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          <span className="text-foreground">CMS & Hosting</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
          Kies een CMS & hosting pakket. Eerste maand gratis.
        </p>
      </div>

      {/* Contract duration toggle */}
      <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-muted/60 border border-border mb-10">
        {(Object.entries(contractDiscounts) as [ContractDuration, { label: string; discount: number }][]).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => onContractChange(key)}
            className={`px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
              contractDuration === key
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {cmsHostingTiers.map((tier, i) => {
          const isCustom = typeof tier.price === "string";
          const isSelected = selected === tier.id;
          const discount = contractDiscounts[contractDuration].discount;
          const displayPrice = typeof tier.price === "number" && tier.price > 0
            ? Math.round(tier.price * (1 - discount))
            : tier.price;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => onSelect(tier.id)}
              className="relative cursor-pointer"
            >
              {tier.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full shadow-md shadow-primary/20 whitespace-nowrap">
                  <Star className="w-3 h-3" /> Populair
                </span>
              )}

              <div
                className={`group relative rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                    : tier.recommended
                    ? "border-primary/30 bg-card hover:border-primary/60 hover:shadow-md"
                    : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div className="p-6">

                <h3 className="text-[18px] font-bold text-foreground tracking-[-0.01em]">{tier.name}</h3>
                <div className="mt-3 mb-4">
                  {typeof displayPrice === "number" ? (
                    displayPrice === 0 ? (
                      <span className="text-[28px] font-bold text-foreground">Gratis</span>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-[32px] font-bold text-foreground tracking-[-0.02em]">€{displayPrice}</span>
                        <span className="text-[13px] text-muted-foreground">/maand (ex. btw)</span>
                        {discount > 0 && typeof tier.price === "number" && tier.price > 0 && (
                          <span className="text-[12px] text-green-600 font-medium dark:text-green-400">
                            was €{tier.price}
                          </span>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-[24px] font-bold text-foreground">{displayPrice}</span>
                      <span className="text-[13px] text-muted-foreground">{tier.period}</span>
                    </div>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mb-5">{tier.description}</p>

                {typeof tier.price === "number" && tier.price > 0 && (
                  <p className="text-[12px] text-primary font-medium mb-5 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Eerste maand gratis
                  </p>
                )}

                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-[13px] transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground group-hover:border-primary/40"
                }`}>
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Geselecteerd
                    </>
                  ) : isCustom ? (
                    "Offerte aanvragen"
                  ) : (
                    "Selecteer"
                  )}
                </div>
              </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[12px] text-muted-foreground mt-8">
        Eerste maand gratis. Daarna maandelijks opzegbaar. Jaarcontract = 10% korting. 2-jarig contract = 20% korting.
      </p>
    </div>
  );
}
