import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowLeft01Icon,
  SparklesIcon,
  PaintBoardIcon,
  TextFontIcon,
  LayoutTableIcon,
  MessageMultiple01Icon,
  SentIcon,
  Loading01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  SmartPhone01Icon,
  User03Icon,
  Building06Icon,
  Restaurant01Icon,
  ShoppingBag01Icon,
  Briefcase01Icon,
  ComputerIcon,
  FavouriteIcon,
  PaintBrushIcon,
  Target01Icon,
  DollarCircleIcon,
  StarIcon,
  BookOpen01Icon,
  Mail01Icon,
  Building04Icon,
  MinusSignIcon,
  FlashIcon,
  Leaf01Icon,
  BarChartIcon,
  Diamond01Icon,
  PuzzleIcon,
  Moon01Icon,
  Sun01Icon,
  Tree02Icon,
  WavesIcon,
  ColorsIcon,
  CircleIcon,
  File01Icon,
  Files01Icon,
  Layers01Icon,
  LibraryIcon,
  HelpCircleIcon,
  Coins01Icon,
  CreditCardIcon,
  Trophy01Icon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePageMeta } from "@/utils/seo";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

/* ─── Quiz Data ─── */
const quizSteps = [
  {
    id: "branche",
    question: "In welke branche zit je?",
    subtitle: "Dit helpt ons de juiste visuele taal te kiezen.",
    options: ["Horeca", "Retail / E-commerce", "Dienstverlening", "Tech / SaaS", "Gezondheid / Wellness", "Creatief / Design"],
    icons: [Restaurant01Icon, ShoppingBag01Icon, Briefcase01Icon, Monitor01Icon, FavouriteIcon, PaintBrushIcon],
  },
  {
    id: "doel",
    question: "Wat is het belangrijkste doel?",
    subtitle: "We stemmen het design af op jouw conversiedoel.",
    options: ["Meer klanten aantrekken", "Online verkopen", "Professionele uitstraling", "Informatie delen", "Leads genereren", "Merk opbouwen"],
    icons: [Target01Icon, DollarCircleIcon, StarIcon, BookOpen01Icon, Mail01Icon, Building04Icon],
  },
  {
    id: "stijl",
    question: "Welke stijl past bij jouw merk?",
    subtitle: "Kies de richting die het beste aanvoelt.",
    options: ["Minimalistisch & clean", "Bold & opvallend", "Warm & organisch", "Zakelijk & professioneel", "Luxe & premium", "Speels & creatief"],
    icons: [MinusSignIcon, FlashIcon, Leaf01Icon, BarChartIcon, Diamond01Icon, PuzzleIcon],
  },
  {
    id: "kleuren",
    question: "Welke kleurrichting spreekt je aan?",
    subtitle: "De basis voor jouw kleurenpalet.",
    options: ["Donker & sophisticated", "Licht & fris", "Aarde-tinten & warm", "Blauw & vertrouwen", "Levendig & energiek", "Neutraal & tijdloos"],
    icons: [Moon01Icon, Sun01Icon, Tree02Icon, Ocean01Icon, Colour01Icon, CircleIcon],
  },
  {
    id: "paginas",
    question: "Hoeveel pagina's heb je nodig?",
    subtitle: "Bepaalt de complexiteit en het pakket.",
    options: ["1 pagina (one-pager)", "2-5 pagina's", "5-10 pagina's", "10+ pagina's", "Weet ik nog niet"],
    icons: [File01Icon, Files01Icon, Layers01Icon, Library01Icon, HelpCircleIcon],
  },
  {
    id: "budget",
    question: "Wat is je budget indicatie?",
    subtitle: "We adviseren altijd eerlijk, nooit het duurste.",
    options: ["€500 - €1.000", "€1.000 - €2.000", "€2.000 - €5.000", "€5.000+", "Weet ik nog niet"],
    icons: [Coins01Icon, CreditCardIcon, Diamond01Icon, Trophy01Icon, HelpCircleIcon],
  },
];

/* ─── Types ─── */
interface MoodboardResult {
  moodboard: {
    stijl: string;
    kleuren: string[];
    kleurNamen: string[];
    typografie: { heading: string; body: string };
    sfeer: string[];
    layoutStijl: string;
    inspiratie: string;
  };
  pakketAdvies: {
    aanbevolen: string;
    reden: string;
    extras: string[];
  };
  samenvatting: string;
  chat?: string;
}

