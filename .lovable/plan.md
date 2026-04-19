

## Plan

### 1. Nieuwe "Recent werk" sectie — iPhone carousel

Vervang de huidige featured-iframe + 5 platte gradient cards door **één horizontale carousel met realistische iPhone mockups** waar elke website live in draait.

**Layout & gedrag:**
- Sectiekop links: "Recent werk" + ondertitel. Rechtsboven: "Bekijk meer" link + nav-arrows (`‹` `›`).
- Strip van 6 kaarten naast elkaar, horizontaal scrollbaar (snap-points). Op desktop ≈3 zichtbaar, mobiel 1.2 zichtbaar (peek van volgende).
- Elke kaart bevat:
  - **iPhone 15-style frame** (afgeronde corners ~44px, donkere bezel ~10px, dynamic island bovenin, side-buttons subtiel).
  - **Mobile iframe** (geschaald naar 390px breed device-viewport) van de echte website, met `LazyIframe` en auto-scroll animatie verticaal (zoals nu Allround).
  - Onder mockup: categorie tag, titel, korte beschrijving, services badges, "Bekijk website →".
- Achtergrond per kaart: subtiele gradient die past bij de site (warm voor fashion, koel voor legal, etc.).
- Auto-advance optioneel uit; gebruiker swipet/scrollt zelf. Hover pauzeert eventuele auto-scroll.

**Performance:**
- Iframes lazy-loaden (alleen zichtbare + 1 buffer), de rest een gradient placeholder tot ze in viewport komen → IntersectionObserver in `LazyIframe` doet dit al deels.
- Op mobiel: max 1 iframe tegelijk actief om data/CPU te sparen, rest blijft poster-frame (screenshot of gradient).

**Bestanden:**
- `src/pages/Home.tsx`: SHOWCASE-blok (lijnen 516–646) volledig vervangen.
- Nieuwe component: `src/components/PhoneShowcase.tsx` met `<PhoneFrame>` subcomponent en de carousel-logica (CSS scroll-snap + arrow-buttons die `scrollBy` aanroepen).

### 2. Mobiele hero visual

Probleem: `AnimatedDashboard` heeft `hidden lg:flex` → onzichtbaar < 1024px. `SilkWaves` skipt canvas op < 768px → vlak background.

**Oplossing (geen vraag beantwoord, ik kies veilige default):**
- Voeg op mobiel/tablet (< lg) een **compacte versie van `AnimatedDashboard`** toe ónder de tekst+CTA's. Geschaald op ~280px breed, gecentreerd.
- Achtergrond: vervang de SilkWaves-skip door een lichte CSS radial-gradient (primary/8 → transparent) zodat de hero ook mobiel "leeft" zonder canvas-cost.
- Behoud `hidden lg:flex` voor de grote desktop-variant rechts.

**Bestand:**
- `src/pages/Home.tsx` HERO sectie (lijnen 200–252): tweede `AnimatedDashboard` toevoegen met `lg:hidden mt-10` wrapper.
- `src/components/SilkWaves.tsx`: bij mobile-skip een `<div>` met statische gradient-className renderen i.p.v. `null`.

### 3. Visueel resultaat

```text
DESKTOP                            MOBIEL
┌──────────────────────────┐       ┌────────────────┐
│  Recent werk      ‹ ›    │       │ Recent werk    │
│ ┌──┐ ┌──┐ ┌──┐ ┌──     │       │  ┌──┐          │
│ │📱│ │📱│ │📱│ │📱   →│       │  │📱│ ─→ swipe │
│ └──┘ └──┘ └──┘ └──     │       │  └──┘          │
│ Allr. Matrix CKN  Coco   │       │  Allround      │
└──────────────────────────┘       └────────────────┘
```

### Vraag voor mobiele hero

Ik ga uit van **"compacte AnimatedDashboard tonen + lichte gradient"** tenzij je iets anders kiest na approval.

