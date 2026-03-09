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
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">CMS & Hosting</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[14px] text-muted-foreground mb-1">
          Kies een CMS & hosting pakket. Eerste maand gratis.
        </p>
      </div>

      {/* Contract duration toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/60 w-fit mb-8">
        {(Object.entries(contractDiscounts) as [ContractDuration, { label: string; discount: number }][]).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => onContractChange(key)}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-all ${
              contractDuration === key
                ? "bg-background text-foreground shadow-sm"
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onSelect(tier.id)}
              className={`relative rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-md ring-1 ring-primary/20"
                  : tier.recommended
                  ? "border-primary/30 bg-card hover:border-primary/60"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-px left-0 right-0 h-[3px] bg-primary rounded-t-2xl" />
              )}

              <div className="p-6">
                {tier.recommended && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full mb-3">
                    <Star className="w-3 h-3" /> Populair
                  </span>
                )}

                <h3 className="text-[18px] font-bold text-foreground">{tier.name}</h3>
                <div className="mt-2 mb-3">
                  {typeof displayPrice === "number" ? (
                    displayPrice === 0 ? (
                      <span className="text-[24px] font-bold text-foreground">Gratis</span>
                    ) : (
                      <>
                        <span className="text-[28px] font-bold text-foreground">€{displayPrice}</span>
                        <span className="text-[13px] text-muted-foreground ml-1">/maand (ex. btw)</span>
                        {discount > 0 && typeof tier.price === "number" && tier.price > 0 && (
                          <span className="ml-2 text-[12px] text-green-600 font-medium dark:text-green-400">
                            was €{tier.price}
                          </span>
                        )}
                      </>
                    )
                  ) : (
                    <>
                      <span className="text-[22px] font-bold text-foreground">{displayPrice}</span>
                      <span className="text-[13px] text-muted-foreground ml-1">{tier.period}</span>
                    </>
                  )}
                </div>
                <p className="text-[13px] text-muted-foreground mb-4">{tier.description}</p>

                {typeof tier.price === "number" && tier.price > 0 && (
                  <p className="text-[12px] text-primary font-medium mb-4 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Eerste maand gratis</p>
                )}

                <ul className="space-y-1.5 mb-5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className={`w-full text-center py-2.5 rounded-[6px] font-semibold text-[13px] transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "border border-input text-foreground hover:border-primary"
                }`}>
                  {isSelected ? "✓ Geselecteerd" : isCustom ? "Offerte aanvragen" : "Selecteer"}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[12px] text-muted-foreground mt-6">
        Eerste maand gratis. Daarna maandelijks opzegbaar. Jaarcontract = 10% korting. 2-jarig contract = 20% korting.
      </p>
    </div>
  );
}
