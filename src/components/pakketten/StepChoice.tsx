import { motion } from "framer-motion";
import { Globe, Megaphone } from "lucide-react";

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
      <div className="mb-8">
        <h2
          className="font-bold tracking-[-0.025em] leading-[1.1] mb-2"
          style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}
        >
          <span className="text-foreground">Wat heb je nodig</span>
          <span className="text-primary">?</span>
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Selecteer wat het beste bij jouw situatie past. We leiden je door de juiste stappen.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-3xl">
        {options.map((option, index) => {
          const isSelected = selected === option.id;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onSelect(option.id)}
              className={`relative rounded-2xl border-2 transition-all cursor-pointer overflow-hidden p-7 ${
                isSelected
                  ? "border-primary bg-primary/[0.03] shadow-md"
                  : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <option.icon className="w-6 h-6" />
              </div>

              <h3 className="text-[18px] font-bold text-foreground mb-2">{option.title}</h3>
              <p className="text-[13px] text-muted-foreground mb-5 leading-relaxed">{option.description}</p>

              <ul className="space-y-2">
                {option.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div
                className={`mt-6 w-full text-center py-2.5 rounded-[6px] font-semibold text-[13px] transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "border border-input text-foreground hover:border-primary"
                }`}
              >
                {isSelected ? "✓ Geselecteerd" : "Selecteer"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
