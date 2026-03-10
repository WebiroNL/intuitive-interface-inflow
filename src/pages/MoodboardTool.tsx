import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Sparkles, Palette, Type, Layout, MessageCircle, Send,
  Loader2, RefreshCw, Check, ChevronRight, AlertTriangle,
  UtensilsCrossed, ShoppingBag, Briefcase, Monitor, Heart, PenTool,
  Target, DollarSign, Star, BookOpen, Mail, Building2,
  Minus, Zap, Leaf, BarChart3, Gem, Puzzle,
  Moon, Sun, TreePine, Waves, Rainbow, Circle,
  FileText, Files, Layers, Library, HelpCircle,
  Coins, CreditCard, Trophy, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePageMeta } from "@/utils/seo";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

/* ─── Quiz Data ─── */
const quizSteps: Array<{
  id: string;
  question: string;
  subtitle: string;
  options: string[];
  icons: LucideIcon[];
}> = [
  {
    id: "branche",
    question: "In welke branche\nzit je?",
    subtitle: "Dit helpt ons de juiste visuele taal te kiezen.",
    options: ["Horeca", "Retail / E-commerce", "Dienstverlening", "Tech / SaaS", "Gezondheid / Wellness", "Creatief / Design"],
    icons: [UtensilsCrossed, ShoppingBag, Briefcase, Monitor, Heart, PenTool],
  },
  {
    id: "doel",
    question: "Wat is het belangrijkste\ndoel van je website?",
    subtitle: "We stemmen het design af op jouw conversiedoel.",
    options: ["Meer klanten aantrekken", "Online verkopen", "Professionele uitstraling", "Informatie delen", "Leads genereren", "Merk opbouwen"],
    icons: [Target, DollarSign, Star, BookOpen, Mail, Building2],
  },
  {
    id: "stijl",
    question: "Welke stijl past\nbij jouw merk?",
    subtitle: "Kies de richting die het beste aanvoelt.",
    options: ["Minimalistisch & clean", "Bold & opvallend", "Warm & organisch", "Zakelijk & professioneel", "Luxe & premium", "Speels & creatief"],
    icons: [Minus, Zap, Leaf, BarChart3, Gem, Puzzle],
  },
  {
    id: "kleuren",
    question: "Welke kleurrichting\nspreekt je aan?",
    subtitle: "De basis voor jouw kleurenpalet.",
    options: ["Donker & sophisticated", "Licht & fris", "Aarde-tinten & warm", "Blauw & vertrouwen", "Levendig & energiek", "Neutraal & tijdloos"],
    icons: [Moon, Sun, TreePine, Waves, Rainbow, Circle],
  },
  {
    id: "paginas",
    question: "Hoeveel pagina's\nheb je nodig?",
    subtitle: "Bepaalt de complexiteit en het pakket.",
    options: ["1 pagina (one-pager)", "2-5 pagina's", "5-10 pagina's", "10+ pagina's", "Weet ik nog niet"],
    icons: [FileText, Files, Layers, Library, HelpCircle],
  },
  {
    id: "budget",
    question: "Wat is je\nbudget indicatie?",
    subtitle: "We adviseren altijd eerlijk, nooit het duurste.",
    options: ["€500 - €1.000", "€1.000 - €2.000", "€2.000 - €5.000", "€5.000+", "Weet ik nog niet"],
    icons: [Coins, CreditCard, Gem, Trophy, HelpCircle],
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

/* ─── Animated gradient background ─── */
function GradientOrb({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl opacity-15 pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color }}
      animate={{ scale: [1, 1.2, 1], x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
      transition={{ duration: 8, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ─── Decorative floating grid lines (Stripe-style) ─── */
function DecorativeGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Horizontal lines */}
      {[20, 40, 60, 80].map((top) => (
        <motion.div
          key={`h-${top}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"
          style={{ top: `${top}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: top * 0.01, duration: 1 }}
        />
      ))}
      {/* Decorative dots at intersections */}
      {[
        { x: "15%", y: "20%" }, { x: "85%", y: "40%" },
        { x: "25%", y: "60%" }, { x: "75%", y: "80%" },
      ].map((pos, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
          style={{ left: pos.x, top: pos.y }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
        />
      ))}
    </div>
  );
}

/* ─── Decorative floating card (fills empty space on quiz left side) ─── */
function FloatingDecor({ step }: { step: number }) {
  const labels = ["Branche", "Doel", "Stijl", "Kleuren", "Pagina's", "Budget"];
  return (
    <motion.div
      className="hidden lg:flex absolute -bottom-8 -left-4 flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Mini summary of answered questions */}
      <div className="bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl p-4 shadow-lg shadow-primary/5 max-w-[220px]">
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-medium">Jouw selectie</p>
        {labels.slice(0, step).map((label, i) => (
          <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <Check className="w-3 h-3 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{label}</span>
          </div>
        ))}
        {step === 0 && <p className="text-xs text-muted-foreground/60 italic">Begin met je eerste keuze</p>}
      </div>
    </motion.div>
  );
}

/* ─── Step dots ─── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i < current ? "bg-primary" : i === current ? "bg-primary" : "bg-border"
          }`}
          animate={{ width: i === current ? 24 : 8, height: 8 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* ─── Loading animation ─── */
function GeneratingAnimation() {
  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-32"
    >
      <div className="relative w-32 h-32 mb-10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
        </motion.div>
      </div>
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-foreground mb-3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        AI analyseert je voorkeuren...
      </motion.h2>
      <p className="text-muted-foreground text-lg">Een moment, we creeren je unieke moodboard.</p>

      {/* Decorative loading bars */}
      <div className="flex gap-3 mt-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full bg-primary/20"
            animate={{ height: [16, 40, 16] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
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
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
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
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background layers */}
      <GradientOrb color="hsl(var(--primary))" size={600} x="-10%" y="-20%" delay={0} />
      <GradientOrb color="hsl(var(--accent))" size={500} x="70%" y="10%" delay={2} />
      <GradientOrb color="hsl(var(--primary))" size={400} x="20%" y="70%" delay={4} />
      <DecorativeGrid />

      {/* Progress line */}
      <div className="fixed top-[72px] left-0 right-0 z-30">
        <motion.div
          className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ width: "0%" }}
          animate={{ width: result ? "100%" : `${((step + 1) / (quizSteps.length + 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        <AnimatePresence mode="wait">
          {/* ─── QUIZ STATE ─── */}
          {!result && !isGenerating && !error && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start min-h-[60vh]">
                {/* Left: Question */}
                <div className="flex flex-col justify-center relative">
                  <StepDots current={step} total={quizSteps.length} />

                  <motion.p
                    className="text-sm font-medium text-primary mt-8 mb-4 tracking-wide uppercase"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Vraag {step + 1} / {quizSteps.length}
                  </motion.p>

                  <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight whitespace-pre-line"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                  >
                    {quizSteps[step].question}
                  </motion.h1>

                  <motion.p
                    className="text-lg text-muted-foreground mt-5 max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    {quizSteps[step].subtitle}
                  </motion.p>

                  {step > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                      <button
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-2 mt-8 text-muted-foreground hover:text-foreground transition-colors group"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Vorige vraag</span>
                      </button>
                    </motion.div>
                  )}

                  <FloatingDecor step={step} />
                </div>

                {/* Right: Options */}
                <div className="flex flex-col justify-center">
                  <div className="space-y-3">
                    {quizSteps[step].options.map((option, i) => {
                      const Icon = quizSteps[step].icons[i];
                      return (
                        <motion.button
                          key={option}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                          onClick={() => handleAnswer(option)}
                          onMouseEnter={() => setHoveredOption(i)}
                          onMouseLeave={() => setHoveredOption(null)}
                          className={`w-full text-left group relative flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all duration-300 ${
                            answers[quizSteps[step].id] === option
                              ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                              : "border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/40 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
                          }`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors shrink-0">
                            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <span className="text-base font-medium text-foreground flex-1">{option}</span>
                          <ChevronRight
                            className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${
                              hoveredOption === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── GENERATING STATE ─── */}
          {isGenerating && <GeneratingAnimation />}

          {/* ─── ERROR STATE ─── */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Er ging iets mis</h2>
              <p className="text-muted-foreground mb-8 text-center max-w-md">{error}</p>
              <Button onClick={restart} size="lg" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Opnieuw proberen
              </Button>
            </motion.div>
          )}

          {/* ─── RESULT STATE ─── */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero result header */}
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Check className="w-4 h-4" />
                  Jouw moodboard is klaar
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                  Jouw unieke
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    design concept
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {result.samenvatting}
                </p>
              </motion.div>

              {/* Color palette */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex gap-3 h-40 md:h-56 rounded-3xl overflow-hidden shadow-2xl shadow-foreground/5">
                  {result.moodboard.kleuren.map((color, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 relative group cursor-pointer"
                      style={{ backgroundColor: color }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                      whileHover={{ flex: 2 }}
                    >
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white/90 text-xs font-mono">{color}</p>
                        <p className="text-white/70 text-xs mt-0.5">{result.moodboard.kleurNamen?.[i]}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Bento grid */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
                {/* Typography - spans 2 cols */}
                <motion.div
                  className="md:col-span-2 bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Type className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Typografie</h3>
                      <p className="text-xs text-muted-foreground">Font combinatie</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Heading Font</p>
                      <p className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{result.moodboard.typografie.heading}</p>
                      <p className="text-sm text-muted-foreground mt-2">Aa Bb Cc 123</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Body Font</p>
                      <p className="text-xl text-foreground">{result.moodboard.typografie.body}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Sfeer keywords */}
                <motion.div
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Sfeer</h3>
                      <p className="text-xs text-muted-foreground">Keywords</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.moodboard.sfeer.map((keyword, i) => (
                      <motion.span
                        key={keyword}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-foreground text-sm font-medium border border-primary/10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Stijl */}
                <motion.div
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-8 hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Layout className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Stijl</h3>
                      <p className="text-xs text-muted-foreground">Visuele richting</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{result.moodboard.stijl}</p>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{result.moodboard.layoutStijl}</p>
                </motion.div>

                {/* Pakketadvies - spans 2 cols */}
                <motion.div
                  className="md:col-span-2 relative overflow-hidden rounded-3xl border border-primary/20 p-8 hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-500"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--primary) / 0.04), hsl(var(--accent) / 0.06), hsl(var(--primary) / 0.03))`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                      <div className="flex-1 min-w-[280px]">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Award className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Pakketadvies</h3>
                            <p className="text-xs text-muted-foreground">Op basis van jouw antwoorden</p>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-lg font-bold mb-4">
                          {result.pakketAdvies.aanbevolen}
                        </div>
                        <p className="text-foreground leading-relaxed">{result.pakketAdvies.reden}</p>
                      </div>
                      {result.pakketAdvies.extras.length > 0 && (
                        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5 min-w-[220px]">
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">Aanbevolen extras</p>
                          <ul className="space-y-2">
                            {result.pakketAdvies.extras.map((extra) => (
                              <li key={extra} className="flex items-start gap-2 text-sm text-foreground">
                                <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                {extra}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Inspiratie */}
              {result.moodboard.inspiratie && (
                <motion.div
                  className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-8 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Visuele Inspiratie
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{result.moodboard.inspiratie}</p>
                </motion.div>
              )}

              {/* Chat section */}
              <motion.div
                className="bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-6 md:p-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Verfijn je concept</h3>
                    <p className="text-xs text-muted-foreground">Stel vragen of pas je moodboard aan</p>
                  </div>
                </div>

                {chatMessages.length > 0 && (
                  <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-2">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-md"
                              : "bg-muted text-foreground rounded-tl-md"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {isChatting && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-tl-md px-5 py-3">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-muted-foreground/40"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                <div className="flex gap-3">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Bijv. 'Maak het kleurenpalet warmer' of 'Wat als ik meer paginas nodig heb?'"
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendFollowUp()}
                    disabled={isChatting}
                    className="rounded-xl h-12 text-base bg-background/50"
                  />
                  <Button
                    onClick={sendFollowUp}
                    disabled={isChatting || !chatInput.trim()}
                    size="icon"
                    className="h-12 w-12 rounded-xl shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
              >
                <Link to="/pakketten">
                  <Button size="lg" className="gap-2 h-14 px-8 text-base rounded-xl">
                    Bekijk pakketten <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" onClick={restart} className="gap-2 h-14 px-8 text-base rounded-xl">
                  <RefreshCw className="w-4 h-4" /> Opnieuw starten
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
