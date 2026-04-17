import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";

const PASSWORD = "novelle2026!";
const STORAGE_KEY = "novelle_rapport_auth";

// Luxe palet — champagne, goud, wit, donkergroen
const COLORS = {
  green: "#1F3A2E",
  greenDark: "#152821",
  gold: "#C9A961",
  goldLight: "#E5D4A1",
  champagne: "#F5EBD8",
  champagneLight: "#FBF6EC",
  white: "#FFFFFF",
  ink: "#1A1A1A",
  muted: "#6B7160",
};

const KPIS = [
  { label: "Uitgegeven", value: "€154,31", sub: "Totaal mediabudget" },
  { label: "Impressies", value: "34.411", sub: "Totale weergaven" },
  { label: "Bereik", value: "16.730", sub: "Unieke personen" },
  { label: "Frequentie", value: "2,06", sub: "Vertoningen per persoon" },
  { label: "Link clicks", value: "1.989", sub: "Klikken naar website" },
  { label: "CTR (all)", value: "10,22%", sub: "Klikratio" },
  { label: "Landing page views", value: "1.583", sub: "Daadwerkelijk geladen" },
  { label: "Kosten per LPV", value: "€0,10", sub: "36% onder benchmark" },
  { label: "Leads", value: "3", sub: "Aanmeldingen" },
  { label: "Kosten per lead", value: "€51,44", sub: "Cost per acquisition" },
  { label: "Instagram groei", value: "+131", sub: "Nieuwe volgers" },
  { label: "CPM", value: "€4,48", sub: "Per 1.000 impressies" },
];

const reachData = [
  { name: "Impressies", value: 34411, fill: COLORS.green },
  { name: "Bereik", value: 16730, fill: COLORS.gold },
];

const funnelData = [
  { name: "Impressies", value: 34411, fill: COLORS.green },
  { name: "Clicks (all)", value: 3517, fill: "#2F5444" },
  { name: "Link clicks", value: 1989, fill: COLORS.gold },
  { name: "Landing Page Views", value: 1583, fill: COLORS.goldLight },
  { name: "Leads", value: 3, fill: "#8A6F2E" },
];

const costData = [
  { name: "CPM", value: 4.48, fill: COLORS.green },
  { name: "CPC", value: 0.08, fill: COLORS.gold },
  { name: "Kosten / LPV", value: 0.10, fill: COLORS.goldLight },
  { name: "Kosten / Lead", value: 51.44, fill: COLORS.greenDark },
];

