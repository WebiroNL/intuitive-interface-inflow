import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import type { Client } from "@/hooks/useClient";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon, Logout01Icon, Settings02Icon, Sun03Icon, Moon02Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  client: Client;
  onMenuClick?: () => void;
}

const TITLES: Record<string, string> = {
  "": "Dashboard",
  campaigns: "Campagnes",
  finance: "Financieel",
  reports: "Rapporten",
  contract: "Contract",
  invoices: "Facturen",
  files: "Bestanden",
  updates: "Updates",
  account: "Account",
};

export function ClientTopBar({ client }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const segment = location.pathname.replace(/^\/dashboard\/?/, "").split("/")[0] ?? "";
  const title = TITLES[segment] ?? "Dashboard";

  const initials = (client.contact_person ?? client.company_name)
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="h-[60px] sticky top-0 z-30 bg-card border-b border-border flex items-center justify-between px-6">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-none">Klantportaal</p>
        <h1 className="text-[15px] font-semibold text-foreground leading-tight">{title}</h1>
      </div>

      <DropdownMenu>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
            className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <HugeiconsIcon icon={theme === "dark" ? Sun03Icon : Moon02Icon} size={16} />
          </button>
          <DropdownMenuTrigger className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted/60 transition-colors outline-none">
            <div className="text-right hidden sm:block">
              <p className="text-[13px] font-semibold text-foreground leading-tight">
                {client.contact_person ?? client.company_name}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">{client.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-semibold">
              {initials || <HugeiconsIcon icon={UserCircleIcon} size={18} />}
            </div>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-[13px] font-semibold text-foreground truncate">{client.company_name}</p>
            <p className="text-[11px] font-normal text-muted-foreground truncate">{client.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/dashboard/account")}>
            <HugeiconsIcon icon={Settings02Icon} size={14} className="mr-2" />
            Accountinstellingen
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <HugeiconsIcon icon={Logout01Icon} size={14} className="mr-2" />
            Uitloggen
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
