import { Star, FileText, Target, RefreshCw, Clock, Coins } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: FileText, label: "Aantal pagina's", start: "1 pagina", groei: "Tot 5 pagina's", pro: "Tot 10 pagina's" },
  { icon: Target, label: "SEO optimalisatie", start: "Title tags + meta", groei: "10 zoekwoorden + indexering", pro: "15+ zoekwoorden + rapport" },
  { icon: RefreshCw, label: "Revisierondes", start: "1 revisieronde", groei: "2 revisierondes", pro: "3 revisierondes" },
  { icon: Clock, label: "Opleveringstijd", start: "Binnen 1 week", groei: "Binnen 2 weken", pro: "Binnen 3 weken" },
  { icon: Coins, label: "Investering", start: "€449 ex. BTW", groei: "€749 ex. BTW", pro: "€999 ex. BTW" },
];

const columns = [
  { key: "start", name: "Webiro Start", sub: "Perfect voor starters" },
  { key: "groei", name: "Webiro Groei", sub: "Voor groeiende bedrijven", popular: true },
  { key: "pro", name: "Webiro Pro", sub: "Maximale mogelijkheden" },
];

export function ComparisonTable() {
  return (
    <section className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">
            Vergelijking
          </p>
          <h2
            className="font-bold tracking-[-0.03em] leading-[1.1]"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
          >
            <span className="text-foreground">Vergelijk de pakketten</span>
            <span className="text-primary">.</span>
          </h2>
          <p className="text-[15px] text-muted-foreground mt-3 max-w-xl leading-relaxed">
            Bekijk de verschillen en kies wat het beste bij jouw project past.
          </p>
        </motion.div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-5 text-[13px] font-semibold text-foreground w-[28%]">Kenmerken</th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`p-5 text-center ${col.popular ? "bg-primary/[0.03]" : ""}`}
                    >
                      <div className="font-bold text-foreground text-[15px]">{col.name}</div>
                      <div className="text-[12px] text-muted-foreground mt-1">{col.sub}</div>
                      {col.popular && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full mt-2">
                          <Star className="w-3 h-3" /> Populair
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <tr key={feat.label} className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-muted/20" : "bg-card"}`}>
                      <td className="p-5 text-[13px] text-foreground font-medium">
                        <span className="inline-flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          {feat.label}
                        </span>
                      </td>
                      <td className="p-5 text-[13px] text-muted-foreground text-center">{feat.start}</td>
                      <td className={`p-5 text-[13px] text-muted-foreground text-center ${columns[1].popular ? "bg-primary/[0.03]" : ""}`}>{feat.groei}</td>
                      <td className="p-5 text-[13px] text-muted-foreground text-center">{feat.pro}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {columns.map((col) => (
            <div
              key={col.key}
              className={`rounded-2xl border-2 p-5 ${
                col.popular ? "border-primary bg-primary/[0.03]" : "border-border bg-card"
              }`}
            >
              <div className="text-center mb-5">
                <h3 className="font-bold text-foreground text-[16px]">{col.name}</h3>
                <p className="text-[12px] text-muted-foreground mt-0.5">{col.sub}</p>
                {col.popular && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-primary text-primary-foreground text-[11px] font-semibold rounded-full mt-2">
                    <Star className="w-3 h-3" /> Populair
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.label} className="flex justify-between items-start gap-3">
                      <span className="text-[12px] text-muted-foreground flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        {feat.label}
                      </span>
                      <span className="text-[12px] font-medium text-foreground text-right">
                        {feat[col.key as keyof typeof feat] as string}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
