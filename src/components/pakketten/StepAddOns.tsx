import { Check, ChevronDown, ChevronUp, Wrench, Calendar, MessageCircle, Megaphone, Globe, Mail, BarChart3, Bot, CalendarCheck, Link, Palette, Lightbulb, Sparkles, Shield, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { addOns, addOnCategoryLabels, contractDiscounts } from "./data";
import { ContractDuration } from "./types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: Wrench, calendar: Calendar, "message-circle": MessageCircle, megaphone: Megaphone,
  globe: Globe, mail: Mail, "bar-chart-3": BarChart3, bot: Bot, "calendar-check": CalendarCheck,
  link: Link, palette: Palette, lightbulb: Lightbulb, sparkles: Sparkles, shield: Shield, "pen-tool": PenTool,
};

function AddonIcon({ name }: { name: string }) {
  const Icon = iconMap[name];
  return Icon ? <Icon className="w-4 h-4" /> : null;
}

interface StepAddOnsProps {
  selected: string[];
  onToggle: (id: string) => void;
  contractDuration: ContractDuration;
  onContractChange: (d: ContractDuration) => void;
}

export function StepAddOns({ selected, onToggle, contractDuration, onContractChange }: StepAddOnsProps) {
  const categories = [...new Set(addOns.map((a) => a.category))];
  const [expandedAddon, setExpandedAddon] = useState<string | null>(null);
  const discount = contractDiscounts[contractDuration].discount;

  return (
    <div>
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">Kies je add-ons</span>
          <span className="text-primary">.</span>
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Optioneel. Breid je website uit met extra diensten en widgets.
        </p>
      </div>

      {/* Contract duration (applies to monthly add-ons too) */}
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

      <div className="space-y-10">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-[14px] font-bold text-foreground mb-4 border-b border-border pb-2">
              {addOnCategoryLabels[cat] || cat}
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {addOns
                .filter((a) => a.category === cat)
                .map((addon, i) => {
                  const isSelected = selected.includes(addon.id);
                  const isCustomPrice = typeof addon.price === "string";
                  const displayPrice = !isCustomPrice && addon.period === "per maand" && typeof addon.price === "number"
                    ? Math.round((addon.price as number) * (1 - discount))
                    : addon.price;

                  return (
                    <motion.div
                      key={addon.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => !isCustomPrice && onToggle(addon.id)}
                      className={`rounded-xl border transition-all ${isCustomPrice ? "cursor-default" : "cursor-pointer"} ${
                        isSelected
                          ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isSelected ? <Check className="w-4 h-4" /> : <AddonIcon name={addon.icon} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <span className="font-semibold text-foreground text-[13px]">{addon.name}</span>
                            <span className="text-primary font-bold text-[13px] whitespace-nowrap">
                              {isCustomPrice ? (
                                <span>{addon.price}</span>
                              ) : (
                                <>€{displayPrice}<span className="text-[11px] font-normal text-muted-foreground">/{addon.period === "eenmalig" ? "eenmalig" : "mnd"}</span></>
                              )}
                            </span>
                          </div>
                          <p className="text-[12px] text-muted-foreground mt-0.5">{addon.description}</p>

                          {addon.features && addon.features.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedAddon(expandedAddon === addon.id ? null : addon.id);
                              }}
                              className="text-[12px] text-primary font-medium flex items-center gap-0.5 mt-2 hover:underline"
                            >
                              {expandedAddon === addon.id ? "Minder" : "Details"}
                              {expandedAddon === addon.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {expandedAddon === addon.id && addon.features && (
                        <div className="px-4 pb-4 pt-0 ml-12">
                          <ul className="space-y-1">
                            {addon.features.map((f) => (
                              <li key={f} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                                <Check className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
