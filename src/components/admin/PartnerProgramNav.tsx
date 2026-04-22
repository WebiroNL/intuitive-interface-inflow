import { Link, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Coins01Icon,
  CreditCardIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";

const tabs = [
  { label: "Partners", href: "/admin/partners", icon: UserGroupIcon },
  { label: "Commissies", href: "/admin/partner-commissions", icon: Coins01Icon },
  { label: "Uitbetalingen", href: "/admin/partner-payouts", icon: CreditCardIcon },
  { label: "Tiers", href: "/admin/partner-tiers", icon: StarIcon },
];

export function PartnerProgramNav() {
  const location = useLocation();
  return (
    <div className="flex items-center gap-1 flex-wrap border-b border-border -mb-px">
      {tabs.map((t) => {
        const active = location.pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            to={t.href}
            className={`flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <HugeiconsIcon icon={t.icon} size={14} />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