export default function MoodboardTool() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<MoodboardResult | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moodboardId, setMoodboardId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ naam: "", email: "", telefoon: "", bedrijfsnaam: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updatePageMeta(
      "AI Moodboard Generator | Webiro",
      "Ontdek jouw perfecte webdesign stijl met onze AI-tool. Beantwoord 6 vragen en ontvang een persoonlijk moodboard en pakketadvies."
    );
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatting]);

  const handleAnswer = (answer: string) => {
    const currentStep = quizSteps[step];
    const newAnswers = { ...answers, [currentStep.id]: answer };
    setAnswers(newAnswers);
    if (step < quizSteps.length - 1) {
      setStep(step + 1);
    } else {
      generateMoodboard(newAnswers);
    }
  };

  const generateMoodboard = async (quizAnswers: Record<string, string>) => {
    setIsGenerating(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("moodboard-ai", {
        body: { answers: quizAnswers },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data.result);

      const { data: inserted } = await supabase
        .from("moodboard_results" as any)
        .insert({ quiz_answers: quizAnswers, ai_result: data.result } as any)
        .select("id")
        .single();
      if (inserted) setMoodboardId((inserted as any).id);
    } catch (e: any) {
      setError(e.message || "Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendFollowUp = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setIsChatting(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("moodboard-ai", {
        body: { answers, followUp: userMsg },
      });
      if (fnError) throw fnError;
      const reply = data?.result?.chat || data?.result?.samenvatting || "Ik heb je moodboard bijgewerkt!";
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      if (data?.result?.moodboard) setResult(data.result);
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", text: "Sorry, er ging iets mis. Probeer het opnieuw." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setChatMessages([]);
    setError(null);
    setMoodboardId(null);
    setContactSubmitted(false);
    setContactForm({ naam: "", email: "", telefoon: "", bedrijfsnaam: "" });
  };

  const submitContact = async () => {
    if (!contactForm.naam.trim() || !contactForm.email.trim()) return;
    setContactLoading(true);
    try {
      const { data: lead } = await supabase
        .from("leads")
        .insert({
          naam: contactForm.naam.trim(),
          email: contactForm.email.trim(),
          telefoon: contactForm.telefoon.trim() || null,
          bedrijfsnaam: contactForm.bedrijfsnaam.trim() || null,
          bron: "moodboard",
          bericht: `Moodboard quiz ingevuld. Pakketadvies: ${result?.pakketAdvies?.aanbevolen || "onbekend"}`,
        } as any)
        .select("id")
        .single();

      if (lead && moodboardId) {
        await supabase
          .from("moodboard_results" as any)
          .update({
            naam: contactForm.naam.trim(),
            email: contactForm.email.trim(),
            telefoon: contactForm.telefoon.trim() || null,
            bedrijfsnaam: contactForm.bedrijfsnaam.trim() || null,
            lead_id: (lead as any).id,
          } as any)
          .eq("id", moodboardId);
      }

      setContactSubmitted(true);
    } catch {
      // Silently fail
    } finally {
      setContactLoading(false);
    }
  };

  const progress = result ? 100 : ((step) / quizSteps.length) * 100;

  return (
    <main className="min-h-screen bg-background">
      {/* ── Thin accent progress bar ── */}
      <div className="fixed top-[60px] left-0 right-0 z-30 h-[2px] bg-border/30">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatePresence mode="wait">
          {/* ─────────────────────── QUIZ ─────────────────────── */}
          {!result && !isGenerating && !error && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center py-20"
            >
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mb-10">
                {quizSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      i < step ? "w-6 bg-primary" : i === step ? "w-8 bg-primary" : "w-6 bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Question */}
              <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">
                Vraag {step + 1} van {quizSteps.length}
              </p>

              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-foreground text-center leading-tight tracking-tight max-w-xl mb-3">
                {quizSteps[step].question}
              </h1>

              <p className="text-base text-muted-foreground text-center max-w-md mb-10">
                {quizSteps[step].subtitle}
              </p>

              {/* Options grid */}
              <div className="w-full max-w-lg grid grid-cols-2 gap-3">
                {quizSteps[step].options.map((option, i) => {
                  const icon = quizSteps[step].icons[i];
                  const isSelected = answers[quizSteps[step].id] === option;
                  return (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      onClick={() => handleAnswer(option)}
                      className={`group relative flex flex-col items-center gap-3 px-4 py-5 rounded-xl border text-center transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary/[0.04] shadow-[0_0_0_1px_hsl(var(--primary))]"
                          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? "bg-primary/10" : "bg-muted/60 group-hover:bg-primary/10"
                      }`}>
                        <HugeiconsIcon
                          icon={icon}
                          size={18}
                          className={`transition-colors ${
                            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground leading-snug">{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Back button */}
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                  Vorige
                </button>
              )}
            </motion.div>
          )}

          {/* ─────────────────────── GENERATING ─────────────────────── */}
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center"
            >
              <div className="relative w-20 h-20 mb-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-primary/20"
                    animate={{ scale: [1, 1.8 + i * 0.3], opacity: [0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <HugeiconsIcon icon={Loading01Icon} size={32} className="text-primary animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Moodboard genereren</h2>
              <p className="text-sm text-muted-foreground">AI analyseert je voorkeuren...</p>
            </motion.div>
          )}

          {/* ─────────────────────── ERROR ─────────────────────── */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-[calc(100vh-60px)] flex flex-col items-center justify-center"
            >
              <HugeiconsIcon icon={AlertCircleIcon} size={40} className="text-destructive mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Er ging iets mis</h2>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">{error}</p>
              <Button onClick={restart} variant="outline" className="gap-2">
                <HugeiconsIcon icon={RefreshIcon} size={16} /> Opnieuw
              </Button>
            </motion.div>
          )}

          {/* ─────────────────────── RESULT ─────────────────────── */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="py-24 md:py-32"
            >
              {/* ── Header ── */}
              <div className="text-center mb-16 border-b border-border pb-16">
                <p className="text-sm font-medium text-primary tracking-wide uppercase mb-4">Jouw moodboard</p>
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground tracking-tight leading-[1.1] mb-5">
                  Jouw unieke{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    design concept
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {result.samenvatting}
                </p>
              </div>

              {/* ── Color palette ── */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon icon={PaintBoardIcon} size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Kleurenpalet</h2>
                  </div>
                </div>
                <div className="flex gap-2 md:gap-3 h-28 md:h-40 rounded-2xl overflow-hidden">
                  {result.moodboard.kleuren.map((color, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-[2]"
                      style={{ backgroundColor: color }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white text-[10px] md:text-xs font-mono">{color}</p>
                        <p className="text-white/70 text-[10px]">{result.moodboard.kleurNamen?.[i]}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ── Two-column: Typography + Sfeer ── */}
              <section className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden mb-16">
                <div className="bg-card p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <HugeiconsIcon icon={TextFontIcon} size={16} className="text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Typografie</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Heading</p>
                      <p className="text-2xl md:text-3xl font-bold text-foreground">{result.moodboard.typografie.heading}</p>
                    </div>
                    <div className="border-t border-border pt-6">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Body</p>
                      <p className="text-base text-foreground leading-relaxed">{result.moodboard.typografie.body}</p>
                      <p className="text-sm text-muted-foreground mt-2">Aa Bb Cc Dd Ee Ff 0123456789</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Sfeer</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {result.moodboard.sfeer.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1.5 rounded-full border border-border bg-muted/30 text-sm text-foreground font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-border pt-6">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Visuele richting</p>
                    <p className="text-sm text-foreground leading-relaxed">{result.moodboard.stijl}</p>
                  </div>
                </div>
              </section>

              {/* ── Layout + Inspiratie ── */}
              <section className="grid md:grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden mb-16">
                <div className="bg-card p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <HugeiconsIcon icon={LayoutTableIcon} size={16} className="text-primary" />
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Layout</h3>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.moodboard.layoutStijl}</p>
                </div>
                {result.moodboard.inspiratie && (
                  <div className="bg-card p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <HugeiconsIcon icon={StarIcon} size={16} className="text-primary" />
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Inspiratie</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{result.moodboard.inspiratie}</p>
                  </div>
                )}
              </section>

              {/* ── Pakketadvies ── */}
              <section className="border border-border rounded-2xl overflow-hidden mb-16">
                <div className="bg-card p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <HugeiconsIcon icon={Award01Icon} size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Pakketadvies</h3>
                      <p className="text-sm text-muted-foreground">Op basis van jouw antwoorden</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    <div className="flex-1">
                      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                        {result.pakketAdvies.aanbevolen}
                      </div>
                      <p className="text-foreground leading-relaxed">{result.pakketAdvies.reden}</p>
                    </div>
                    {result.pakketAdvies.extras.length > 0 && (
                      <div className="md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-medium">Extras</p>
                        <ul className="space-y-2.5">
                          {result.pakketAdvies.extras.map((extra) => (
                            <li key={extra} className="flex items-start gap-2 text-sm text-foreground">
                              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary mt-0.5 shrink-0" />
                              {extra}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Chat ── */}
              <section className="border border-border rounded-2xl overflow-hidden mb-16">
                <div className="bg-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <HugeiconsIcon icon={MessageMultiple01Icon} size={20} className="text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Verfijn je concept</h3>
                      <p className="text-xs text-muted-foreground">Stel vragen of pas je moodboard aan</p>
                    </div>
                  </div>

                  {chatMessages.length > 0 && (
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isChatting && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5">
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Stel een vraag over je moodboard..."
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendFollowUp()}
                      disabled={isChatting}
                      className="h-11"
                    />
                    <Button
                      onClick={sendFollowUp}
                      disabled={isChatting || !chatInput.trim()}
                      size="icon"
                      className="h-11 w-11 shrink-0"
                    >
                      <HugeiconsIcon icon={SentIcon} size={16} />
                    </Button>
                  </div>
                </div>
              </section>

              {/* ── Contact CTA ── */}
              <section className="border border-border rounded-2xl overflow-hidden mb-16">
                <div className="bg-card p-8 md:p-10">
                  {contactSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-6"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Bedankt voor je interesse</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        We nemen zo snel mogelijk contact met je op om je project te bespreken.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <HugeiconsIcon icon={Mail01Icon} size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">Klaar om te starten?</h3>
                          <p className="text-sm text-muted-foreground">
                            Laat je gegevens achter en we nemen contact op om je moodboard te bespreken.
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="relative">
                          <HugeiconsIcon icon={User03Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            value={contactForm.naam}
                            onChange={(e) => setContactForm(f => ({ ...f, naam: e.target.value }))}
                            placeholder="Je naam *"
                            className="pl-10 h-11"
                          />
                        </div>
                        <div className="relative">
                          <HugeiconsIcon icon={Mail01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="Je e-mailadres *"
                            className="pl-10 h-11"
                          />
                        </div>
                        <div className="relative">
                          <HugeiconsIcon icon={SmartPhone01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            value={contactForm.telefoon}
                            onChange={(e) => setContactForm(f => ({ ...f, telefoon: e.target.value }))}
                            placeholder="Telefoonnummer"
                            className="pl-10 h-11"
                          />
                        </div>
                        <div className="relative">
                          <HugeiconsIcon icon={Building06Icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            value={contactForm.bedrijfsnaam}
                            onChange={(e) => setContactForm(f => ({ ...f, bedrijfsnaam: e.target.value }))}
                            placeholder="Bedrijfsnaam"
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={submitContact}
                        disabled={contactLoading || !contactForm.naam.trim() || !contactForm.email.trim()}
                        className="gap-2 h-11 px-6"
                      >
                        {contactLoading ? (
                          <HugeiconsIcon icon={Loading01Icon} size={16} className="animate-spin" />
                        ) : (
                          <HugeiconsIcon icon={SentIcon} size={16} />
                        )}
                        Neem contact met mij op
                      </Button>
                    </>
                  )}
                </div>
              </section>

              {/* ── CTA ── */}
              <div className="flex items-center justify-center gap-3 border-t border-border pt-12">
                <Link to="/pakketten">
                  <Button size="lg" className="gap-2 h-12 px-7">
                    Bekijk pakketten <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={restart} className="gap-2 h-12 px-7">
                  <HugeiconsIcon icon={RefreshIcon} size={16} /> Opnieuw
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
