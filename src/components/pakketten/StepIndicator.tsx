import { Check } from "lucide-react";

const steps = [
  { num: 1, label: "Website pakket" },
  { num: 2, label: "CMS & Hosting" },
  { num: 3, label: "Add-ons" },
  { num: 4, label: "Briefing" },
  { num: 5, label: "Overzicht" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="mb-10">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between mb-4">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep > step.num
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.num
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.num ? <Check className="w-5 h-5" /> : step.num}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  currentStep >= step.num ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-3 h-0.5 rounded bg-muted mt-[-1rem]">
                <div
                  className="h-full bg-primary rounded transition-all duration-500"
                  style={{ width: currentStep > step.num ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Stap {currentStep} van {steps.length} — {Math.round(progress)}% voltooid
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
