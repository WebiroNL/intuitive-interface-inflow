import { Check, ChevronDown, ChevronUp, Megaphone, Settings, Bot, Megaphone, Settings, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { marketingServices } from "./data";

interface StepMarketingProps {
  selected: string[];
  onToggle: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  ads: "Advertenties",
  automation: "Marketing Automation",
  ai: "AI & Support",
};

export function StepMarketing({ selected, onToggle }: StepMarketingProps) {
  const categories = [...new Set(marketingServices.map((s) => s.category))];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">Marketing diensten</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Optioneel. Selecteer de diensten waarmee je meer klanten wilt bereiken.
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-[14px] font-bold text-foreground mb-4 border-b border-border pb-2">
              {categoryLabels[cat] || cat}
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {marketingServices
                .filter((s) => s.category === cat)
                .map((service, i) => {
                  const isSelected = selected.includes(service.id);

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => onToggle(service.id)}
                      className={`rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {isSelected ? <Checkcat === "ads" ? <Megaphone className="w-4 h-4" /> : cat === "automation" ? <Settings className="w-4 h-4" /> : <Bot className="w-4 h-4" /tion" ? "AU" : "AI"}</span>}
                            </div>
                            <span className="font-semibold text-foreground text-[13px]">{service.name}</span>
                          </div>
                        </div>

                        <p className="text-[12px] text-muted-foreground mt-1 mb-3">{service.description}</p>

                        <div className="flex flex-wrap gap-2 text-[12px] mb-3">
                          {service.setupPrice && (
                            <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                              Setup: €{service.setupPrice}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                            €{service.monthlyPrice}/mnd
                          </span>
                        </div>

                        {service.features.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(expandedId === service.id ? null : service.id);
                            }}
                            className="text-[12px] text-primary font-medium flex items-center gap-0.5 hover:underline"
                          >
                            {expandedId === service.id ? "Minder" : "Details"}
                            {expandedId === service.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}

                        {expandedId === service.id && (
                          <ul className="mt-2 space-y-1">
                            {service.features.map((f) => (
                              <li key={f} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                                <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[12px] text-muted-foreground mt-6">
        Alle prijzen ex. BTW. Advertentiebudget niet inbegrepen.
      </p>
    </div>
  );
}
