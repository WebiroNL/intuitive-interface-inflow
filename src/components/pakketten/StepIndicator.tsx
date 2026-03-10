import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  stepLabels: string[];
  totalSteps: number;
}

export function StepIndicator({ currentStep, stepLabels, totalSteps }: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-12">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between mb-5">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = currentStep > stepNum;
          const isCurrent = currentStep === stepNum;

          return (
            <div key={stepNum} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/15 shadow-md shadow-primary/10"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`text-[11px] mt-2.5 font-medium transition-colors ${
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className="flex-1 mx-4 h-[2px] rounded bg-muted mt-[-1.2rem]">
                  <div
                    className="h-full bg-primary rounded transition-all duration-500 ease-out"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden text-center mb-5">
        <p className="text-[13px] font-medium text-foreground">
          Stap {currentStep} van {totalSteps}
        </p>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          {stepLabels[currentStep - 1]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
