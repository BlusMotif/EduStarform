import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
  shortLabel?: string;
}

const steps: Step[] = [
  { number: 1, label: "Personal Details", shortLabel: "Personal" },
  { number: 2, label: "Educational Background", shortLabel: "Education" },
  { number: 3, label: "Challenges & Insights", shortLabel: "Challenges" },
  { number: 4, label: "Emergency Contact", shortLabel: "Emergency" },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative flex-1">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                  ${
                    currentStep > step.number
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.number
                      ? "bg-card border-2 border-primary text-primary"
                      : "bg-muted text-muted-foreground border border-border"
                  }
                `}
                data-testid={`step-indicator-${step.number}`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-2 text-xs sm:text-sm font-medium text-center">
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel || step.label}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                  h-0.5 flex-1 mx-2 transition-all duration-200
                  ${currentStep > step.number ? "bg-primary" : "bg-border"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
