import { useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon, ArrowDown01Icon, ArrowUp01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { marketingServices } from './pakketten/data';

export function MarketingConfigurator() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const selected = marketingServices.filter(s => selectedServices.includes(s.id));
  const totalSetup = selected.reduce((sum, s) => sum + (s.setupPrice || 0), 0);
  const totalMonthly = selected.reduce((sum, s) => sum + s.monthlyPrice, 0);

  const categoryLabels: Record<string, string> = {
    ads: "Advertenties",
    automation: "Marketing Automation",
    ai: "AI & Support",
  };
  const categories = [...new Set(marketingServices.map(s => s.category))];

  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <h3
        className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
        style={{ fontSize: "clamp(1.3rem, 2vw, 1.6rem)" }}
      >
        <span className="text-foreground">Stel je marketingpakket samen</span>
        <span className="text-primary">.</span>
      </h3>
      <p className="text-[14px] text-muted-foreground mb-8">
        Selecteer de diensten die je nodig hebt en ontvang direct een prijsindicatie.
      </p>

      <div className="space-y-8 mb-8">
        {categories.map(cat => (
          <div key={cat}>
            <h4 className="text-[13px] font-bold text-foreground mb-3 border-b border-border pb-2">
              {categoryLabels[cat]}
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              {marketingServices
                .filter(s => s.category === cat)
                .map((service, i) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => toggleService(service.id)}
                      className={`rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/[0.03] ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                              isSelected ? "bg-primary text-primary-foreground" : "border border-input"
                            }`}>
                              {isSelected && <HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} />}
                            </div>
                            <span className="font-semibold text-foreground text-[13px]">{service.name}</span>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {service.setupPrice && (
                              <p className="text-[11px] text-muted-foreground">€{service.setupPrice} setup</p>
                            )}
                            <p className="text-primary font-bold text-[13px]">€{service.monthlyPrice}/mnd</p>
                          </div>
                        </div>
                        <p className="text-[12px] text-muted-foreground ml-7">{service.description}</p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedId(expandedId === service.id ? null : service.id);
                          }}
                          className="text-[12px] text-primary font-medium flex items-center gap-0.5 mt-2 ml-7 hover:underline"
                        >
                          {expandedId === service.id ? "Minder" : "Wat is inbegrepen"}
                          <HugeiconsIcon icon={expandedId === service.id ? ArrowUp01Icon : ArrowDown01Icon} size={12} />
                        </button>

                        {expandedId === service.id && (
                          <ul className="mt-2 ml-7 space-y-1">
                            {service.features.map(f => (
                              <li key={f} className="flex items-start gap-1.5 text-[12px] text-muted-foreground">
                                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={12} className="text-primary mt-0.5 flex-shrink-0" />
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

      {/* Total & CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border">
        <div>
          {totalSetup > 0 && (
            <p className="text-[13px] text-muted-foreground">
              Eenmalige setup: <span className="font-bold text-foreground">€{totalSetup}</span>
            </p>
          )}
          <p className="text-[13px] text-muted-foreground">
            Maandelijkse kosten
          </p>
          <p className="text-[28px] font-bold text-primary">
            €{totalMonthly}<span className="text-[14px] font-normal text-muted-foreground">/maand</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Ex. BTW en advertentiebudget
          </p>
        </div>

        <Link
          to="/contact"
          className={`inline-flex items-center gap-2 px-6 py-[11px] rounded-[6px] text-[14px] font-semibold transition-all ${
            selectedServices.length > 0
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Plan een strategiecall
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Link>
      </div>
    </div>
  );
}
