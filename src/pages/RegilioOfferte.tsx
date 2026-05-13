import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Globe02Icon,
  CloudServerIcon,
  Megaphone02Icon,
  TiktokIcon,
  MetaIcon,
  Calendar03Icon,
  SparklesIcon,
  ShoppingCart02Icon,
  SnapchatIcon,
} from "@hugeicons/core-free-icons";
import { supabase } from "@/integrations/supabase/client";

const PASSWORD = "RegilioxWebiro";
const STORAGE_KEY = "regilio_offerte_auth_v1";
const PROPOSAL_SLUG = "regilio";

type LineItem = {
  id: string;
  title: string;
  price: number;
  unit: "eenmalig" | "per maand";
  icon: any;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

type WebsiteChoiceId = "website" | "webshop";

const websiteChoices: (LineItem & { id: WebsiteChoiceId })[] = [
  {
    id: "website",
    title: "Website + CMS",
    price: 999,
    unit: "eenmalig",
    icon: Globe02Icon,
    badge: "SEO Pro inbegrepen",
    features: [
      "Tot 10 pagina's",
      "CMS systeem om zelf teksten en afbeeldingen aan te passen",
      "Responsive design (mobiel, tablet & desktop)",
      "SSL-certificaat inbegrepen",
      "Contactformulier",
      "Google Analytics integratie",
      "Social media integratie",
      "Google Maps integratie",
      "Blog/nieuwssectie",
      "Animaties & micro-interacties",
      "3 revisierondes",
      "SEO Pro: optimalisatie voor 15+ zoekwoorden",
      "Maandelijkse SEO rapportage",
    ],
  },
  {
    id: "webshop",
    title: "Webshop + CMS",
    price: 2000,
    unit: "eenmalig",
    icon: ShoppingCart02Icon,
    badge: "SEO Pro inbegrepen",
    features: [
      "Volledige webshop met productbeheer",
      "CMS systeem voor producten, teksten & afbeeldingen",
      "Responsive design (mobiel, tablet & desktop)",
      "SSL-certificaat inbegrepen",
      "Veilige checkout & betaalintegratie",
      "Voorraadbeheer & orderoverzicht",
      "Google Analytics & e-commerce tracking",
      "Social media & Google Shopping integratie",
      "Blog/nieuwssectie",
      "Animaties & micro-interacties",
      "3 revisierondes",
      "SEO Pro: optimalisatie voor 15+ zoekwoorden",
      "Maandelijkse SEO rapportage",
    ],
  },
];

const items: LineItem[] = [
  {
    id: "hosting",
    title: "Hosting",
    price: 0,
    unit: "per maand",
    icon: CloudServerIcon,
    features: [
      "Tot 10 pagina's beheren",
      "10 GB opslag",
      "Standaard SSL certificaat",
      "Dagelijkse backups (7 dagen)",
      "99,5% uptime garantie",
      "E-mail support (reactie binnen 48 uur)",
      "Basis analytics dashboard",
      "Mobiel responsive hosting omgeving",
    ],
  },
  {
    id: "meta",
    title: "Meta Ads (Facebook & Instagram)",
    price: 500,
    unit: "per maand",
    icon: MetaIcon,
    features: [
      "Facebook & Instagram campagnes",
      "Audience targeting & lookalikes",
      "Creative strategy",
    ],
  },
  {
    id: "tiktok",
    title: "TikTok Ads",
    price: 500,
    unit: "per maand",
    icon: TiktokIcon,
    features: [
      "TikTok campagne setup",
      "Video advertising strategie",
      "Trend-based targeting",
    ],
  },
  {
    id: "snapchat",
    title: "Snapchat Ads",
    price: 0,
    unit: "per maand",
    icon: SnapchatIcon,
    features: [
      "Snapchat campagne setup",
      "Vertical video advertising",
      "Gen-Z targeting & engagement",
    ],
  },
];

const MONTHS = 3; // mei, juni, juli

function useCountUp(target: number, duration = 1200, start = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return val;
}

function PriceTag({ price, unit }: { price: number; unit: LineItem["unit"] }) {
  if (price === 0) {
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Gratis</span>
        {unit === "per maand" && <span className="text-sm text-muted-foreground">per maand</span>}
      </div>
    );
  }
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">€{price.toLocaleString("nl-NL")},-</span>
      {unit === "per maand" && <span className="text-sm text-muted-foreground">per maand</span>}
    </div>
  );
}

