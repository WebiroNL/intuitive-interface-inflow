import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Package01Icon,
  LinkSquare01Icon,
  ShoppingCart01Icon,
  Tag01Icon,
  ChartBarLineIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from '@/components/ui/button';

const SHOPIFY_ADMIN = "https://admin.shopify.com";

const quickLinks = [
  {
    title: "Producten",
    description: "Voeg nieuwe producten toe, bewerk varianten, prijzen en voorraad.",
    icon: Package01Icon,
    href: `${SHOPIFY_ADMIN}/store/products`,
    cta: "Producten beheren",
  },
  {
    title: "Bestellingen",
    description: "Bekijk en verwerk binnenkomende bestellingen vanuit je webshop.",
    icon: ShoppingCart01Icon,
    href: `${SHOPIFY_ADMIN}/store/orders`,
    cta: "Bestellingen openen",
  },
  {
    title: "Kortingen",
    description: "Maak kortingscodes en automatische acties voor je shop.",
    icon: Tag01Icon,
    href: `${SHOPIFY_ADMIN}/store/discounts`,
    cta: "Kortingen beheren",
  },
  {
    title: "Analytics",
    description: "Inzichten in verkopen, bezoekers en conversie van je shop.",
    icon: ChartBarLineIcon,
    href: `${SHOPIFY_ADMIN}/store/analytics`,
    cta: "Analytics openen",
  },
];

const AdminProducts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-end gap-4 flex-wrap">
        <Button className="gap-2" asChild>
          <a href={SHOPIFY_ADMIN} target="_blank" rel="noopener noreferrer">
            Open Shopify Admin <HugeiconsIcon icon={LinkSquare01Icon} size={14} />
          </a>
        </Button>
      </div>

      <Card className="border border-border p-8 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <HugeiconsIcon icon={Package01Icon} size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">Webshop draait op Shopify</h2>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
              Alle producten in <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-[12px]">/shop</code> komen rechtstreeks uit Shopify. Voeg een product toe in Shopify en het verschijnt direct in je webshop.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Card key={link.title} className="border border-border p-5 flex flex-col">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-md bg-muted text-foreground">
                <HugeiconsIcon icon={link.icon} size={18} />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold text-foreground">{link.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1">{link.description}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-auto self-start gap-2" asChild>
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.cta} <HugeiconsIcon icon={LinkSquare01Icon} size={12} />
              </a>
            </Button>
          </Card>
        ))}
      </div>

      <Card className="border border-border p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-muted text-foreground flex-shrink-0">
            <HugeiconsIcon icon={Settings01Icon} size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-[14px] font-semibold text-foreground">Hulp nodig met een product?</h3>
            <p className="text-[13px] text-muted-foreground mt-1">
              Stuur me in de chat de naam, prijs en beschrijving van je product. Ik maak het direct aan in Shopify.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminProducts;
