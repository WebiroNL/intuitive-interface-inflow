import type { Client } from "@/hooks/useClient";
import { useAllMonthlyData, totalSpend, fmtEUR, fmtNum } from "@/hooks/useMonthlyData";
import { MONTH_NAMES } from "@/components/client/MonthSelector";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";

interface Props { client: Client }

export default function ClientReports({ client }: Props) {
  const { data, loading } = useAllMonthlyData(client.id);

  const chartData = data.map((d) => ({
    name: `${MONTH_NAMES[d.month - 1].slice(0, 3)} '${String(d.year).slice(2)}`,
    Spend: totalSpend(d),
    Leads: d.total_leads,
    Google: Number(d.google_spend),
    Meta: Number(d.meta_spend),
    TikTok: Number(d.tiktok_spend),
  }));

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Rapporten</p>
        <h1 className="text-2xl font-semibold text-foreground">Performance over tijd</h1>
        <p className="text-sm text-muted-foreground mt-1">Maandelijkse trend van uitgaven en resultaten</p>
      </div>

      {loading ? (
        <div className="h-[400px] bg-muted/40 rounded-lg animate-pulse" />
      ) : data.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">Nog geen rapporten beschikbaar.</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Spend vs Leads</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="left" type="monotone" dataKey="Spend" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="right" type="monotone" dataKey="Leads" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Spend per platform</h2>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Google" fill="#4285F4" />
                  <Bar dataKey="Meta" fill="#0866FF" />
                  <Bar dataKey="TikTok" fill="#FE2C55" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Maandoverzicht</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-[12px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Maand</th>
                    <th className="text-right px-6 py-3 font-medium">Spend</th>
                    <th className="text-right px-6 py-3 font-medium">Leads</th>
                    <th className="text-right px-6 py-3 font-medium">CPA</th>
                    <th className="text-right px-6 py-3 font-medium">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...data].reverse().map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-3 text-foreground">{MONTH_NAMES[d.month - 1]} {d.year}</td>
                      <td className="px-6 py-3 text-right tabular-nums">{fmtEUR(totalSpend(d))}</td>
                      <td className="px-6 py-3 text-right tabular-nums">{fmtNum(d.total_leads)}</td>
                      <td className="px-6 py-3 text-right tabular-nums">{fmtEUR(Number(d.cpa))}</td>
                      <td className="px-6 py-3 text-right tabular-nums">{fmtNum(Number(d.roas), 2)}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
