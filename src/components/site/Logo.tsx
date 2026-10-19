import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} aria-label="Clinic Copilot, accueil">
      <span className={cn("grid h-10 w-10 shrink-0 place-items-center", dark && "rounded-xl bg-card p-1")}>
        <img src={logo} alt="" width={695} height={572} className="h-full w-full object-contain" />
      </span>
      <span className={cn("text-lg font-bold tracking-tight", dark ? "text-deep-foreground" : "text-deep")}>
        Clinic <span className={dark ? "text-tertiary" : "text-primary"}>Copilot</span>
      </span>
    </Link>
  );
}
