import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserCircleIcon, Logout01Icon, Sun03Icon, Moon02Icon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Partner {
  company_name: string;
  contact_person: string;
  email: string;
  tier: string;
}

interface Props {
  partner: Partner;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

const TITLES: Record<string, string> = {
  "": "Overzicht",
  referrals: "Referrals",
  commissions: "Commissies",
  payouts: "Uitbetalingen",
  assets: "Materiaal",
  profile: "Profiel",
};

export function PartnerTopBar({ partner, onMenuClick, isSidebarOpen }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const segment = location.pathname.replace(/^\/partner\/dashboard\/?/, "").split("/")[0] ?? "";
  const title = TITLES[segment] ?? "Overzicht";

  const initials = (partner.contact_person ?? partner.company_name)
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await signOut();
    navigate("/partner/login");
  };

  return (
    <header className="h-[60px] sticky top-0 z-30 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label={isSidebarOpen ? "Sluit menu" : "Open menu"}
          className="md:hidden w-9 h-9 -ml-1 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex-shrink-0"
        >
          <HugeiconsIcon icon={isSidebarOpen ? Cancel01Icon : Menu01Icon} size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground leading-none">Partnerportaal</p>
          <h1 className="text-[15px] font-semibold text-foreground leading-tight truncate">{title}</h1>
        </div>
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
                {partner.contact_person ?? partner.company_name}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">{partner.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-semibold">
              {initials || <HugeiconsIcon icon={UserCircleIcon} size={18} />}
            </div>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="text-[13px] font-semibold text-foreground truncate">{partner.company_name}</p>
            <p className="text-[11px] font-normal text-muted-foreground truncate">{partner.email}</p>
          </DropdownMenuLabel>
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
