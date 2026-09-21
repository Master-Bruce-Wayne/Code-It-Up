# Code-It-Up — Visual Design System

**Source of truth:** [bugster.dev](https://www.bugster.dev) (screenshots reviewed: nav/hero, live-demo widget + tabs, stats + CTA, "how it works", FAQ, final CTA + footer).
**Goal:** re-skin Code-It-Up's existing pages (currently a dark slate/indigo theme) into this light, hand-annotated, "blueprint" aesthetic.

> Colors below are close reads taken directly off the screenshots, not values pulled from a live stylesheet. They're close enough to build from as-is; if pixel-perfect matching ever matters, verify with an eyedropper against the live site before finalizing brand colors.

---

## 1. Design Concept

The whole site reads like **an annotated design file, not a finished product** — as if you're looking at the Figma canvas itself: a faint blueprint grid, small lime "anchor" squares at layout corners, thin connector lines running from those anchors to little pill-shaped labels ("WHO IT'S FOR", "HOW IT WORKS", "FAQ"). Everything sits on a warm, grainy cream paper texture instead of a flat white. Every card, button, and input has a confident **2px solid black border** — nothing relies on soft drop shadows or gradients for depth; where depth is needed, it's a hard-edged solid-color block offset behind the element instead.

Typography does a lot of the personality work: a **blocky monospace face** for headlines, big stat numbers, and button labels (this reads like source code / a terminal, which is a nice coincidence for a competitive-programming judge platform), paired with a **plain grotesque sans** for body copy, nav links, and card text.

Illustration is flat, thick-outlined, line-art style with a small saturated palette (blue, coral, purple, lime) — see §5 for why we're not literally cloning Bugster's chameleon mascot.

**One-line brief for whoever builds this:** *"A code judge's admin console redrawn as a hand-annotated design mockup — cream graph paper, thick black outlines, mono display type, lime accent, zero soft shadows."*

---

## 2. Design Tokens

### 2.1 Color

| Token | Hex | Use |
|---|---|---|
| `--canvas` | `#EDE8DC` | Main page background (grainy cream) |
| `--canvas-alt` | `#E7E2D6` | Alternate section background (stats, FAQ, "how it works" bands) |
| `--surface` | `#FAF7F0` | Card / panel / input background (off-white, not pure white) |
| `--nav-bg` | `#F6F2E8` | Navbar background |
| `--ink` | `#17181A` | Primary text, all borders, icons |
| `--ink-soft` | `#55534C` | Body copy, secondary text |
| `--ink-muted` | `#8B8878` | Placeholder text, captions, timestamps |
| `--divider` | `#D8D3C4` | Hairline rules (accordion, table rows, footer divider) |
| `--accent-lime` | `#E7F0A0` | Primary button fill, key highlights |
| `--accent-lime-hover` | `#D9E888` | Primary button hover |
| `--accent-blue` | `#3169F0` | Links, folded-corner flap, illustration primary color |
| `--accent-blue-soft` | `#9FC6F7` | Illustration secondary tone, ground/shadow shapes |
| `--accent-coral` | `#F3A79A` | Illustration accent; also maps well to a "Wrong Answer" verdict |
| `--accent-purple` | `#A489E8` | Illustration accent; also maps well to a "TLE" verdict |

This is a **light-only** theme — no dark mode variant in the source. Treat this as a full replacement of the current `bg-slate-950` / indigo palette, not an additive one.

### 2.2 Typography

- **Display / mono** — `"Space Mono", "JetBrains Mono", ui-monospace, monospace`, weight 700 (headings/stats), 400 (rare lighter mono use). Confirmed by letterform (curled `t` foot, single-story hooked `g`, straight-tailed `y`/`q`) from a reference screenshot — free on Google Fonts. Used for: page/section headings, big stat numbers, button labels, small eyebrow pills, underlined inline links like "Learn more →", and technical copy (problem descriptions, format specs, and constraints).
- **Body / sans** — `"Inter", system-ui, sans-serif`, weight 400 (body) / 500–600 (nav links, card titles, footer headers).

| Style | Font | Size | Weight | Notes |
|---|---|---|---|---|
| H1 (hero) | mono | 2.75–3.5rem | 700 | line-height ~1.05, tight tracking |
| H2 (section) | mono | 2–2.25rem | 700 | |
| H3 (card title) | sans | 1.15–1.25rem | 700 | e.g. "For developers" |
| Body | sans | 1rem | 400 | color `--ink-soft`, max ~65ch line length |
| Caption / meta | sans | 0.8rem | 500 | color `--ink-muted` |
| Stat number | mono | 2.5–3rem | 700 | e.g. "10x", "Zero" |
| Button label | mono | 0.85rem | 600–700 | UPPERCASE, letter-spacing ~0.03em |
| Eyebrow pill | mono | 0.7rem | 600 | UPPERCASE, letter-spacing ~0.04em |

### 2.3 Shape, Border, Shadow

- **Border:** `2px solid var(--ink)` on nearly everything — buttons, cards, inputs, the nav's lower announcement bar, window-chrome panels. Hairline `1px solid var(--divider)` only for internal dividers (accordion rows, table rows, footer rule).
- **Radius scale:**
  - `--radius-pill`: `999px` — eyebrow badges, tags, tab containers
  - `--radius-md`: `10px` — buttons, inputs, small chips
  - `--radius-lg`: `20px` — standard cards, window-chrome panels
  - `--radius-xl`: `28px` — hero card, large feature panels
- **Shadow:** flat by default (none). The one recurring "depth" trick is a **solid-color block offset behind a card** (no blur) — e.g. a `--accent-blue` rounded rectangle sitting ~8–10px down-and-right behind a white card, same border-radius, peeking out on two edges. Reserve this for one hero moment per page (e.g. the final CTA), not everywhere — the source site uses it exactly once.

---

## 3. Background & Texture System

Two textures recur and should be built as reusable utility classes/components:

1. **Grain overlay** — a low-opacity (~4–8%) noise texture (SVG `feTurbulence` or a tiled noise PNG) laid over `--canvas` / `--canvas-alt` sections. Gives the cream background a tactile, papery feel instead of flat color.
2. **Blueprint grid + annotation markers** — a faint grid of thin vertical/horizontal lines (like graph paper) over certain sections (stats, "how it works", FAQ), with small **8×8px lime squares outlined in 1px black** sitting at grid intersections / card corners. Some of these squares connect via a thin 1px black line to a small pill badge (e.g. `● ─── [ WHO IT'S FOR ]`). This "annotation marker" is the site's signature motif — build it as one small reusable component (`<AnnotationMarker />` or similar) rather than hand-placing divs.

---

## 4. Core Components

**Navbar**
Cream (`--nav-bg`) bar: logo + icon mark on the left, primary nav links (sans, medium weight) center-left, a secondary button ("Log in" style — surface bg, black border) and a primary button ("Start Testing" style — lime bg, black border, trailing arrow) on the right. Directly below it, an optional full-width **black announcement bar** with white sans text and a small white pill link — useful for contest announcements ("Starters Round #12 begins in 2h →").

**Buttons**
- *Primary:* `--accent-lime` fill, 2px black border, `--radius-md`, mono uppercase black label, optional trailing arrow icon (`→`). Hover: `--accent-lime-hover` + slight upward translate.
- *Secondary:* `--surface` fill, 2px black border, same shape/label treatment, black text.
- Both are small-to-medium (not oversized) — the source site keeps buttons compact and text-driven, not big gradient CTAs.

**Eyebrow / tag pill**
`--surface` fill, 1–2px black border, fully rounded, mono uppercase small text (e.g. "HOW IT WORKS", "FAQ"), paired with an annotation marker (see §3) to its left.

**Cards — three variants**
1. *Standard:* `--surface` fill, 2px black border, `--radius-lg`, generous padding (24–32px).
2. *Folded-corner:* standard card + a triangular `--accent-blue` flap clipped into the top-right corner (a simple `clip-path` triangle) — used once for a hero/feature moment, not on every card.
3. *Offset-block (duotone):* standard card with a solid `--accent-blue` (or other accent) rounded rectangle of the same size/radius sitting 8–10px behind-and-below it, no blur — used for the strongest CTA on a page.

**Window-chrome panel**
Rounded (`--radius-lg`), 2px black border, a top title-bar strip with three small circles (red/amber/green, decorative "window controls"), an optional centered path/URL text, and an optional small pill status badge ("LIVE"). **This maps directly onto Code-It-Up's judge/console output and code-sample blocks** — see §7.

**Tabs**
Rounded-full container, 2px black border. Active tab: solid black pill fill, white text. Inactive tabs: plain text, `--ink-muted`, no fill.

**Stat block**
A bordered row split into 2–4 columns by thin 1px vertical dividers, each column: tiny icon, big mono-bold number/word, short sans label, smaller muted caption underneath.

**Accordion (FAQ-style)**
Stacked list (not individual cards) — bold sans question + chevron (▲ open / ▼ closed) right-aligned, `1px solid var(--divider)` rules between rows, expanded answer in `--ink-soft` body text directly beneath the question.

**Inline code chip**
Small black-fill, white-text, `--radius-md` chip for inline command-style tokens (e.g. `bugster pull`) — directly reusable for problem tags, verdict shorthand, or CLI-style hints.

**Footer**
`--canvas-alt` background, logo + two link columns (sans, bold column headers, regular links), `1px solid var(--divider)` rule, copyright + legal links row, small square social icons.

---

## 5. On the Mascot — a deliberate change, not an oversight

Bugster's blue chameleon (and its purple/pink variants in the footer/CTA scene) is their specific brand character — that's their IP, not a generic "illustration style" anyone can freely reuse as-is. Copying that exact character onto Code-It-Up would read as borrowing someone else's brand identity rather than adopting a design language, so it's left out of this spec on purpose.

What's fully reusable is the **illustration treatment**: flat vector shapes, thick uniform black outlines, a small saturated palette (blue/coral/purple/lime), simple geometric line-art. Two ways to apply that here, without inventing a mascot on your behalf:
- **No-mascot route (recommended to start):** lean entirely on the window-chrome panels + annotation-marker motif as the personality carriers — genuinely fitting for a code judge, and zero illustration work needed.
- **Mascot route:** commission or generate an original character in the same flat/outlined style, themed to competitive programming (e.g. a small line-art "judge" figure, a terminal-cursor character) — distinct from Bugster's chameleon, in the same visual language.

---

## 6. Tailwind Theme Extension (starting point)

```js
// tailwind.config.js — theme.extend
colors: {
  canvas: '#EDE8DC',
  'canvas-alt': '#E7E2D6',
  surface: '#FAF7F0',
  navbg: '#F6F2E8',
  ink: '#17181A',
  'ink-soft': '#55534C',
  'ink-muted': '#8B8878',
  divider: '#D8D3C4',
  lime: { DEFAULT: '#E7F0A0', hover: '#D9E888' },
  accentBlue: { DEFAULT: '#3169F0', soft: '#9FC6F7' },
  accentCoral: '#F3A79A',
  accentPurple: '#A489E8',
},
borderRadius: {
  pill: '999px',
  md: '10px',
  lg: '20px',
  xl: '28px',
},
fontFamily: {
  mono: ['"Space Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
borderWidth: { DEFAULT: '1px', 2: '2px' },
```

Code-It-Up's `CodeEditorPage.jsx` already uses `'JetBrains Mono, Courier New, monospace'` for the Monaco editor font — keep that; it now matches the site-wide display font too.

---

## 7. Page-by-Page Application Map

| Page / component | What changes |
|---|---|
| `Navbar.jsx` | Cream bg, black-border buttons per §4; optional black announcement strip above/below for live-contest callouts |
| `Home.jsx` | Hero: mono H1 + sans subhead + primary/secondary buttons + folded-corner card, illustration slot per §5. Feature cards → standard bordered cards. FAQ → accordion component. Final CTA → offset-block duotone card |
| `Problemset.jsx` | Search input gets black border + `--radius-md`; each problem row becomes a standard bordered card; difficulty rating becomes an eyebrow-style pill |
| `ProblemPage.jsx` | Statement sections → standard cards; sample input/output blocks → window-chrome panels (title bar shows `input.txt` / `output.txt` instead of URL) |
| `CodeEditorPage.jsx` (submit page — per the simplified CF-style form agreed earlier) | Plain form fields with black-border inputs; source textarea in mono; run/verdict output panel becomes a window-chrome panel with the 3-dot bar and a "LIVE"-style status pill for the verdict |
| `Contests.jsx` / `ContestPage.jsx` | Status filters → the black-pill tab component; countdown timer digits → stat-block mono-number treatment; problems table → thin-divider rows, no card-per-row |
| `SubmissionsPage.jsx` | Verdict badges → small pill badges: AC → lime fill, WA → coral fill, TLE → purple fill, CE → surface/outline only |
| `ProfilePage.jsx` (currently a stub) | Good candidate for the stat-block component: rating / max rating / problems solved / rank, each as one column |
| `Login.jsx` / `Register.jsx` | Centered standard card, optionally with the offset-block duotone treatment; inputs get black borders |
| `admin/AddContest.jsx`, `admin/AddProblems.jsx` | Same input/card treatment; multi-select lists get black borders instead of default browser styling |

---

## 8. Motion

The source site itself is largely static — no scroll-triggered fade-ins stacked on every section. Keep motion minimal and purposeful: a hover lift on buttons/cards, an expand/collapse on the accordion, nothing more. Don't add a generic fade-slide-up entrance to every section — it isn't in the reference and reads as templated rather than deliberate.

---

## 9. Handoff Notes

- This is a full re-theme (dark slate/indigo → light cream), not a tweak — expect to touch color usage on every page, not just add new components.
- The two open decisions for you to confirm before Antigravity runs with this: (1) mascot vs. no-mascot (§5), (2) whether the announcement bar / offset-block CTA are worth including on an internal judge tool vs. being purely a marketing-site device — they're included above for fidelity to the source, but are the most "optional" pieces here.
- Everything else in this doc (colors, type, borders, components, page mapping) is meant to be handed to Antigravity as-is.