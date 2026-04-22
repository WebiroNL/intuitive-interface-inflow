import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, CheckmarkCircle02Icon, StarIcon, FlashIcon, PaintBrushIcon, HeadsetIcon, ChartIncreaseIcon, Clock01Icon, ShieldKeyIcon, RocketIcon, MessageMultiple01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { CTASection } from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";
import { SilkWaves } from "@/components/SilkWaves";
import { AnimatedDashboard } from "@/components/AnimatedDashboard";
import ProcessVisual from "@/components/ProcessVisual";
import AdsProcessVisual from "@/components/AdsProcessVisual";
import { ReviewsSection } from "@/components/ReviewsSection";
import { LazyIframe } from "@/components/LazyIframe";
import { PhoneShowcase, type ShowcaseItem } from "@/components/PhoneShowcase";
import { supabase } from "@/integrations/supabase/client";

/* ─── Fake website mockup for bento cards ─── */
const WebsiteMockup = ({ accent }: { accent: "primary" | "accent" }) => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card" style={{ aspectRatio: "16/10" }}>
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-webiro-yellow/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    <div className={`absolute inset-0 top-9 ${accent === "primary" ? "bg-gradient-to-br from-primary/5 via-background to-primary/10" : "bg-gradient-to-br from-accent/5 via-background to-accent/10"}`}>
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/30">
        <div className={`w-12 h-3 rounded-sm ${accent === "primary" ? "bg-primary/40" : "bg-accent/40"}`} />
        <div className="flex gap-2 ml-auto">
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className="w-8 h-2.5 rounded-sm bg-muted-foreground/20" />
          <div className={`w-14 h-5 rounded-sm ${accent === "primary" ? "bg-primary/60" : "bg-accent/60"}`} />
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="w-3/4 h-4 rounded bg-foreground/15 mb-2" />
        <div className="w-1/2 h-3 rounded bg-foreground/10 mb-4" />
        <div className={`w-20 h-6 rounded ${accent === "primary" ? "bg-primary/50" : "bg-accent/50"}`} />
      </div>
      <div className="absolute bottom-3 left-4 right-4 grid grid-cols-3 gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border/30 bg-background/60 p-2">
            <div className={`w-6 h-6 rounded mb-1.5 ${accent === "primary" ? "bg-primary/30" : "bg-accent/30"}`} />
            <div className="w-full h-2 rounded bg-foreground/10 mb-1" />
            <div className="w-2/3 h-1.5 rounded bg-foreground/8" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MarketingMockup = () => (
  <div className="relative w-full rounded-xl overflow-hidden border border-border/60 shadow-lg bg-card" style={{ aspectRatio: "16/10" }}>
    <div className="flex items-center gap-1.5 px-3 py-2 bg-muted/60 border-b border-border/40">
      <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
      <span className="w-2.5 h-2.5 rounded-full bg-webiro-yellow/70" />
      <span className="w-2.5 h-2.5 rounded-full bg-primary/40" />
      <div className="ml-2 flex-1 h-4 rounded bg-muted/80 max-w-[160px]" />
    </div>
    <div className="absolute inset-0 top-9 bg-gradient-to-br from-accent/5 via-background to-accent/10 p-3">
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[["1.240", "Leads"], ["€4.20", "CPC"], ["34%", "Conv."]].map(([v, l]) => (
          <div key={l} className="rounded-lg border border-border/30 bg-background/60 px-2 py-1.5">
            <p className="text-[9px] font-bold text-accent">{v}</p>
            <p className="text-[7px] text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border/30 bg-background/60 p-2">
        <div className="text-[7px] text-muted-foreground mb-1.5">Leads per week</div>
        <div className="flex items-end gap-1 h-8">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-accent/40" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);



const websiteSteps = [
  {
    id: 0,
    number: "01",
    icon: MessageMultiple01Icon,
    tab: "Kennismaking",
    title: "Kennismaking & structuur",
    desc: "We vertalen je doelen naar een heldere websitestructuur, inhoud en conversieroute.",
    focus: ["Doelen & doelgroep", "Structuur & wireframe"],
  },
  {
    id: 1,
    number: "02",
    icon: PaintBrushIcon,
    tab: "Ontwerp & bouw",
    title: "Ontwerp & bouw",
    desc: "We ontwerpen en bouwen je website op maat, met snelle feedbackrondes tot alles klopt.",
    focus: ["UI design op maat", "Technische ontwikkeling"],
  },
  {
    id: 2,
    number: "03",
    icon: RocketIcon,
    tab: "Lanceren",
    title: "Lanceren & doorontwikkelen",
    desc: "Na livegang monitoren we gedrag en verbeteren we continu voor meer leads en betere conversie.",
    focus: ["Livegang & QA", "Doorlopende optimalisatie"],
  },
];

const adsSteps = [
  {
    id: 0,
    number: "01",
    icon: Search01Icon,
    tab: "Strategie",
    title: "Doelgroep & kanaalstrategie",
    desc: "We bepalen waar je doelgroep zit en hoe budget slim verdeeld wordt over de juiste kanalen.",
    focus: ["Doelgroepsegmentatie", "Kanaal- en budgetplan"],
  },
  {
    id: 1,
    number: "02",
    icon: FlashIcon,
    tab: "Lanceren",
    title: "Campagnes bouwen & lanceren",
    desc: "We zetten campagnes technisch strak op met sterke creatives, tracking en duidelijke doelstellingen.",
    focus: ["Campagne-opzet", "Tracking & livegang"],
  },
  {
    id: 2,
    number: "03",
    icon: ChartIncreaseIcon,
    tab: "Managen",
    title: "Managen & opschalen",
    desc: "We sturen actief op data, verbeteren prestaties en schalen door wat aantoonbaar resultaat oplevert.",
    focus: ["Wekelijkse optimalisatie", "Schaal op winstgevende data"],
  },
];

const whyItems = [
  { icon: FlashIcon, title: "Alles onder één dak", desc: "Website, advertenties, SEO en automatisering. Één team dat alles voor je regelt." },
  { icon: ChartIncreaseIcon, title: "Resultaatgericht", desc: "Elke euro die je investeert moet renderen. Wij sturen op conversies, leads en groei." },
  { icon: PaintBrushIcon, title: "Volledig op maat", desc: "Geen templates. Jouw website en campagnes worden specifiek voor jouw merk gebouwd." },
  { icon: HeadsetIcon, title: "Persoonlijk contact", desc: "Één vast aanspreekpunt. Snelle antwoorden, geen tussenlagen of account managers." },
  { icon: Clock01Icon, title: "Snel live", desc: "Website binnen 7 dagen. Campagnes draaien binnen 48 uur. Geen maanden wachten." },
  { icon: ShieldKeyIcon, title: "Transparante prijzen", desc: "Vaste tarieven zonder verrassingen. Je weet altijd precies waar je aan toe bent." },
];

const tools = [
  { name: "Figma", src: "/images/tools/figma.svg" },
  { name: "Framer", src: "/images/tools/framer.svg" },
  { name: "Spline", src: "/images/tools/spline.png" },
  { name: "Webflow", src: "/images/tools/webflow.svg" },
  { name: "Shopify", src: "/images/tools/shopify.svg" },
  { name: "WordPress", src: "/images/tools/wordpress.svg" },
  { name: "React", src: "/images/tools/react.svg" },
  { name: "Vercel", src: "/images/tools/vercel.svg" },
  { name: "Google Ads", src: "/images/tools/googleads.svg" },
  { name: "Meta Ads", src: "/images/tools/meta.svg" },
  { name: "Photoshop", src: "/images/tools/photoshop.svg" },
  { name: "Illustrator", src: "/images/tools/illustrator.svg" },
  { name: "After Effects", src: "/images/tools/aftereffects.svg" },
  { name: "Premiere Pro", src: "/images/tools/premierepro.svg" },
];

const showcase = [
  { title: "Allround Training Center", cat: "Sport & Fitness", url: "https://www.allroundtrainingcenter.nl", services: ["Custom Website", "Branding", "AI Livechat", "SEO", "Google Ads"], desc: "Custom gebouwde website met eigen backend, AI livechat en full SEO-pakket. Inclusief volledige Google Ads strategie.", tint: "234,82%,57%" },
  { title: "Matrix City", cat: "Fitness", url: "https://www.matrixcity.nl", services: ["Branding", "Website", "Google Ads"], desc: "Complete digitale transformatie: van logo tot advertentiecampagnes die elke maand nieuwe leden opleveren.", tint: "16,85%,55%" },
  { title: "CKN Legal", cat: "Juridisch", url: "https://www.cknlegal.com", services: ["Branding", "Website"], desc: "Professionele huisstijl en website die vertrouwen uitstraalt voor een groeiend advocatenkantoor.", tint: "215,55%,40%" },
  { title: "Elektroza", cat: "Techniek", url: "https://www.elektroza.nl", services: ["Website", "SEO"], desc: "Conversiegericht ontwerp met lokale SEO-strategie voor meer offerteaanvragen in de regio.", tint: "44,90%,55%" },
  { title: "Coco De Rio", cat: "Fashion", url: "https://cocoderio.com", services: ["Website", "Meta Ads", "E-mail"], desc: "Shopify webshop met Meta advertenties en geautomatiseerde e-mailflows voor hogere retentie.", tint: "330,75%,60%" },
  { title: "Prokick Academie", cat: "Sport", url: "https://www.prokickacademie.nl", services: ["Website", "Google Ads"], desc: "Moderne website en Google Ads campagne die structureel nieuwe aanmeldingen genereren.", tint: "0,75%,55%" },
];



const Home = () => {
  const [activeWebsiteStep, setActiveWebsiteStep] = useState(0);
  const [activeAdsStep, setActiveAdsStep] = useState(0);

  useEffect(() => {
    updatePageMeta(
      "Webiro – Websites, marketing & automation voor ondernemers",
      "Professionele websites binnen 7 dagen live. Marketing, automation en AI voor structurele groei. Betaalbaar vanaf €449."
    );
  }, []);

  const activeWebsite = websiteSteps[activeWebsiteStep];
  const activeAds = adsSteps[activeAdsStep];

  return (
    <main className="bg-background">
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <StructuredData type="Service" />

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-background pt-[60px]">
        <SilkWaves />
        <div
          className="absolute inset-y-0 left-0 w-[65%] pointer-events-none"
          style={{ zIndex: 1, background: "linear-gradient(to right, hsl(var(--background)) 50%, hsl(var(--background)/0.6) 75%, transparent 100%)" }}
        />
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-40" style={{ zIndex: 2 }}>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
            {/* Left - Text */}
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-7">
                Websites · Marketing · Automation
              </p>
              <h1
                className="font-bold tracking-[-0.03em] leading-[1.05] mb-8"
                style={{ fontSize: "clamp(2.6rem, 5.2vw, 4.5rem)" }}
              >
                <span className="text-foreground">De digitale motor</span>
                <br />
                <span className="text-primary">achter groeiende bedrijven.</span>
              </h1>
              <p className="text-[16px] text-muted-foreground leading-relaxed mb-10 max-w-[480px]">
                Wij bouwen jouw website, runnen je advertenties en automatiseren je marketing zodat jij je kunt focussen op ondernemen.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/pakketten"
                  className="inline-flex items-center gap-2 px-5 py-[11px] bg-primary text-primary-foreground text-[14px] font-semibold rounded-[6px] hover:bg-primary/90 transition-colors"
                >
                  Bekijk pakketten <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                </Link>
                <Link
                  to="/oplossingen"
                  className="inline-flex items-center gap-2 px-5 py-[11px] border border-input text-foreground text-[14px] font-medium rounded-[6px] hover:bg-muted/40 transition-colors"
                >
                  Oplossingen
                </Link>
              </div>

              {/* Mobile/tablet visual — compact dashboard under text */}
              <div className="lg:hidden mt-12 -mx-2">
                <div className="max-w-[420px] mx-auto" style={{ animation: 'heroFloat 6s ease-in-out infinite' }}>
                  <AnimatedDashboard />
                </div>
              </div>
            </div>

            {/* Right - Particle Engine Visual (desktop) */}
            <div className="hidden lg:flex items-start justify-center self-stretch">
              <div
                className="w-full max-w-[520px] sticky top-24"
                style={{ animation: 'heroFloat 6s ease-in-out infinite' }}
              >
                <AnimatedDashboard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ TOOLS STRIP ══════ */}
      <div className="border-t border-border/60 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-7">
          <div className="relative overflow-hidden px-1 sm:px-2">
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />
            <div
              className="tools-strip flex w-max gap-x-12 md:gap-x-16 animate-[marquee_42s_linear_infinite] [will-change:transform]"
              onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = "paused"; }}
              onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = "running"; }}
            >
              {[0, 1].map((setIdx) => (
                <div key={setIdx} className="flex items-center gap-x-12 md:gap-x-16 flex-shrink-0">
                  {tools.map((tool) => (
                    <div
                      key={`${setIdx}-${tool.name}`}
                      className="tool-item flex items-center gap-2.5 flex-shrink-0 transition-all duration-300 cursor-default"
                    >
                      <img src={tool.src} alt={tool.name} className="h-5 w-5 object-contain" loading="lazy" />
                      <span className="text-[13px] font-semibold text-foreground/70 tracking-tight whitespace-nowrap">
                        {tool.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ SOLUTIONS ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28 pb-6">
          <div className="max-w-3xl mb-14">
            <h2
              className="font-bold tracking-[-0.025em] leading-[1.08]"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
            >
              <span className="text-foreground">Twee trajecten, één doel: groei.</span>{" "}
              <span className="text-muted-foreground font-bold">Kies wat bij jou past.</span>
            </h2>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Website card */}
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-primary/8 pointer-events-none" />
              <div className="relative p-10 flex flex-col flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary mb-5">Website bouwen</p>
                <h3 className="text-[22px] font-bold text-foreground leading-snug mb-3 max-w-[300px]">
                  Geen website? Wij bouwen hem voor je.
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 max-w-[320px]">
                  Van briefing naar live website in 7 dagen. Modern, mobielvriendelijk en gebouwd om te converteren.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Modern & mobielvriendelijk", "Conversiegericht design", "Eenvoudig te beheren"].map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link to="/pakketten" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all">
                    Configureer je pakket <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="px-10 pb-10">
                <WebsiteMockup accent="primary" />
              </div>
            </div>

            {/* Marketing card */}
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden group flex flex-col">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/4 via-transparent to-accent/8 pointer-events-none" />
              <div className="relative p-10 flex flex-col flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent mb-5">Marketing & Groei</p>
                <h3 className="text-[22px] font-bold text-foreground leading-snug mb-3 max-w-[300px]">
                  Al een website? Laat hem harder werken.
                </h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 max-w-[320px]">
                  Google Ads, Meta Ads, e-mail automation en AI chatbots die elke maand meer leads genereren.
                </p>
                <ul className="space-y-2 mb-8">
                  {["Google & Meta advertenties", "E-mail automation", "AI chatbot & leads"].map((c) => (
                    <li key={c} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 flex-shrink-0 text-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link to="/pakketten" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent hover:gap-3 transition-all">
                    Bekijk marketingdiensten <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="px-10 pb-10">
                <MarketingMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div className="max-w-xl">
              <h2
                className="font-bold tracking-[-0.025em] leading-[1.08] mb-3"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}
              >
                Hoe het werkt
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Van eerste gesprek tot meetbaar resultaat, helder opgesplitst in twee trajecten.
              </p>
            </div>
            <Link
              to="/proces"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all flex-shrink-0"
            >
              Volledig proces <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Link>
          </div>

          {/* Trajectory toggle */}
          {(() => {
            const [activeTraject, setActiveTraject] = useState<"website" | "ads">("website");
            const isWebsite = activeTraject === "website";
            const steps = isWebsite ? websiteSteps : adsSteps;
            const activeIdx = isWebsite ? activeWebsiteStep : activeAdsStep;
            const setActiveIdx = isWebsite ? setActiveWebsiteStep : setActiveAdsStep;

            return (
              <>
                <div className="flex gap-2 mb-8">
                  <button
                    onClick={() => setActiveTraject("website")}
                    className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      isWebsite ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Website traject
                  </button>
                  <button
                    onClick={() => setActiveTraject("ads")}
                    className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                      !isWebsite ? "bg-accent text-accent-foreground shadow-sm" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Advertentie traject
                  </button>
                </div>

                <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-stretch">
                  <div className="flex justify-center">
                    {isWebsite ? (
                      <ProcessVisual activeStep={activeWebsiteStep} onStepChange={setActiveWebsiteStep} showTabs={false} />
                    ) : (
                      <AdsProcessVisual activeStep={activeAdsStep} onStepChange={setActiveAdsStep} showTabs={false} />
                    )}
                  </div>

                  <div className="space-y-3">
                    {steps.map((step, index) => {
                      const isActive = activeIdx === index;
                      const colorClasses = isWebsite
                        ? { border: "border-primary/25", bg: "bg-primary/5", iconBg: "bg-primary/15", iconText: "text-primary", chipBg: "bg-primary/10", chipText: "text-primary" }
                        : { border: "border-accent/25", bg: "bg-accent/5", iconBg: "bg-accent/15", iconText: "text-accent", chipBg: "bg-accent/10", chipText: "text-accent" };

                      return (
                        <button
                          key={step.id}
                          onClick={() => setActiveIdx(index)}
                          className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${
                            isActive ? `${colorClasses.border} ${colorClasses.bg} shadow-sm` : "border-border bg-card hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                              isActive ? colorClasses.iconBg : "bg-muted"
                            }`}>
                              <HugeiconsIcon
                                icon={step.icon}
                                className={`w-[18px] h-[18px] transition-colors ${isActive ? colorClasses.iconText : "text-muted-foreground"}`}
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                                Stap {step.number}
                              </span>
                              <p className={`text-[15px] font-semibold mt-0.5 transition-colors ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                                {step.title}
                              </p>
                              {isActive && (
                                <>
                                  <p className="text-[13px] text-muted-foreground leading-relaxed mt-1.5">{step.desc}</p>
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {step.focus.map((item) => (
                                      <span key={item} className={`rounded-md ${colorClasses.chipBg} px-2.5 py-1 text-[11px] font-medium ${colorClasses.chipText}`}>
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* ══════ WHY US ══════ */}
      <section className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="mb-16">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary mb-3">Waarom Webiro</p>
            <h2 className="font-bold tracking-[-0.025em] leading-[1.08] mb-4" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}>
              Jouw digitale groeipartner
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
              Wij combineren design, techniek en marketing tot één krachtig geheel.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItems.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <HugeiconsIcon icon={icon} className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SHOWCASE ══════ */}
      <section className="border-t border-border bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="flex items-end justify-between mb-12 px-0">
            <div className="max-w-xl">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Recent werk
              </p>
              <h2 className="font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}>
                Echte projecten,<br />
                <span className="text-primary">live in je hand.</span>
              </h2>
              <p className="mt-5 text-[15px] text-muted-foreground max-w-md">
                Swipe door een selectie van onze recente websites. Elke preview is een live versie van de productiesite.
              </p>
            </div>
            <Link to="/contact" className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:gap-3 transition-all">
              Bekijk meer <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel constrained to container width like the rest of the page */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
          <div className="relative -mt-2">
            <PhoneShowcase items={showcase} />
          </div>
        </div>
      </section>

      {/* ══════ REVIEWS ══════ */}
      <ReviewsSection />

      <CTASection />
    </main>
  );
};

export default Home;
