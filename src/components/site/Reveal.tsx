import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, text, light }: { eyebrow?: string; title: string; text?: string; light?: boolean }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      {eyebrow && <p className={cn("mb-3 text-sm font-semibold uppercase tracking-widest", light ? "text-tertiary" : "text-primary")}>{eyebrow}</p>}
      <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", light ? "text-deep-foreground" : "text-deep")}>{title}</h2>
      {text && <p className={cn("mt-4 text-lg", light ? "text-deep-foreground/70" : "text-muted-foreground")}>{text}</p>}
    </Reveal>
  );
}
