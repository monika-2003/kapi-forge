# Design system

Visual language for Kapi Forge: premium industrial technology, modern manufacturing, minimal editorial layout. Precise, calm and confident; restraint over decoration.

Tokens are implemented in [`src/styles/globals.css`](../src/styles/globals.css). This document explains how to use them. Styling rules (no raw hex, `cn`, `surface-dark`) are in [`CURSOR.md` §9](../CURSOR.md#9-styling).

## 1. Colour

### Brand palette

| Token        | Value     | Role                                                               |
| ------------ | --------- | ------------------------------------------------------------------ |
| `ink`        | `#101820` | Primary dark: primary buttons, dark sections, header on scroll     |
| `brand`      | `#FF6B35` | Accent orange: fills, highlights, CTA on dark, small graphic marks |
| `paper`      | `#F5F3EF` | Page background                                                    |
| `mist`       | `#DCE5E8` | Secondary surfaces, hover surfaces, tags                           |
| `foreground` | `#202020` | Body text                                                          |
| `border`     | `#E5E7EB` | Dividers and card borders (decorative only)                        |

### Semantic tokens

Use these in components (shadcn naming, so generated primitives work unchanged).

| Utility                                  | Light surface                               | Inside `surface-dark` |
| ---------------------------------------- | ------------------------------------------- | --------------------- |
| `bg-background` / `text-foreground`      | paper / `#202020`                           | ink / paper           |
| `bg-card`                                | `#FFFFFF`                                   | `#18232D`             |
| `bg-primary` / `text-primary-foreground` | ink / paper                                 | paper / ink           |
| `bg-secondary`                           | mist                                        | (inherits)            |
| `bg-muted` / `text-muted-foreground`     | `#EBE8E2` / `#5F6673`                       | `#1C2832` / `#A3ADB8` |
| `bg-accent`                              | mist (shadcn hover surface, **not** orange) | (inherits)            |
| `bg-brand` / `text-brand-foreground`     | orange / ink                                | orange / ink          |
| `text-brand-strong`                      | `#B3431B`                                   | orange                |
| `border-border`                          | `#E5E7EB`                                   | paper at 14%          |
| `border-input`                           | `#7A828C`                                   | paper at 45%          |
| `ring` (focus outline)                   | `#B3431B`                                   | orange                |
| `text-destructive` / `text-success`      | `#B42318` / `#1F7A4D`                       | (inherits)            |

### Contrast decisions

Three brand values fail WCAG AA in their obvious uses, so the system adds accessible companions:

| Pair                           | Ratio   | Rule                                                                 |
| ------------------------------ | ------- | -------------------------------------------------------------------- |
| `#6B7280` muted text on paper  | 4.4:1   | Fails for body text. Use `text-muted-foreground` (`#5F6673`, 5.2:1). |
| Orange `#FF6B35` text on paper | 2.6:1   | Never use orange for text on light. Use `text-brand-strong` (4.9:1). |
| White text on orange           | 2.8:1   | Never. Orange buttons use ink text (6.3:1).                          |
| Ink on orange                  | 6.3:1   | Brand button.                                                        |
| Orange text on ink             | 6.3:1   | Allowed: eyebrows and highlights in dark sections.                   |
| `#E5E7EB` border on paper      | < 1.5:1 | Decorative only. Form fields use `border-input` (3.5:1).             |

### Usage proportions

Roughly 70% paper/white, 20% ink (dark sections, primary buttons, footer), 10% or less orange. Orange marks _the_ important thing in a view: the primary CTA, an active state, a single highlighted word or line. Never more than one orange CTA per viewport.

## 2. Typography

- **Headings:** Sora Variable (`font-display`), applied to `h1`–`h4` by default. Weights 500–600; tight tracking is built into the tokens.
- **Body and UI:** Inter Variable (`font-sans`), weights 400 (body) and 500–600 (labels, buttons).

| Utility        | Size (fluid)                      | Line height | Use                             |
| -------------- | --------------------------------- | ----------- | ------------------------------- |
| `text-display` | 44 → 88 px                        | 1.02        | Homepage hero only              |
| `text-h1`      | 36 → 64 px                        | 1.05        | Page hero heading               |
| `text-h2`      | 28 → 44 px                        | 1.1         | Section headings                |
| `text-h3`      | 22 → 28 px                        | 1.2         | Card and sub-section headings   |
| `text-h4`      | 20 px                             | 1.3         | Small headings, step titles     |
| `text-lead`    | 18 → 22 px                        | 1.5         | Intro paragraph under a heading |
| `text-lg`      | 18 px                             | Tailwind    | Emphasised body                 |
| `text-base`    | 16 px                             | Tailwind    | Body (minimum for paragraphs)   |
| `text-sm`      | 14 px                             | Tailwind    | UI labels, helper text, buttons |
| `eyebrow`      | 12 px, uppercase, 0.14em tracking | 1           | Kicker above headings           |

Rules: one `text-display` or `text-h1` per page. Body measure 60–75 characters (`max-w-prose-tight` = 42 rem). Headings use `text-balance`, paragraphs `text-pretty` (set globally). Visual size and semantic level are independent: an `<h2>` may use `text-h3`.

## 3. Spacing and layout

- Base unit: Tailwind's 4 px spacing scale (`p-4` = 16 px). Use the scale; no arbitrary values.
- `py-section` (64 → 128 px fluid) between page sections. Inner rhythm: 48–64 px between a section heading and its content (`mt-12`/`mt-16`), 24–32 px between cards (`gap-6`/`gap-8`).
- `px-gutter` (20 → 40 px fluid) as horizontal page padding; `gap-gutter` for major grid gaps.

### Containers

| Utility             | Width   | Use                                    |
| ------------------- | ------- | -------------------------------------- |
| `max-w-site`        | 1280 px | Default page content width             |
| `max-w-narrow`      | 896 px  | Quote wizard, contact form, about text |
| `max-w-prose-tight` | 672 px  | Long-form text                         |

`<Container>` (in `components/layout/`) is `mx-auto w-full max-w-site px-gutter` with a `size` prop for `narrow`/`prose`. `<Section>` wraps `<section>` with `py-section` and a `tone` prop (`default` | `muted` | `dark`, where `dark` applies `surface-dark`).

### Breakpoints

Tailwind defaults, mobile-first: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Typical grids: 1 column → 2 at `md` → 3 at `lg`. The desktop navigation appears at `lg`; below it, the mobile sheet.

## 4. Shape and elevation

| Token        | Value | Use                           |
| ------------ | ----- | ----------------------------- |
| `rounded-sm` | 4 px  | Tags, small chips             |
| `rounded-md` | 6 px  | Buttons, inputs, menus        |
| `rounded-lg` | 10 px | Cards, image frames           |
| `rounded-xl` | 16 px | Large feature panels, dialogs |

Industrial and precise: small radii, no pills except status tags.

| Token           | Use                                                         |
| --------------- | ----------------------------------------------------------- |
| `shadow-card`   | Resting elevated cards (sparingly; prefer borders on paper) |
| `shadow-raised` | Popovers, menus, sticky header after scroll, hovered card   |

Prefer a 1 px `border-border` on white cards over shadows. Never stack shadow and heavy border.

## 5. Components

### Buttons (`components/ui/button.tsx`)

| Variant       | Look                                    | Use                                                   |
| ------------- | --------------------------------------- | ----------------------------------------------------- |
| `default`     | Ink fill, paper text                    | Primary action on light surfaces                      |
| `brand`       | Orange fill, ink text                   | The single most important CTA (Get a quote)           |
| `outline`     | Transparent, 20% foreground border      | Secondary action next to a primary                    |
| `secondary`   | Mist fill                               | Low-emphasis actions, filters                         |
| `ghost`       | Text only, subtle hover fill            | Toolbar/icon actions, nav                             |
| `link`        | `text-brand-strong`, underline on hover | Inline actions                                        |
| `destructive` | Red fill                                | Removing a file, clearing a draft (with confirmation) |

Sizes: `sm` 36 px, `default` 44 px, `lg` 48 px, `icon` 44 px square. Links styled as buttons use `<Button asChild><Link …/></Button>`. Icon-only buttons need `aria-label`. Trailing arrow icons (`ArrowRight`, 16 px) on forward CTAs only.

### Form fields

- Height 44 px, `rounded-md`, `bg-card`, `border-input`, `text-base` (prevents iOS zoom).
- Label above the field (`text-sm font-medium`), optional hint below the label in `text-muted-foreground`, error below the field in `text-destructive` with an icon and `aria-invalid` styling (`border-destructive`).
- Required fields are the default; mark optional ones with "(optional)" rather than asterisks.
- Choice groups with 2–5 options use radio cards (bordered tiles, selected: ink border + mist background); longer lists use a Select.
- File drop zone: dashed `border-input`, `rounded-lg`, icon + "Drag files here or browse", accepted formats and size limit stated in text; selected files listed below with name, size and a remove button.

### Cards

- **Service card:** white `bg-card`, `border`, `rounded-lg`, image or icon, `text-h3` title, two-line summary, "Learn more" with arrow. The whole card is one link (single `<a>`; no nested interactive elements). Hover: border to `foreground/20`, image scale 1.03, arrow nudges 4 px.
- **Feature/highlight card:** no border on muted sections; icon in a 40 px mist square, `text-h4` title, body text.
- **Process step:** numbered (`01`, `02` in `font-display text-brand-strong`), title, description; horizontal on `lg`, vertical list below.

### Sections

Alternate tone to create rhythm: default (paper) → muted or white → dark (`surface-dark`) for the CTA band and footer. Each section: eyebrow (optional) → heading → lead (optional) → content.

## 6. Imagery and icons

- Photography: real, high-quality industrial and studio imagery (machines, materials, print finishes, hands working). Licensed stock until own photography exists; never imply stock images are Kapi Forge's past projects.
- Treatment: neutral or cool grading, generous crops, `rounded-lg`, no drop shadows. Use aspect ratios 4:5 (portrait), 3:2 (landscape), 16:9 (hero).
- Icons: Lucide only, 1.5 px stroke (`strokeWidth={1.5}`), 16 px inline, 20–24 px in cards. Decorative icons get `aria-hidden`.

## 7. Focus and states

- Focus: global `:focus-visible` outline, 2 px `ring` colour with 2 px offset. Do not replace with box-shadow rings at low opacity.
- Hover: colour/border changes 150 ms; never the only indicator of interactivity.
- Disabled: 50% opacity and `pointer-events-none`; prefer explaining why an action is unavailable over disabling silently.
- Selection: orange highlight with ink text.

## 8. Motion and interaction

Tokens live in [`src/lib/motion.ts`](../src/lib/motion.ts) (JS) and `--ease-*` in `globals.css` (CSS). Engineering rules are in [`CURSOR.md` §10](../CURSOR.md#10-animation).

| Token             | Value                            | Use                                          |
| ----------------- | -------------------------------- | -------------------------------------------- |
| `duration.fast`   | 150 ms                           | Hover, press, colour                         |
| `duration.base`   | 300 ms                           | Menus, accordions, wizard step change        |
| `duration.slow`   | 600 ms                           | Scroll reveals                               |
| `duration.slower` | 900 ms                           | Hero entrance only                           |
| `ease.outExpo`    | `cubic-bezier(0.16, 1, 0.3, 1)`  | Default for entrances and most UI            |
| `ease.inOutQuart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Large movements (mobile menu, pinned scenes) |

Patterns:

- **Scroll reveal:** `fadeUp` variant (opacity 0 → 1, y 24 → 0), once, triggered 10% before entering. Stagger children 80 ms, at most 6 items.
- **Hero entrance:** heading lines and CTA stagger in on load (≤ 900 ms total). Content is present in the HTML; animation only enhances it.
- **Hover:** cards lift via border/shadow and image scale 1.03; arrows translate 4 px. Buttons press with `translate-y-px`.
- **Mobile navigation:** sheet slides from the right (`ease.inOutQuart`, 300 ms) with a fading backdrop; links stagger in 40 ms.
- **Page transition:** 200 ms cross-fade of the main content (View Transitions).
- **Signature moment (optional, GSAP):** at most one scroll-scrubbed scene on the homepage (for example, a layer-by-layer build of an object as you scroll) and none on service pages. It must degrade to a static image with reduced motion.
- **Reduced motion:** all transforms disabled; opacity fades may remain at ≤ 150 ms.
