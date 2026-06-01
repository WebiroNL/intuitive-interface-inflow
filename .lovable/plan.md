## Doel

Vervang de huidige browser-preview + genummerde lijst showcase door een asymmetrisch bento grid dat aansluit op de rest van Webiro (Stripe-aesthetic, bento cards, Hugeicons, blauw/paars accenten).

## Wat verandert

Alleen `src/components/MacbookShowcase.tsx` wordt herschreven. `Home.tsx` en de data (`showcase`) blijven gelijk — alle 6 projecten worden zichtbaar in plaats van 1-tegelijk via een lijst.

## Layout

12-koloms bento, herhaalt voor alle 6 items:

```text
Row 1:  [ FEATURE 8 ][ COMPACT 4 ]
Row 2:  [ COMPACT 4 ][ FEATURE 8 ]
Row 3:  [ SPLIT 6 ][ SPLIT 6 ]
```

- **Feature card**: tweekoloms binnenkant — links categorie pill + titel + desc + service tags + "Bekijk website" link, rechts live BrowserPreview iframe. `rounded-[2rem]`, `p-8 md:p-10`.
- **Compact card**: verticaal gestapeld — header bovenin, BrowserPreview in het midden, link onderaan. Kleinere titel, max 3 tags.
- **Split card**: zelfde als feature maar in `p-8` en `text-xl` titel.

## Stijldetails

- Per item tint (uit `item.tint`) bepaalt: kleur van categorie-pill (`hsla bg/border/text`), kleur van "Bekijk website" link, en een soft inner-glow border die op hover verschijnt (`box-shadow: inset 0 0 0 1px hsla(tint, 0.35)`).
- Cards: `bg-card`, `border-border/60`, `shadow-sm` → `hover:shadow-xl` met 500ms transition.
- Categorie-pill: uppercase, `tracking-[0.12em]`, ronde pill met getinte border.
- Service tags: kleine `bg-muted/60` chips, uppercase 10px.
- CTA link: pijl `ArrowUpRight01Icon`, schuift schuin omhoog op hover.

Geen aparte CTA-card (CTA-sectie staat al direct onder de showcase op de homepage).

## Behouden

- `ShowcaseItem` interface ongewijzigd.
- `BrowserPreview` (voorheen `BrowserFrame`) blijft live iframe met chrome + URL bar + lock icon, maar wordt nu binnen elke card gebruikt (`loading="lazy"` voor performance bij 6 iframes).
- Alle semantic tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `text-primary`).
- Hugeicons only (`ArrowUpRight01Icon`, `LockIcon`). Geen Lucide, geen emojis.

## Verwijderd

- Genummerde lijst rechts (01-05) + active-bar layoutId animatie.
- `useState(active)` selectiestate, `AnimatePresence` switching.
- `framer-motion` dependency uit dit bestand (alle cards zijn altijd zichtbaar, geen state-overgangen meer).
- `useMemo` voor activeTint.

## Verificatie

Na implementatie: screenshot van de homepage scroll naar showcase, check dat alle 6 projecten zichtbaar zijn in het juiste bento patroon, dat iframes laden en dat tint-kleuren per card kloppen.
