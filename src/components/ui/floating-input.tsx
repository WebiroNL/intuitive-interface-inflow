import * as React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";

interface FloatingInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  showPasswordToggle?: boolean;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type = "text", label, id, value, defaultValue, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const isPassword = type === "password";
    const effectiveType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          type={effectiveType}
          value={value}
          defaultValue={defaultValue}
          placeholder=" "
          className={cn(
            "peer h-14 w-full rounded-lg border border-input bg-background px-3 pt-5 pb-1.5 text-[15px] text-foreground",
            "placeholder-transparent ring-offset-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 focus:border-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isPassword && showPasswordToggle ? "pr-11" : "",
            className,
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-3 text-muted-foreground transition-all duration-150",
            "top-1/2 -translate-y-1/2 text-[15px]",
            "peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:text-primary",
            "peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[11px]",
          )}
        >
          {label}
        </label>
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
          >
            <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} size={18} />
          </button>
        )}
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