export default function RegilioOfferte() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);
  const [name, setName] = useState("");
  const [showDialog, setShowDialog] = useState<null | "accept" | "decline">(null);
  const [saving, setSaving] = useState(false);
  const [loadingDecision, setLoadingDecision] = useState(true);
  const [websiteChoice, setWebsiteChoice] = useState<WebsiteChoiceId>("website");

  // Load auth + remote decision
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") setAuthed(true);
    document.title = "Voorstel — Regilio | Webiro";

    (async () => {
      const { data } = await supabase
        .from("proposal_decisions")
        .select("decision, name")
        .eq("slug", PROPOSAL_SLUG)
        .maybeSingle();
      if (data) {
        setDecision(data.decision as "accepted" | "declined");
        setName(data.name || "");
      }
      setLoadingDecision(false);
    })();
  }, []);

  const selectedWebsite = websiteChoices.find((w) => w.id === websiteChoice)!;
  const eenmalig = selectedWebsite.price;
  const maandelijks = useMemo(() => items.reduce((s, i) => s + i.price, 0), []);
  const totaal3mnd = eenmalig + maandelijks * MONTHS;

  const animatedTotal = useCountUp(totaal3mnd, 1500, authed);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthed(true);
    } else {
      setErr("Onjuist wachtwoord");
    }
  };

  const submitDecision = async (d: "accepted" | "declined") => {
    setSaving(true);
    const { error } = await supabase
      .from("proposal_decisions")
      .upsert(
        { slug: PROPOSAL_SLUG, decision: d, name: name.trim(), decided_at: new Date().toISOString() },
        { onConflict: "slug" }
      );
    setSaving(false);
    if (error) {
      alert("Kon je beslissing niet opslaan. Probeer het opnieuw.");
      return;
    }
    setDecision(d);
    setShowDialog(null);
  };

  const resetDecision = async () => {
    setSaving(true);
    await supabase.from("proposal_decisions").delete().eq("slug", PROPOSAL_SLUG);
    setSaving(false);
    setDecision(null);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleLogin}
          className="relative w-full max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
              <HugeiconsIcon icon={LockIcon} size={20} className="text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Beveiligd voorstel</div>
              <h1 className="text-xl font-semibold text-foreground">Voorstel voor Regilio</h1>
            </div>
          </div>
          <label className="block text-sm font-medium text-foreground mb-2">Wachtwoord</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setErr(""); }}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••••"
            autoFocus
          />
          {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
          <button
            type="submit"
            className="mt-5 w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Voorstel openen <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="text-white" />
          </button>
          <p className="mt-6 text-xs text-center text-muted-foreground">
            Voorstel opgesteld door <span className="text-foreground font-medium">Webiro</span>
          </p>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Soft hero gradient */}
      <div className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />
        <motion.div
          className="absolute -top-20 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 16, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-14 md:py-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14 md:mb-20"
        >
          <div className="flex items-center gap-2 mb-5 text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
            <span className="w-6 h-px bg-primary" />
            Voorstel van Webiro
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            <span className="text-foreground">Voorstel voor</span>{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Regilio</span>
            <span className="text-primary">.</span>
          </h1>
          <div className="mt-6 flex items-center gap-2 text-base text-muted-foreground">
            <HugeiconsIcon icon={Calendar03Icon} size={18} className="text-primary" />
            <span>Voor de maanden <span className="text-foreground font-medium">mei, juni en juli 2026</span></span>
          </div>
        </motion.header>

        {/* Website choice (50/50) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Kies één van de twee
            </div>
            <div className="text-xs text-muted-foreground">
              Geselecteerd: <span className="text-foreground font-medium">{selectedWebsite.title}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {websiteChoices.map((choice) => {
              const isActive = websiteChoice === choice.id;
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setWebsiteChoice(choice.id)}
                  className={`relative text-left p-6 md:p-7 rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                    isActive
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                  )}
                  <div className="absolute top-4 right-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isActive ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shrink-0">
                      <HugeiconsIcon icon={choice.icon} size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{choice.title}</h3>
                      {choice.badge && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <HugeiconsIcon icon={SparklesIcon} size={12} />
                          {choice.badge}
                        </div>
                      )}
                      <div className="mt-3">
                        <PriceTag price={choice.price} unit={choice.unit} />
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-5 grid grid-cols-1 gap-y-2">
                    {choice.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Line items */}
        <div className="space-y-5">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className={`relative p-6 md:p-8 rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
                item.highlight ? "border-primary/30 ring-1 ring-primary/10" : "border-border"
              }`}
            >
              {item.highlight && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              )}
              <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shrink-0">
                    <HugeiconsIcon icon={item.icon} size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{item.title}</h3>
                    {item.badge && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        <HugeiconsIcon icon={SparklesIcon} size={12} />
                        {item.badge}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:text-right">
                  <PriceTag price={item.price} unit={item.unit} />
                </div>
              </div>

              <div className="relative mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                {item.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 p-6 md:p-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.05] via-card to-accent/[0.05] relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative grid md:grid-cols-3 gap-6 md:gap-10">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">Website</div>
              <div className="text-3xl font-bold text-foreground">€{eenmalig.toLocaleString("nl-NL")},-</div>
              <div className="text-xs text-muted-foreground mt-1">{"\u200B"}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">Ads & hosting</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-foreground">€{maandelijks.toLocaleString("nl-NL")},-</span>
                <span className="text-sm text-muted-foreground">per maand</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{"\u200B"}</div>
            </div>
            <div className="md:border-l md:border-border md:pl-10">
              <div className="text-xs uppercase tracking-[0.18em] text-primary font-medium mb-2">TOTAAL</div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                  €{totaal3mnd.toLocaleString("nl-NL")},-
                </span>
                <span className="text-sm text-muted-foreground">voor 3 maanden</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{"\u200B"}</div>
            </div>
          </div>
          <div className="relative mt-6 pt-6 border-t border-border text-xs text-muted-foreground space-y-1">
            <p dangerouslySetInnerHTML={{ __html: "Alle prijzen zijn exclusief btw.<br>Advertentiebudgetten (ad spend) zijn niet inbegrepen in de beheerkosten.<br>" }} />
          </div>
        </motion.div>

        {/* Decision */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 p-6 md:p-10 rounded-2xl border border-border bg-card"
        >
          {decision ? (
            <div className="text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                decision === "accepted"
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}>
                <HugeiconsIcon icon={decision === "accepted" ? CheckmarkCircle02Icon : Cancel01Icon} size={16} />
                {decision === "accepted" ? "Voorstel akkoord bevonden" : "Voorstel afgewezen"}
              </div>
              <h3 className="mt-4 text-2xl font-bold text-foreground">
                {decision === "accepted" ? "Bedankt voor je akkoord!" : "Bedankt voor je terugkoppeling."}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {decision === "accepted"
                  ? "We nemen zo snel mogelijk contact op om de volgende stappen door te nemen."
                  : "We nemen contact op om te kijken wat we kunnen aanpassen of bespreken."}
              </p>
              {name && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Door: <span className="text-foreground font-medium">{name}</span>
                </p>
              )}
              <button
                onClick={resetDecision}
                disabled={saving}
                className="mt-5 text-xs text-muted-foreground underline hover:text-foreground disabled:opacity-50"
              >
                Beslissing wijzigen
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Klaar om verder te gaan?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Geef hieronder door of je akkoord gaat met het voorstel. Twijfels of vragen? Laat het ons weten, we plannen graag een gesprek in.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDialog("accept")}
                  className="group flex-1 px-6 py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-white" />
                  Akkoord met voorstel
                </button>
                <button
                  onClick={() => setShowDialog("decline")}
                  className="flex-1 px-6 py-4 rounded-xl font-medium text-foreground border border-border bg-background hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-muted-foreground" />
                  Niet akkoord
                </button>
              </div>
            </>
          )}
        </motion.div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Voorstel opgesteld door <span className="text-foreground font-medium">Webiro</span> · {new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setShowDialog(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border rounded-2xl p-7 shadow-2xl"
            >
              <h4 className="text-xl font-bold text-foreground">
                {showDialog === "accept" ? "Voorstel akkoord bevonden" : "Voorstel afwijzen"}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                {showDialog === "accept"
                  ? "Vul je naam in ter bevestiging. We nemen daarna contact op om alles in gang te zetten."
                  : "Vul je naam in ter bevestiging. We nemen contact op om eventuele aanpassingen te bespreken."}
              </p>
              <label className="block text-sm font-medium text-foreground mt-5 mb-2">Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jouw volledige naam"
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDialog(null)}
                  className="flex-1 px-4 py-3 rounded-lg font-medium text-foreground border border-border hover:bg-muted/50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  disabled={!name.trim() || saving}
                  onClick={() => submitDecision(showDialog === "accept" ? "accepted" : "declined")}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition-opacity ${
                    showDialog === "accept"
                      ? "bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      : "bg-destructive hover:opacity-90"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saving ? "Bezig met opslaan..." : "Bevestigen"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
