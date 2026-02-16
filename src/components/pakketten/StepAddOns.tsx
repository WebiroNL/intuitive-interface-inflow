import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { addOns } from "./data";

interface StepAddOnsProps {
  selected: string[];
  onToggle: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  marketing: "Marketing",
  seo: "SEO & Content",
  functionaliteit: "Functionaliteit",
  onderhoud: "Onderhoud",
};

export function StepAddOns({ selected, onToggle }: StepAddOnsProps) {
  const categories = [...new Set(addOns.map((a) => a.category))];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Kies je add-ons<span className="text-primary">.</span>
      </h2>
      <p className="text-muted-foreground mb-8">
        Breid je website uit met extra diensten. Alles is optioneel.
      </p>

      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-foreground mb-3">{categoryLabels[cat]}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {addOns
                .filter((a) => a.category === cat)
                .map((addon, i) => {
                  const isSelected = selected.includes(addon.id);
                  return (
                    <motion.div
                      key={addon.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => onToggle(addon.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {isSelected ? <Check className="w-5 h-5" /> : addon.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-semibold text-foreground text-sm">{addon.name}</span>
                          <span className="text-primary font-bold text-sm whitespace-nowrap">
                            €{addon.price}
                            <span className="text-xs font-normal text-muted-foreground">
                              /{addon.period === "eenmalig" ? "eenmalig" : "mnd"}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{addon.description}</p>
                      </div>
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
