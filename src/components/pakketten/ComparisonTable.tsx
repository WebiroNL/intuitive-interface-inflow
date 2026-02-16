import { Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: "📄", label: "Aantal pagina's", start: "1 pagina", groei: "Tot 5 pagina's", pro: "Tot 10 pagina's" },
  { icon: "🎯", label: "SEO optimalisatie", start: "Start: title tags + meta descriptions", groei: "Groei: 10 zoekwoorden + Google indexering", pro: "Pro: 15+ zoekwoorden + maandrapport" },
  { icon: "🔄", label: "Revisierondes", start: "1 revisieronde", groei: "2 revisierondes", pro: "3 revisierondes" },
  { icon: "⏱️", label: "Opleveringstijd", start: "Binnen 1 week", groei: "Binnen 2 weken", pro: "Binnen 3 weken" },
  { icon: "💰", label: "Investering", start: "€449 ex. BTW", groei: "€749 ex. BTW", pro: "€999 ex. BTW" },
];

const columns = [
  { key: "start", name: "Webiro Start", sub: "Perfect voor starters" },
  { key: "groei", name: "Webiro Groei", sub: "Voor groeiende bedrijven", popular: true },
  { key: "pro", name: "Webiro Pro", sub: "Maximale mogelijkheden" },
];

export function ComparisonTable() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-webiro">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Vergelijk de pakketten<span className="text-primary">.</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Bekijk de verschillen tussen onze pakketten en kies wat het beste bij jouw project past.
          </p>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-foreground w-1/4">Kenmerken</th>
                {columns.map((col) => (
                  <th key={col.key} className={`p-4 text-center ${col.popular ? "bg-primary/5 rounded-t-2xl" : ""}`}>
                    <div className="font-bold text-foreground">{col.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{col.sub}</div>
                    {col.popular && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full mt-2">
                        <Star className="w-3 h-3" /> Populair
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feat, i) => (
                <tr key={feat.label} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="p-4 text-sm text-foreground font-medium">
                    <span className="mr-2">{feat.icon}</span>{feat.label}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground text-center">{feat.start}</td>
                  <td className={`p-4 text-sm text-muted-foreground text-center ${columns[1].popular ? "bg-primary/5" : ""}`}>{feat.groei}</td>
                  <td className="p-4 text-sm text-muted-foreground text-center">{feat.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Cards */}
        <div className="md:hidden space-y-6">
          {columns.map((col) => (
            <div key={col.key} className={`p-5 rounded-2xl border-2 ${col.popular ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <div className="text-center mb-4">
                <h3 className="font-bold text-foreground">{col.name}</h3>
                <p className="text-xs text-muted-foreground">{col.sub}</p>
                {col.popular && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full mt-2">
                    <Star className="w-3 h-3" /> Populair
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {features.map((feat) => (
                  <div key={feat.label} className="flex justify-between items-start gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {feat.icon} {feat.label}
                    </span>
                    <span className="text-xs font-medium text-foreground text-right">
                      {feat[col.key as keyof typeof feat]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
