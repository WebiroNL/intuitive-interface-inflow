import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  stepLabels: string[];
  totalSteps: number;
}

export function StepIndicator({ currentStep, stepLabels, totalSteps }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-10">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between mb-4">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                    currentStep > stepNum
                      ? "bg-primary text-primary-foreground"
                      : currentStep === stepNum
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`text-[11px] mt-2 font-medium ${
                    currentStep >= stepNum ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className="flex-1 mx-3 h-[2px] rounded bg-muted mt-[-1rem]">
                  <div
                    className="h-full bg-primary rounded transition-all duration-500"
                    style={{ width: currentStep > stepNum ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden text-center mb-4">
        <p className="text-[13px] text-muted-foreground">
          Stap {currentStep} van {totalSteps} — {Math.round(progress)}% voltooid
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
