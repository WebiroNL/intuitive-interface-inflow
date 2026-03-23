import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import verandaXlPhoto from "@/assets/reviews/veranda-xl.jpg";
import hofstedePhoto from "@/assets/reviews/hofstede-automotive.png";

const reviews = [
  { name: "Greg Vermeer", role: "Local Guide", text: "Perfecte website gemaakt, ik kan niet geloven dat ze gewoon een heel bestel systeem gemaakt hebben volledig custom. Ze hebben werkelijk voldaan aan al onze wensen!", initials: "GV", color: "from-emerald-500 to-teal-600" },
  { name: "Hofstede Automotive B.V.", role: "Automotive", text: "Sinds onze samenwerking merken wij een duidelijke toename in het aantal telefoontjes voor onze diensten in de werkplaats. Daarnaast zien we dat het aantal bezoekers op onze website aanzienlijk is gestegen. Opvallend is dat ook klanten die niet specifiek naar onze naam zoeken, toch bij ons terechtkomen.", initials: "HA", color: "from-blue-500 to-indigo-600", photo: hofstedePhoto },
  { name: "Veranda XL", role: "Bouw & Verbouw", text: "Dankzij dit bedrijf hebben we heel het backend proces en de website geautomatiseerd! Hierdoor heeft het team een enorme boost en veel meer ruimte op groei gekregen! Onze dank is groot!", initials: "VX", color: "from-orange-500 to-red-500", photo: verandaXlPhoto },
  { name: "Royal Blue Spa", role: "Wellness", text: "Webiro voert nu bijna 2 maanden onze Google Advertenties uit. Sinds de samenwerking hebben wij een stijging van bijna 60% in omzet! Communicatie verloopt soepel en reactietijd is snel. Overzichtelijke rapportages van de prestaties en altijd bezig met verbeteringen van de campagnes.", initials: "RB", color: "from-purple-500 to-violet-600" },
  { name: "Christina N.", role: "CKN Legal", text: "Professionele website die perfect aansluit bij mijn juridische diensten. De samenwerking verliep uitstekend.", initials: "CN", color: "from-pink-500 to-rose-600" },
  { name: "Nawid Z.", role: "Prokick Academie", text: "Onze voetbalschool heeft nu een website waar we echt trots op zijn! Professioneel en modern.", initials: "NZ", color: "from-cyan-500 to-blue-500" },
];

const GoogleLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export function ReviewsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = useCallback((newIndex: number) => {
    setDirection(newIndex > active ? 1 : -1);
    setActive(newIndex);
  }, [active]);

  const next = useCallback(() => {
    setDirection(1);
    setActive((p) => (p + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((p) => (p - 1 + reviews.length) % reviews.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const review = reviews[active];

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GoogleLogo />
              {[...Array(5)].map((_, i) => (
                <HugeiconsIcon key={i} icon={StarIcon} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
              ))}
              <span className="text-[13px] font-semibold text-muted-foreground ml-1">5.0 · {reviews.length} reviews</span>
            </div>
            <h2 className="font-bold tracking-[-0.025em] leading-[1.08]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.1rem)" }}>
              Wat klanten zeggen
            </h2>
          </div>
          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border bg-card hover:bg-accent flex items-center justify-center transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Main review display */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Featured review */}
          <div className="relative rounded-2xl border border-border bg-card p-8 lg:p-10 min-h-[260px] overflow-hidden">
            <GoogleLogo className="w-6 h-6 absolute top-8 right-8 lg:top-10 lg:right-10 opacity-40" />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-1.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <HugeiconsIcon key={i} icon={StarIcon} className="w-4 h-4 fill-webiro-yellow text-webiro-yellow" />
                  ))}
                </div>
                <p className="text-[16px] lg:text-[18px] text-foreground leading-relaxed mb-8 max-w-2xl">
                  "{review.text}"
                </p>
                <div className="mt-auto flex items-center gap-3">
                  {review.photo ? (
                    <img src={review.photo} alt={review.name} className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {review.initials}
                    </div>
                  )}
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{review.name}</p>
                    <p className="text-[12px] text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Review selector list */}
          <div className="flex flex-col gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.name}
                onClick={() => navigate(i)}
                className={`relative flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                  i === active
                    ? "bg-card border border-primary/30 shadow-sm"
                    : "hover:bg-card/60 border border-transparent"
                }`}
              >
                {r.photo ? (
                  <img src={r.photo} alt={r.name} className="w-9 h-9 rounded-full object-cover object-top flex-shrink-0" />
                ) : (
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                    {r.initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className={`text-[13px] font-semibold truncate ${i === active ? "text-foreground" : "text-muted-foreground"}`}>
                    {r.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.role}</p>
                </div>
                {i === active && (
                  <motion.div
                    layoutId="review-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Progress dots + CTA */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
          <a
            href="https://www.google.com/maps/place/Webiro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:border-primary/30 transition-all text-[13px] font-semibold text-muted-foreground hover:text-foreground"
          >
            <GoogleLogo className="w-4 h-4" />
            Bekijk alle reviews
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
