import type { Client } from "@/hooks/useClient";
import { fmtEUR } from "@/hooks/useMonthlyData";

interface Props { client: Client }

export default function ClientAccount({ client }: Props) {
  return (
    <div className="p-6 lg:p-8 max-w-[800px]">
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Account</p>
        <h1 className="text-2xl font-semibold text-foreground">Bedrijfsgegevens</h1>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="divide-y divide-border">
          <Row label="Bedrijfsnaam" value={client.company_name} />
          <Row label="Contactpersoon" value={client.contact_person ?? "—"} />
          <Row label="E-mail" value={client.email} />
          <Row label="Telefoon" value={client.phone ?? "—"} />
          <Row label="Contractduur" value={client.contract_duration ?? "—"} />
          <Row label="Maandelijkse fee" value={fmtEUR(Number(client.monthly_fee))} />
          <Row label="Status" value={client.active ? "Actief" : "Inactief"} />
        </div>
      </div>

      <p className="text-[12px] text-muted-foreground mt-4">
        Wijzigingen doorgeven? Mail je accountmanager bij Webiro.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-1">
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
