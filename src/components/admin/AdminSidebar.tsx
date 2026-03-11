import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import webiroLogo from '@/assets/logo-webiro.svg';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  ShoppingCart01Icon,
  UserGroup02Icon,
  BarChartIcon,
  Settings01Icon,
  Logout01Icon,
  Package01Icon,
  MessageMultiple01Icon,
  PlugSocketIcon,
  PaintBrushIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: 'Overzicht', href: '/admin', icon: DashboardSquare01Icon },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart01Icon },
  { label: 'Leads', href: '/admin/leads', icon: UserGroup01Icon },
  { label: 'Statistieken', href: '/admin/stats', icon: BarChart01Icon },
  { label: 'Berichten', href: '/admin/messages', icon: MessageMultiple01Icon },
  { label: 'Producten', href: '/admin/products', icon: Package01Icon },
  { label: 'Integraties', href: '/admin/integrations', icon: PlugSocket01Icon },
  { label: 'Moodboards', href: '/admin/moodboards', icon: PaintBrushIcon },
  { label: 'Instellingen', href: '/admin/settings', icon: Settings01Icon },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isActive = (href: string) =>
    href === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(href);

  return (
    <aside className="w-[240px] h-screen bg-card border-r border-border flex flex-col flex-shrink-0 sticky top-0">
      <div className="h-[60px] flex items-center px-5 border-b border-border">
        <Link to="/admin">
          <img src={webiroLogo} alt="Webiro" className="h-[22px]" />
        </Link>
        <span className="ml-2 text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          Admin
        </span>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <HugeiconsIcon icon={item.icon} size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <div className="px-3 py-1.5">
          <p className="text-[12px] font-medium text-foreground truncate">{user?.email}</p>
          <p className="text-[11px] text-muted-foreground">Administrator</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} />
          Uitloggen
        </button>
      </div>
    </aside>
  );
}
