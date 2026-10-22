import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronsLeft, LogOut, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { bottomLinks, notificationCount, sidebarLinks } from "@/data/patient";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

function useIsActive() {
  const path = useRouterState({ select: (s) => s.location.pathname.replace(/\/$/, "") });
  return (to: string) => (to === "/espace-patient" ? path === to : path.startsWith(to));
}

export function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export function SidebarNav({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const isActive = useIsActive();
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-deep text-deep-foreground transition-[width] duration-300 ease-out md:flex", collapsed ? "w-[76px]" : "w-64")}>
      <div className="flex h-16 items-center gap-2.5 overflow-hidden px-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card p-1"><img src={logo} alt="" className="h-full w-full object-contain" /></span>
        <span className={cn("whitespace-nowrap font-bold transition-opacity duration-200", collapsed && "opacity-0")}>Clinic <span className="text-tertiary">Copilot</span></span>
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-3" aria-label="Navigation de l'espace patient">
        {sidebarLinks.map(({ label, to, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link key={to} to={to} title={collapsed ? label : undefined} aria-current={active ? "page" : undefined}
              className={cn("flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-tertiary",
                active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-deep-foreground/70 hover:bg-deep-muted hover:text-deep-foreground")}>
              <Icon className="h-5 w-5 shrink-0" />
              <span className={cn("whitespace-nowrap transition-opacity duration-200", collapsed && "opacity-0")}>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-deep-foreground/10 p-3">
        <button onClick={onToggle} aria-label={collapsed ? "Déplier la barre latérale" : "Réduire la barre latérale"}
          className="flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm text-deep-foreground/70 hover:bg-deep-muted hover:text-deep-foreground focus-visible:outline-2 focus-visible:outline-tertiary">
          <ChevronsLeft className={cn("h-5 w-5 shrink-0 transition-transform duration-300", collapsed && "rotate-180")} />
          <span className={cn("whitespace-nowrap transition-opacity duration-200", collapsed && "opacity-0")}>Réduire</span>
        </button>
        <button onClick={() => { logout(); navigate({ to: "/" }); }} aria-label="Se déconnecter"
          className="flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm text-deep-foreground/70 hover:bg-destructive/20 hover:text-deep-foreground focus-visible:outline-2 focus-visible:outline-tertiary">
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity duration-200", collapsed && "opacity-0")}>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Navigation mobile" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {bottomLinks.map(({ label, to, icon: Icon }) => {
        const active = isActive(to);
        return (
          <Link key={to} to={to} aria-current={active ? "page" : undefined}
            className={cn("flex flex-col items-center gap-1 py-2.5 text-xs font-medium", active ? "text-primary" : "text-muted-foreground")}>
            <Icon className="h-5 w-5" />{label}
          </Link>
        );
      })}
    </nav>
  );
}

function NotificationBell() {
  return (
    <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Notifications, ${notificationCount} non lues`}>
      <Bell className="h-5 w-5" />
      <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{notificationCount}</span>
    </Button>
  );
}

function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
      {/* Mobile */}
      <div className="flex h-14 items-center justify-between px-4 md:hidden">
        <Link to="/espace-patient" className="flex items-center gap-2"><img src={logo} alt="" className="h-8 w-8 object-contain" /><span className="font-bold text-deep">Clinic <span className="text-primary">Copilot</span></span></Link>
        <NotificationBell />
      </div>
      {/* Desktop */}
      <div className="hidden h-16 items-center gap-4 px-6 md:flex">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" aria-label="Rechercher" placeholder="Rechercher un médecin, une spécialité..." className="h-10 rounded-full bg-card pl-9" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-soft focus-visible:outline-2 focus-visible:outline-ring" aria-label="Menu du compte">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">{initials(user.firstName, user.lastName)}</span>
              <span className="text-sm font-semibold text-deep">{user.firstName}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal"><p className="font-semibold">{user.firstName} {user.lastName}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate({ to: "/espace-patient/profil" })}><User />Mon profil</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => { logout(); navigate({ to: "/" }); }}><LogOut />Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function PatientLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <SidebarNav collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-12 md:pt-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
