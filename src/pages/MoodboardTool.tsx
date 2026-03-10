import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Palette, Type, Layout, MessageCircle, Send, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StructuredData } from "@/components/StructuredData";
import { updatePageMeta } from "@/utils/seo";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

/* ─── Quiz Data ─── */
const quizSteps = [
  {
    id: "branche",
    question: "In welke branche zit je?",
    options: ["Horeca", "Retail / E-commerce", "Dienstverlening", "Tech / SaaS", "Gezondheid / Wellness", "Creatief / Design"],
  },
  {
    id: "doel",
    question: "Wat is het belangrijkste doel van je website?",
    options: ["Meer klanten aantrekken", "Online verkopen", "Professionele uitstraling", "Informatie delen", "Leads genereren", "Merk opbouwen"],
  },
  {
    id: "stijl",
    question: "Welke stijl past het best bij jouw merk?",
    options: ["Minimalistisch & clean", "Bold & opvallend", "Warm & organisch", "Zakelijk & professioneel", "Luxe & premium", "Speels & creatief"],
  },
  {
    id: "kleuren",
    question: "Welke kleurrichting spreekt je aan?",
    options: ["Donker & sophisticated", "Licht & fris", "Aarde-tinten & warm", "Blauw & vertrouwen", "Levendig & energiek", "Neutraal & tijdloos"],
  },
  {
    id: "paginas",
    question: "Hoeveel pagina's heb je nodig?",
    options: ["1 pagina (one-pager)", "2-5 pagina's", "5-10 pagina's", "10+ pagina's", "Weet ik nog niet"],
  },
  {
    id: "budget",
    question: "Wat is je budget indicatie?",
    options: ["€500 - €1.000", "€1.000 - €2.000", "€2.000 - €5.000", "€5.000+", "Weet ik nog niet"],
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

  useEffect(() => {
    updatePageMeta(
      "AI Moodboard Generator | Webiro",
      "Ontdek jouw perfecte webdesign stijl met onze AI-tool. Beantwoord 6 vragen en ontvang een persoonlijk moodboard en pakketadvies."
    );
  }, []);

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
      if (data?.result?.moodboard) {
        setResult(data.result);
      }
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

  const progress = result ? 100 : ((step + 1) / (quizSteps.length + 1)) * 100;

  return (
    <>
      <StructuredData type="WebSite" />

      <main className="min-h-screen bg-background pt-24 pb-20">
        {/* Progress bar */}
        <div className="fixed top-[72px] left-0 right-0 z-30 h-1 bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI Moodboard Generator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Ontdek jouw perfecte webdesign stijl
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              Beantwoord 6 korte vragen en onze AI genereert een persoonlijk moodboard met kleuren, typografie en pakketadvies.
            </p>
          </div>

          {/* Quiz or Result */}
          <AnimatePresence mode="wait">
            {!result && !isGenerating && !error && (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Vraag {step + 1} van {quizSteps.length}
                </p>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
                  {quizSteps[step].question}
                </h2>
                <div className="grid gap-3">
                  {quizSteps[step].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="text-left px-5 py-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <span className="text-foreground group-hover:text-primary font-medium">
                        {option}
                      </span>
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <Button variant="ghost" className="mt-6" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Vorige vraag
                  </Button>
                )}
              </motion.div>
            )}

            {isGenerating && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Moodboard wordt gegenereerd...
                </h2>
                <p className="text-muted-foreground">
                  Onze AI analyseert je voorkeuren en creëert een uniek concept.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={restart}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Opnieuw proberen
                </Button>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Summary */}
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8">
                  <p className="text-foreground leading-relaxed">{result.samenvatting}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Color palette */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Kleurenpalet</h3>
                    </div>
                    <div className="flex gap-2 mb-4">
                      {result.moodboard.kleuren.map((color, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className="w-full aspect-square rounded-xl shadow-sm border border-border/40"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[10px] text-muted-foreground font-mono">{color}</span>
                          <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                            {result.moodboard.kleurNamen?.[i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Type className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Typografie</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Heading</p>
                        <p className="text-2xl font-bold text-foreground">{result.moodboard.typografie.heading}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Body</p>
                        <p className="text-base text-foreground">{result.moodboard.typografie.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Style & mood */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Layout className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Stijl & Sfeer</h3>
                    </div>
                    <p className="text-sm text-foreground mb-3">{result.moodboard.stijl}</p>
                    <div className="flex flex-wrap gap-2">
                      {result.moodboard.sfeer.map((keyword) => (
                        <span key={keyword} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">{result.moodboard.layoutStijl}</p>
                  </div>

                  {/* Package advice */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Pakketadvies</h3>
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-3">
                      {result.pakketAdvies.aanbevolen}
                    </div>
                    <p className="text-sm text-foreground mb-3">{result.pakketAdvies.reden}</p>
                    {result.pakketAdvies.extras.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Aanbevolen extras</p>
                        <ul className="text-sm text-foreground space-y-1">
                          {result.pakketAdvies.extras.map((extra) => (
                            <li key={extra}>• {extra}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspiration */}
                {result.moodboard.inspiratie && (
                  <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                    <h3 className="font-semibold text-foreground mb-2">Visuele Inspiratie</h3>
                    <p className="text-sm text-muted-foreground">{result.moodboard.inspiratie}</p>
                  </div>
                )}

                {/* Chat follow-up */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Stel een vervolgvraag</h3>
                  </div>

                  {chatMessages.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                      {isChatting && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-xl px-4 py-2.5">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Bijv. 'Kan het kleurenpalet wat warmer?' of 'Wat kost extra SEO?'"
                      onKeyDown={(e) => e.key === "Enter" && sendFollowUp()}
                      disabled={isChatting}
                    />
                    <Button onClick={sendFollowUp} disabled={isChatting || !chatInput.trim()} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/pakketten">
                    <Button size="lg" className="gap-2">
                      Bekijk pakketten <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" onClick={restart} className="gap-2">
                    <RefreshCw className="w-4 h-4" /> Opnieuw starten
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
