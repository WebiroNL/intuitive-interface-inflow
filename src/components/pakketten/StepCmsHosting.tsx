import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cmsOptions, hostingOptions } from "./data";

interface StepCmsHostingProps {
  selectedCms: string | null;
  selectedHosting: string | null;
  onSelectCms: (id: string) => void;
  onSelectHosting: (id: string) => void;
}

export function StepCmsHosting({ selectedCms, selectedHosting, onSelectCms, onSelectHosting }: StepCmsHostingProps) {
  return (
    <div className="space-y-12">
      {/* CMS */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Content Management Systeem<span className="text-primary">.</span>
        </h2>
        <p className="text-muted-foreground mb-6">
          Wil je zelf je website kunnen aanpassen? Kies een CMS dat bij je past.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {cmsOptions.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectCms(opt.id)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedCms === opt.id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {opt.recommended && (
                <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  <Star className="w-3 h-3" /> Aanbevolen
                </span>
              )}
              <h3 className="font-bold text-foreground">{opt.name}</h3>
              <p className="text-2xl font-bold text-foreground mt-2">
                {opt.price === 0 ? "Gratis" : `€${opt.price}`}
                {opt.price > 0 && <span className="text-sm font-normal text-muted-foreground ml-1">eenmalig</span>}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{opt.description}</p>
              <ul className="mt-4 space-y-1.5">
                {opt.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className={`mt-4 text-center py-2 rounded-xl text-sm font-semibold ${
                selectedCms === opt.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground"
              }`}>
                {selectedCms === opt.id ? "✓ Geselecteerd" : "Selecteer"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hosting */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Hosting & Domein<span className="text-primary">.</span>
        </h2>
        <p className="text-muted-foreground mb-6">
          Kies een hostingpakket voor je website. Alle pakketten inclusief SSL en backups.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {hostingOptions.map((opt, i) => (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectHosting(opt.id)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedHosting === opt.id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {opt.recommended && (
                <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  <Star className="w-3 h-3" /> Aanbevolen
                </span>
              )}
              <h3 className="font-bold text-foreground">{opt.name}</h3>
              <p className="text-2xl font-bold text-foreground mt-2">
                €{opt.price}<span className="text-sm font-normal text-muted-foreground ml-1">{opt.period}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">{opt.description}</p>
              <ul className="mt-4 space-y-1.5">
                {opt.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className={`mt-4 text-center py-2 rounded-xl text-sm font-semibold ${
                selectedHosting === opt.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground"
              }`}>
                {selectedHosting === opt.id ? "✓ Geselecteerd" : "Selecteer"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
