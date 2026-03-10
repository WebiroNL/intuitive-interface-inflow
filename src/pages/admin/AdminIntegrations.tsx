import { Card } from '@/components/ui/card';
import { CheckCircle2, ExternalLink } from 'lucide-react';

const integrations = [
  {
    name: 'Shopify',
    description: 'E-commerce platform voor NFC-producten',
    status: 'Verbonden',
    connected: true,
  },
  {
    name: 'Lovable Cloud',
    description: 'Database, authenticatie en edge functions',
    status: 'Actief',
    connected: true,
  },
  {
    name: 'Firecrawl',
    description: 'Web scraping en crawling API',
    status: 'Verbonden',
    connected: true,
  },
  {
    name: 'Google Analytics',
    description: 'Website analytics en rapportage',
    status: 'Niet verbonden',
    connected: false,
  },
  {
    name: 'Mailchimp',
    description: 'E-mail marketing en automatisering',
    status: 'Niet verbonden',
    connected: false,
  },
];

const AdminIntegrations = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Integraties</h1>
        <p className="text-sm text-muted-foreground mt-1">Beheer je externe tools en koppelingen</p>
      </div>

      <div className="grid gap-4">
        {integrations.map((int) => (
          <Card key={int.name} className="border border-border p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${int.connected ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{int.name}</p>
                <p className="text-xs text-muted-foreground">{int.description}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              int.connected
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}>
              {int.status}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminIntegrations;
