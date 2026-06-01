## Redesign MacBook Showcase sectie

De huidige sectie krijgt een complete visuele upgrade in lijn met de Webiro Stripe-aesthetic (bento cards, donker, blauw/paars glow, vertical grid).

### Nieuwe layout

```text
┌─────────────────────────────────────────────────────────────┐
│  Sectie header (huidige titel behouden)                     │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────┐ ┌────────────────────┐ │
│ │  BENTO CARD (groot, 2fr)         │ │ BENTO CARD (1fr)   │ │
│ │  • Gradient border glow          │ │ Recent werk        │ │
│ │  • Subtiele blauw/paars gloed    │ │                    │ │
│ │  ┌────────────────────────────┐  │ │ 01 ─ ATC           │ │
│ │  │ Browser chrome             │  │ │     Fitness        │ │
│ │  │ ● ● ●  atc.nl         🔒  │  │ │ ─────────────────  │ │
│ │  ├────────────────────────────┤  │ │ 02 ─ Bedrijf B  ▸  │ │
│ │  │                            │  │ │     Categorie      │ │
│ │  │   Website iframe           │  │ │ ─────────────────  │ │
│ │  │   (desktop 1440x900)       │  │ │ 03 ─ ...           │ │
│ │  │                            │  │ │                    │ │
│ │  └────────────────────────────┘  │ │ (actieve = blauwe  │ │
│ │                                  │ │  accent + indicator│ │
│ │  Caption: categorie · titel      │ │  links)            │ │
│ │  Korte beschrijving · CTA        │ │                    │ │
│ └──────────────────────────────────┘ └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Wijzigingen

**1. Linker bento card (website preview)**
- Vervang MacBook frame door clean browser window mockup (Stripe stijl)
- Browser chrome: drie window dots, URL bar met `https://` lock icoon en domein van actieve site
- Iframe blijft op desktop viewport (1440×900) met scale-down
- Card: `rounded-2xl`, `border-border/50`, subtiele `bg-gradient` van card naar transparant
- Border glow effect via radial gradient (blauw → paars), gelijk aan bestaande bento cards
- Onder browser: kleine caption met categorie label, titel, 1 regel beschrijving, "Bekijk website" link met Hugeicons arrow

**2. Rechter bento card (lijst)**
- Eigen bento card met titel "Recent werk" bovenaan
- Items met formaat: `01 ─ Bedrijfsnaam` / `Categorie`
- Dunne `border-b border-border/40` tussen items
- Actieve item: blauwe verticale accent-bar links + lichte achtergrond highlight + Hugeicons chevron rechts
- Hover state: subtiele bg shift
- Smooth transitions via framer-motion

**3. Visuele afwerking sectie**
- Section padding consistent met andere secties op de homepage
- Geen nieuwe sectietitel (huidige behouden)
- Respecteert globale vertical grid lines (geen overlap)
- Mobile: bento cards stacken verticaal, lijst wordt horizontale scroll van pill-cards

### Technische details

**Bestand:** `src/components/MacbookShowcase.tsx` (volledige rewrite)

- `MacBookFrame` component vervangen door `BrowserFrame` component
- Behoud: `ResizeObserver` scale-logica, `LazyIframe` eager loading, `ShowcaseItem` interface
- Behoud: framer-motion AnimatePresence voor wisseling
- Nieuw: URL bar toont `new URL(activeItem.url).hostname`
- Hugeicons gebruikt voor: lock (URL bar), chevron-right (actieve item), arrow-up-right (CTA link)
- Tailwind semantic tokens: `bg-card`, `border-border`, `text-muted-foreground`, `text-primary`
- Component grootte: blijft onder 250 regels

**Geen wijzigingen aan:** `Home.tsx` (import en data blijven hetzelfde), `showcaseItems` data.
