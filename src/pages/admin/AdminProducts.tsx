import { Card } from '@/components/ui/card';
import { Package, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminProducts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Producten</h1>
        <p className="text-sm text-muted-foreground mt-1">NFC-producten worden beheerd via Shopify</p>
      </div>

      <Card className="border border-border p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
          <Package size={32} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Shopify Productbeheer</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Je NFC-producten worden beheerd via je Shopify dashboard. Alle wijzigingen worden automatisch gesynchroniseerd met de webshop.
        </p>
        <Button variant="outline" className="mt-4 gap-2" asChild>
          <a href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer">
            Open Shopify <ExternalLink size={14} />
          </a>
        </Button>
      </Card>
    </div>
  );
};

export default AdminProducts;