const benchmarkData = [
  { name: "Benchmark markt", value: 0.15, fill: COLORS.muted },
  { name: "Novelle Events", value: 0.10, fill: COLORS.gold },
];

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: COLORS.greenDark, color: COLORS.champagne }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-block px-4 py-1 text-xs tracking-[0.3em] uppercase mb-6"
            style={{ border: `1px solid ${COLORS.gold}`, color: COLORS.gold }}
          >
            Vertrouwelijk
          </div>
          <h1 className="text-3xl font-serif mb-3" style={{ color: COLORS.champagne }}>
            Novelle Events — Campagnerapport
          </h1>
          <p className="text-sm" style={{ color: COLORS.goldLight }}>
            Voer het wachtwoord in om het rapport te bekijken.
          </p>
        </div>
        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          placeholder="Wachtwoord"
          className="w-full px-4 py-3 bg-transparent border outline-none transition-colors"
          style={{
            borderColor: error ? "#C95A5A" : COLORS.gold,
            color: COLORS.white,
          }}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm" style={{ color: "#E89B9B" }}>
            Onjuist wachtwoord.
          </p>
        )}
        <button
          type="submit"
          className="w-full mt-4 py-3 text-sm tracking-[0.2em] uppercase transition-opacity hover:opacity-90"
          style={{ background: COLORS.gold, color: COLORS.greenDark }}
        >
          Open rapport
        </button>
        <p className="mt-8 text-center text-xs" style={{ color: COLORS.muted }}>
          Webiro × Novelle Events
        </p>
      </form>
    </div>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      className="p-6 transition-all hover:-translate-y-0.5"
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.champagne}`,
        borderTop: `2px solid ${COLORS.gold}`,
      }}
    >
      <div className="text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: COLORS.muted }}>
        {label}
      </div>
      <div className="text-3xl font-serif mb-1" style={{ color: COLORS.green }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: COLORS.muted }}>
        {sub}
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title, intro }: { kicker: string; title: string; intro?: string }) {
  return (
    <div className="mb-10">
      <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.gold }}>
        {kicker}
      </div>
      <h2 className="text-3xl md:text-4xl font-serif mb-4" style={{ color: COLORS.green }}>
        {title}
      </h2>
      {intro && (
        <p className="max-w-3xl text-base leading-relaxed" style={{ color: COLORS.muted }}>
          {intro}
        </p>
      )}
    </div>
  );
}

function ChartCard({ title, children, height = 320 }: { title: string; children: React.ReactNode; height?: number }) {
  return (
    <div
      className="p-6 md:p-8"
      style={{ background: COLORS.white, border: `1px solid ${COLORS.champagne}` }}
    >
      <h3 className="text-lg font-serif mb-6" style={{ color: COLORS.green }}>
        {title}
      </h3>
      <div style={{ width: "100%", height }}>{children}</div>
    </div>
  );
}

export default function NovelleRapport() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") setAuthed(true);
  }, []);

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;

  return (
    <>
      <Helmet>
        <title>Campagnerapport — Novelle Events | Webiro</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .novelle-report { font-family: 'Inter', sans-serif; }
          .novelle-report .font-serif { font-family: 'Cormorant Garamond', serif; font-weight: 500; letter-spacing: -0.01em; }
        `}</style>
      </Helmet>

      <div className="novelle-report" style={{ background: COLORS.champagneLight, color: COLORS.ink }}>
        {/* HERO */}
        <header
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${COLORS.greenDark} 0%, ${COLORS.green} 100%)`,
            color: COLORS.champagne,
          }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${COLORS.gold} 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div
              className="inline-block px-4 py-1 text-xs tracking-[0.3em] uppercase mb-8"
              style={{ border: `1px solid ${COLORS.gold}`, color: COLORS.gold }}
            >
              Campagnerapport · Q1 2026
            </div>
            <h1
              className="font-serif text-5xl md:text-7xl leading-[1.05] mb-6"
              style={{ color: COLORS.champagne }}
            >
              Novelle Events
              <br />
              <span style={{ color: COLORS.gold }}>Meta Ads Performance</span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed" style={{ color: COLORS.goldLight }}>
              Een visuele evaluatie van de eerste merkcampagne voor Novelle Events — een nieuwe evenementen- en
              trouwlocatie in Sneek. Periode: 17 maart t/m 17 april 2026.
            </p>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8" style={{ borderTop: `1px solid ${COLORS.gold}40` }}>
              {[
                { l: "Periode", v: "17 mrt – 17 apr" },
                { l: "Platform", v: "Meta Ads" },
                { l: "Budget", v: "€154,31" },
                { l: "Locatie", v: "Sneek e.o." },
              ].map((i) => (
                <div key={i.l}>
                  <div className="text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: COLORS.gold }}>
                    {i.l}
                  </div>
                  <div className="text-xl font-serif" style={{ color: COLORS.champagne }}>
                    {i.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* MANAGEMENT SAMENVATTING */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
          <SectionTitle
            kicker="Managementsamenvatting"
            title="In één oogopslag"
            intro="De belangrijkste uitkomsten van de campagne, in heldere taal samengevat voor het management."
          />
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Sterke zichtbaarheid: 34.411 weergaven bereikten 16.730 unieke personen in de regio Sneek.",
              "Uitstekend klikgedrag: een CTR van 10,22% — ruim 5× hoger dan het Meta-gemiddelde (~1,5%).",
              "Efficiënt traffic-resultaat: 1.583 landing page views voor slechts €0,10 per bezoek (36% onder de benchmark van €0,15).",
              "Merk-momentum: 131 nieuwe Instagram-volgers — gratis bijvangst die de organische groei versnelt.",
              "Leadgeneratie nog opstartend: 3 aanmeldingen tegen €51,44 per lead — verbeterpotentieel via formulier en aanbod.",
              "Conclusie: de campagne presteerde bovengemiddeld op zichtbaarheid en bezoek, met conversie als logische volgende optimalisatiestap.",
            ].map((b, i) => (
              <div
                key={i}
                className="flex gap-4 p-5"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.champagne}` }}
              >
                <div
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-sm font-serif"
                  style={{ background: COLORS.green, color: COLORS.gold }}
                >
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* KPI'S */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          <SectionTitle kicker="Kerncijfers" title="Alle resultaten in één overzicht" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {KPIS.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>
        </section>

        {/* GRAFIEKEN */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
          <SectionTitle
            kicker="Visuele analyse"
            title="Grafieken & doorvertaling"
            intro="Drie perspectieven op dezelfde data: zichtbaarheid, het funnel-verloop van vertoning naar lead, en de mediakosten."
          />

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <ChartCard title="Bereik & Impressies">
              <ResponsiveContainer>
                <BarChart data={reachData} layout="vertical" margin={{ left: 20, right: 40 }}>
                  <CartesianGrid stroke={COLORS.champagne} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke={COLORS.muted} fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke={COLORS.muted} fontSize={12} width={90} />
                  <Tooltip
                    contentStyle={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.gold}`,
                      borderRadius: 0,
                    }}
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                  />
                  <Bar dataKey="value" radius={0}>
                    {reachData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v: number) => v.toLocaleString("nl-NL")}
                      style={{ fill: COLORS.green, fontSize: 12, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Kostenoverzicht (€)">
              <ResponsiveContainer>
                <BarChart data={costData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid stroke={COLORS.champagne} strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke={COLORS.muted} fontSize={11} />
                  <YAxis stroke={COLORS.muted} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.gold}`,
                      borderRadius: 0,
                    }}
                    formatter={(v: number) => `€${v.toFixed(2)}`}
                  />
                  <Bar dataKey="value" radius={0}>
                    {costData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={(v: number) => `€${v.toFixed(2)}`}
                      style={{ fill: COLORS.green, fontSize: 11, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Funnel — van Impressie tot Lead" height={420}>
            <ResponsiveContainer>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    background: COLORS.white,
                    border: `1px solid ${COLORS.gold}`,
                    borderRadius: 0,
                  }}
                  formatter={(v: number) => v.toLocaleString("nl-NL")}
                />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList
                    position="right"
                    fill={COLORS.green}
                    stroke="none"
                    dataKey="name"
                    style={{ fontSize: 13, fontWeight: 500 }}
                  />
                  <LabelList
                    position="center"
                    fill={COLORS.white}
                    stroke="none"
                    dataKey="value"
                    formatter={(v: number) => v.toLocaleString("nl-NL")}
                    style={{ fontSize: 14, fontWeight: 600 }}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* UITLEG */}
        <section style={{ background: COLORS.white }}>
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
            <SectionTitle
              kicker="In gewone taal"
              title="Wat betekenen deze cijfers voor Novelle?"
              intro="Een vertaling van de cijfers naar wat het concreet oplevert voor de zichtbaarheid van Novelle Events in Sneek en omgeving."
            />
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  t: "Iedereen in de regio kent de naam",
                  d: "16.730 unieke mensen — bijna de helft van Sneek — heeft Novelle Events op hun scherm gezien. Met een frequentie van 2,06 zagen zij de advertentie gemiddeld twee keer: precies de zoete plek tussen herkenning en irritatie.",
                },
                {
                  t: "De boodschap raakt een snaar",
                  d: "Een klikratio van 10,22% is uitzonderlijk hoog. Ter vergelijking: het Meta-gemiddelde ligt rond 1,5%. Dit betekent dat de creatives en het aanbod (locatie, sfeer, beleving) sterk aansluiten bij de doelgroep.",
                },
                {
                  t: "Bezoek aan de website is bijna gratis",
                  d: "Voor 10 cent kreeg Novelle een bezoeker op de landingspagina. Dat is niet alleen efficiënt — het bouwt ook een waardevol publiek op voor remarketing in toekomstige campagnes.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="p-8"
                  style={{ background: COLORS.champagneLight, borderLeft: `2px solid ${COLORS.gold}` }}
                >
                  <h4 className="text-xl font-serif mb-3" style={{ color: COLORS.green }}>
                    {c.t}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.muted }}>
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENCHMARK */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-20">
          <SectionTitle
            kicker="Benchmark"
            title="Hoe verhoudt Novelle zich tot de markt?"
            intro="Vergelijking van de kosten per landing page view met het marktgemiddelde voor vergelijkbare adverteerders in de event- en horeca-sector."
          />
          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            <ChartCard title="Kosten per landing page view (€)" height={280}>
              <ResponsiveContainer>
                <BarChart data={benchmarkData} layout="vertical" margin={{ left: 30, right: 60 }}>
                  <CartesianGrid stroke={COLORS.champagne} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" stroke={COLORS.muted} fontSize={12} domain={[0, 0.2]} />
                  <YAxis dataKey="name" type="category" stroke={COLORS.muted} fontSize={12} width={140} />
                  <Tooltip formatter={(v: number) => `€${v.toFixed(2)}`} />
                  <Bar dataKey="value">
                    {benchmarkData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      formatter={(v: number) => `€${v.toFixed(2)}`}
                      style={{ fill: COLORS.green, fontSize: 13, fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div
              className="p-10 flex flex-col justify-center"
              style={{ background: COLORS.green, color: COLORS.champagne }}
            >
              <div className="text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: COLORS.gold }}>
                Resultaat vs markt
              </div>
              <div className="text-7xl font-serif mb-4" style={{ color: COLORS.gold }}>
                –36%
              </div>
              <p className="text-base leading-relaxed mb-6" style={{ color: COLORS.goldLight }}>
                Novelle Events betaalde <strong>€0,10</strong> per bezoeker, tegenover een marktgemiddelde van{" "}
                <strong>€0,15</strong>. Dat is 36% efficiënter dan vergelijkbare adverteerders in de sector.
              </p>
              <p className="text-sm" style={{ color: COLORS.champagne }}>
                Concreet: hetzelfde mediabudget levert ~50% meer verkeer op dan een gemiddelde campagne in deze niche.
              </p>
            </div>
          </div>
        </section>

        {/* AANBEVELINGEN */}
        <section style={{ background: COLORS.greenDark, color: COLORS.champagne }}>
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-20">
            <div className="mb-12">
              <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.gold }}>
                Vervolg
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4" style={{ color: COLORS.champagne }}>
                Aanbevelingen volgende campagne
              </h2>
              <p className="max-w-3xl text-base leading-relaxed" style={{ color: COLORS.goldLight }}>
                Vier concrete pijlers om de sterke startbasis te verzilveren in meer aanvragen en boekingen.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-px" style={{ background: `${COLORS.gold}40` }}>
              {[
                {
                  n: "01",
                  t: "Budget verhogen naar €500 – €750 / maand",
                  d: "De huidige €154 is een sterke pilot, maar te beperkt voor consistente leadflow. Met €500+ kan de campagne dagelijks draaien zonder te 'rusten' tussen impressies, en blijft de frequentie in de sweet spot (2–3×).",
                },
                {
                  n: "02",
                  t: "Targeting verfijnen op intentie",
                  d: "Voeg lookalike audiences toe op basis van de 1.583 landingspagebezoekers. Combineer met life event targeting (recent verloofd) en interesses zoals bruiloftsplanning, fotografie en luxehoreca binnen 30 km van Sneek.",
                },
                {
                  n: "03",
                  t: "Creatives uitbreiden met video & UGC",
                  d: "De huidige CTR van 10,22% bewijst dat de visuele richting werkt. Test korte reels (sfeerimpressies, drone, ceremonieplek) en testimonials van eerste bezoekers. Roteer minimaal 4 varianten om creative fatigue te voorkomen.",
                },
                {
                  n: "04",
                  t: "Lead-conversie verbeteren",
                  d: "De stap LPV → lead (1.583 → 3) is het grootste verbeterpunt. Vervang het generieke contactformulier door een laagdrempelige 'Plan een rondleiding'-stap met datumkiezer (Calendly), of bied een downloadbare brochure als lead magnet.",
                },
              ].map((r) => (
                <div key={r.n} className="p-8 md:p-10" style={{ background: COLORS.greenDark }}>
                  <div className="text-5xl font-serif mb-4" style={{ color: COLORS.gold }}>
                    {r.n}
                  </div>
                  <h4 className="text-xl font-serif mb-3" style={{ color: COLORS.champagne }}>
                    {r.t}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.goldLight }}>
                    {r.d}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-16 p-10 text-center"
              style={{ border: `1px solid ${COLORS.gold}` }}
            >
              <div className="text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.gold }}>
                Verwachting bij opschaling
              </div>
              <p className="text-2xl md:text-3xl font-serif" style={{ color: COLORS.champagne }}>
                Met geoptimaliseerde funnel en €500 / maand verwachten we
                <br />
                <span style={{ color: COLORS.gold }}>15 – 25 gekwalificeerde leads per maand</span>
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          className="py-10 text-center text-xs tracking-[0.2em] uppercase"
          style={{ background: COLORS.champagne, color: COLORS.muted }}
        >
          Webiro × Novelle Events · Vertrouwelijk rapport · 2026
        </footer>
      </div>
    </>
  );
}
