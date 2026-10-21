import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { passwordStrength } from "@/lib/auth";

export const PasswordInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input ref={ref} type={show ? "text" : "password"} className={cn("pr-11", className)} {...props} />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

const levels = [
  { label: "Très faible", bar: "bg-destructive" },
  { label: "Faible", bar: "bg-destructive" },
  { label: "Moyen", bar: "bg-warning" },
  { label: "Bon", bar: "bg-tertiary" },
  { label: "Excellent", bar: "bg-success" },
];

export function PasswordStrength({ value }: { value: string }) {
  const s = passwordStrength(value);
  const lvl = levels[s]!;
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full", i <= s ? lvl.bar : "bg-muted")} />)}
      </div>
      {value && <p className="mt-1 text-xs text-muted-foreground">Robustesse : <span className="font-semibold text-foreground">{lvl.label}</span></p>}
    </div>
  );
}
