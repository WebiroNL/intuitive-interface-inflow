import { motion } from "framer-motion";
import { Globe, Megaphone, Check, ArrowRight } from "lucide-react";

export type FlowType = "website" | "marketing";

interface StepChoiceProps {
  selected: FlowType | null;
  onSelect: (flow: FlowType) => void;
}

const options = [
  {
    id: "website" as FlowType,
    icon: Globe,
    title: "Ik heb nog geen website",
    description: "Ik wil een professionele website laten bouwen, inclusief hosting, add-ons en eventueel marketing.",
    features: [
      "Website design & ontwikkeling",
      "CMS & hosting naar keuze",
      "Optionele add-ons & marketing",
    ],
  },
  {
    id: "marketing" as FlowType,
    icon: Megaphone,
    title: "Ik heb al een website",
    description: "Ik wil meer klanten via online marketing: advertenties, automation en AI-tools.",
    features: [
      "Google, Meta & TikTok Ads",
      "E-mail & WhatsApp automation",
      "AI chatbot & lead kwalificatie",
    ],
  },
];

export function StepChoice({ selected, onSelect }: StepChoiceProps) {
  return (
    <div>
      <div className="mb-10">
        <h2
          className="font-bold tracking-[-0.03em] leading-[1.08] mb-3"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          <span className="text-foreground">Wat heb je nodig</span>
          <span className="text-primary">?</span>
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg">
          Selecteer wat het beste bij jouw situatie past. We leiden je door de juiste stappen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 w-full">
        {options.map((option, index) => {
          const isSelected = selected === option.id;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              onClick={() => onSelect(option.id)}
              className={`group relative rounded-2xl border-2 transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
              }`}
            >
              <div className="p-7">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <option.icon className="w-6 h-6" />
                </div>

                <h3 className="text-[18px] font-bold text-foreground mb-2 tracking-[-0.01em]">{option.title}</h3>
                <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">{option.description}</p>

                <ul className="space-y-2.5 mb-6">
                  {option.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-[13px] transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground group-hover:border-primary/40 group-hover:text-primary"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      Geselecteerd
                    </>
                  ) : (
                    <>
                      Selecteer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
