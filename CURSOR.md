# CURSOR.md — Kapi Forge engineering guide

This is the source of truth for how Kapi Forge is built. Read it before changing code. When a decision here changes, update this file (and the relevant doc in `docs/`) in the same change.

| Document                                                                   | Covers                                                                   |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `CURSOR.md` (this file)                                                    | Scope, stack, rules and conventions                                      |
| [`docs/architecture.md`](docs/architecture.md)                             | Module responsibilities, routing, service pages, quote system, rendering |
| [`docs/design-system.md`](docs/design-system.md)                           | Tokens, typography, colour usage, components, interaction                |
| [`docs/future-backend-integration.md`](docs/future-backend-integration.md) | NestJS integration, API layer, file uploads                              |

---

## 1. Project

**Kapi Forge** is a printing and prototyping company in Delhi, serving all of India. Tagline: _Ideas take shape. We make them real._ Services: 3D Printing, Digital Printing, Offset Printing, Custom Prototyping, Bulk Printing.

### Release 1 scope

A premium, responsive, frontend-only marketing site with a multi-step quote enquiry.

| In scope                                                         | Out of scope (do not build)                                    |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Home, Services overview, 5 service pages, About, Contact         | Portfolio page, Industries page                                |
| Multi-step Get a Quote with client-side validation               | Backend, database, file storage, auth, admin dashboard         |
| Enquiry **handoff** to email / WhatsApp with a generated summary | Any claim that an enquiry or file was submitted or received    |
| SEO metadata, sitemap, robots, verified structured data          | Testimonials, statistics, client logos, certifications, awards |

### Content integrity (non-negotiable)

- Never invent business facts: no testimonials, statistics, client names, years in business, machine models, certifications, turnaround guarantees or prices.
- Business facts come only from `src/config/site.ts` and `src/content/`. Anything not yet confirmed is `null` there and the UI hides it.
- Copy describes capabilities in general terms until the business confirms specifics. Mark unconfirmed specifics in content files with `// TODO(business): confirm`.
- Never hardcode contact details, addresses or social links in components. Read `siteConfig`.
- No dead buttons or links. Every interactive element does something real, or it is not rendered.
- No fake API calls, fake loading states that pretend to send data, or "submitted successfully" messages in Release 1.

---

## 2. Stack

| Concern        | Choice                                                                      | Notes                                                            |
| -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| UI             | React 19.3                                                                  | Native `<ViewTransition>` used for page transitions              |
| Language       | TypeScript 7, `strict` + `noUncheckedIndexedAccess`                         | No `any`, no enums (`erasableSyntaxOnly`)                        |
| Build          | Vite 8                                                                      | Native `tsconfigPaths`                                           |
| Routing        | React Router 8, **framework mode**, `ssr: false`, `prerender: true`         | Static HTML per route, deployable to any static host             |
| Styling        | Tailwind CSS 4.3, tokens in `src/styles/globals.css`                        | No `tailwind.config.js`                                          |
| Primitives     | shadcn/ui (Radix base, `radix-nova` style) + `radix-ui`                     | Generated into `src/components/ui/`, then aligned to tokens      |
| Class merging  | `cn` (shadcn) via `@/lib/utils`                                             | Configured for custom tokens; replaces `clsx` + `tailwind-merge` |
| Variants       | `class-variance-authority`                                                  | For components with visual variants                              |
| Motion         | `motion` 14 (`LazyMotion` + `m`)                                            | Standard UI motion                                               |
| Complex scroll | `gsap` + ScrollTrigger + `@gsap/react`                                      | Only via `@/lib/gsap`, only where Motion is insufficient         |
| Forms          | `react-hook-form` + `zod` **4.x** + `@hookform/resolvers`                   | Zod is pinned to 4.x: resolvers v7 does not support Zod 7        |
| Icons          | `lucide-react`                                                              | Import icons individually                                        |
| Fonts          | `@fontsource-variable/sora` (headings), `@fontsource-variable/inter` (body) | Self-hosted, Latin subsets preloaded in `root.tsx`               |
| Lint / format  | `oxlint`, `prettier` + `prettier-plugin-tailwindcss`                        | Lint rules enforce import boundaries (see §5)                    |
| Tests          | `vitest` + Testing Library + `jsdom`                                        |                                                                  |

**Deliberately not used:** Redux, Zustand, TanStack Query, Axios, react-helmet, styled-components, a second animation or icon library. Zustand may be added only if genuinely shared client state appears that Context cannot handle cleanly (none exists in Release 1). TanStack Query is added with the first real API integration (see backend doc).

### Commands

```bash
npm run dev          # dev server
npm run typecheck    # react-router typegen + tsc
npm run lint         # oxlint
npm run format       # prettier --write
npm test             # vitest run
npm run build        # pre-rendered static build in build/client
npm run check        # all of the above; must pass before a change is done
```

Environment variables are documented in `.env.example` and read only through `src/config/env.ts`.

---

## 3. Architecture summary

Full detail in [`docs/architecture.md`](docs/architecture.md).

```
src/
├─ root.tsx            Document shell, global providers, root error boundary, font preloads
├─ routes.ts           Route table: the only place URLs are mapped to modules
├─ routes/             Thin route modules: meta(), ErrorBoundary, compose feature components
├─ components/
│  ├─ ui/              shadcn primitives (Button, Input, Select, Sheet, Accordion, …), token-aligned
│  ├─ form/            RHF-connected field wrappers shared by every form
│  ├─ layout/          SiteHeader, MobileNav, SiteFooter, Container, Section
│  ├─ motion/          Animation wrappers (Reveal, Stagger)
│  └─ shared/          Cross-feature composites (PageHero, SectionHeading, CtaBand)
├─ features/           One folder per product area: home, services, about, contact, quote
├─ content/            Business content as typed data (services catalogue, about copy, FAQs)
├─ config/             paths, site facts, navigation, env
├─ api/                Integration boundary (R1: enquiry handoff; R2+: HTTP client)
├─ hooks/              Shared hooks used by 2+ features
├─ lib/                Pure helpers: cn, seo, motion tokens, gsap setup, validation primitives
├─ styles/globals.css  Design tokens and base styles
└─ test/setup.ts
```

Dependency direction (enforced by review, cycles by lint):

`routes → features → components → lib/config/content`. `features` may use `api`; `api` may only `import type` from features. `components` never import from `features`. Features never import from other features; move shared code down a layer instead.

Folders are created when their first file is needed, not ahead of time.

---

## 4. Rendering rules (pre-rendered SSR)

Every route is rendered to HTML at build time in Node, then hydrated in the browser.

- Never touch `window`, `document`, `localStorage`, `sessionStorage`, `matchMedia` or `navigator` during render or at module top level. Use them in `useEffect`, event handlers, or GSAP/Motion hooks.
- Client-only state (saved quote draft, `?service=` prefill) is applied after mount, never read during render, otherwise hydration mismatches.
- No `loader` or `action` exports in page routes. Data is static and imported. Resource routes (`sitemap.ts`, `robots.ts`) may use `loader`; they are pre-rendered.
- Unknown URLs are served `__spa-fallback.html` by the host; the `*` route renders the not-found page.

---

## 5. Conventions

### Files and naming

| Thing                   | Convention                             | Example                                 |
| ----------------------- | -------------------------------------- | --------------------------------------- |
| Components              | PascalCase file, named export          | `components/layout/SiteHeader.tsx`      |
| Route modules           | kebab-case, default export + `meta`    | `routes/get-a-quote.tsx`                |
| shadcn primitives       | kebab-case (CLI output)                | `components/ui/button.tsx`              |
| Hooks                   | `useX.ts`, one hook per file           | `features/quote/hooks/useQuoteDraft.ts` |
| Data, config, utilities | kebab-case `.ts`                       | `content/services.ts`, `lib/seo.ts`     |
| Zod schemas             | `xSchema`; inferred type `X`           | `customerSchema` → `Customer`           |
| Tests                   | beside the file, `.test.ts(x)`         | `lib/seo.test.ts`                       |
| Booleans                | `is` / `has` / `can` / `should` prefix | `isOpen`, `hasFiles`                    |
| Event props / handlers  | `onX` props, `handleX` implementations | `onStepChange`, `handleSubmit`          |
| Constants               | camelCase `as const` objects           | `paths.getAQuote`, `duration.base`      |

No barrel `index.ts` files except where a folder exposes a registry (e.g. `features/quote/specs/index.ts`). Import from the file that defines the thing.

### Imports

- Use the `@/` alias for anything outside the current folder; relative imports only within a folder.
- `import type` for type-only imports (lint-enforced).
- Lint-enforced boundaries: `cn` only from `@/lib/utils`; GSAP only from `@/lib/gsap`; Motion components via `import * as m from 'motion/react-m'` then `m.div` (never `motion.div`, it breaks `LazyMotion strict`); never `framer-motion`, `clsx`, `tailwind-merge`.

### TypeScript

- No `any`. Use `unknown` and narrow. No non-null assertions (`!`) except on values proven by the line above.
- Derive types from data and schemas (`typeof services[number]`, `z.infer`) instead of writing them twice.
- Use `as const` unions instead of enums. Prefer discriminated unions for variant data (`{ status: 'handoff' } | { status: 'submitted' }`).
- `noUncheckedIndexedAccess` is on: lookups return `T | undefined`; handle the undefined case (usually a 404 or an early return).

### Components

- **Root (`src/root.tsx`)**: `Layout()` is the `<html>` document only (meta, `Meta`/`Links`/`Scripts`, `ScrollRestoration`) and also wraps the error boundary; `App()` holds app-wide providers (`MotionConfig`, `LazyMotion`) around `<Outlet/>`. Site chrome belongs to `routes/site-layout.tsx`, never to the root.
- **Route module**: sets `meta`, picks content, renders one feature page component. No markup beyond that, no logic beyond a lookup.
- **Feature component**: owns one section or flow of one product area. Reads content/config directly; does not receive whole content objects through several layers.
- **Shared component** (`components/*`): presentational, no knowledge of a specific page or feature, props are plain data plus `className`.
- **Primitive** (`components/ui`): generated by shadcn, then edited to match tokens. Edit in place; do not wrap a primitive just to restyle it.
- Props: an explicit `type XProps`, accept `className` on anything that renders a root element, spread native props when wrapping a native element (`React.ComponentProps<'button'>`).
- Composition over configuration: prefer `children`/slots to long lists of boolean props.

**Extract a component when** it is used twice, when a file passes ~150 lines of JSX, when a block has its own state or effect, or when a section has a name a designer would use ("Process steps"). **Do not extract** single-use fragments of a few lines or wrappers that only forward props.

**Avoid:** nested ternaries in JSX (use early returns, a lookup map or a small component); prop drilling more than two levels (use composition or a feature-level Context); components that fetch, transform and render unrelated things at once.

---

## 6. State management

| State                                 | Where                                                                 |
| ------------------------------------- | --------------------------------------------------------------------- |
| UI state of one component             | `useState` / `useReducer`                                             |
| Form state (quote, contact)           | React Hook Form (one `useForm` per form)                              |
| Quote wizard step + form across steps | `QuoteWizard` owns `useForm` + step index; steps use `useFormContext` |
| Quote draft across reloads            | `sessionStorage` via `useQuoteDraft` (no files, see architecture)     |
| Mobile nav open state                 | Local to `SiteHeader`                                                 |
| URL-worthy state (prefilled service)  | Search params (`/get-a-quote?service=3d-printing`)                    |
| Static business data                  | Imported modules in `content/` and `config/`                          |
| Server state (Release 2+)             | TanStack Query, introduced with the API client                        |

There is no global store. Introduce a React Context only for state shared across a subtree that props cannot reasonably reach.

---

## 7. Forms

- Every form: `useForm({ resolver: zodResolver(schema), mode: 'onTouched' })`.
- Schemas live with their feature (`features/quote/schema.ts`, `features/contact/schema.ts`). Shared field rules (Indian phone, PIN code, email, name, future date) live once in `src/lib/validation.ts`.
- Fields render through `src/components/form/` wrappers (on the shared `FieldShell` and shadcn `label`), which wire `id`, `aria-invalid`, `aria-describedby` and error text. Never hand-roll label/error markup in a feature. Optional text fields hold `''` when empty and use the `optional*Field` schemas in `src/lib/validation.ts`; do not use `z.union` for "empty or valid", it hides the specific message behind "Invalid input".
- Components shared by more than one feature (for example `EnquiryActions`, used by contact and quote) live in `src/components/shared/`, because features may not import other features.
- Validation messages are written for customers ("Enter a 6-digit PIN code"), not developers.
- On failed submit or step change, focus moves to the first invalid field.
- Quote-specific architecture (dynamic specs, steps, files, persistence, handoff) is in [`docs/architecture.md` §6](docs/architecture.md#6-quote-system).

---

## 8. API boundary

- Release 1 has **no network calls**. `src/api/enquiries/` builds email/WhatsApp handoff links from a validated enquiry. The UI tells the user to finish sending in their own app, and to attach their files there.
- Components never build `mailto:`/`wa.me` URLs or call `fetch` directly. They call `src/api/` functions and handle the discriminated outcome.
- Request/response types are defined in `src/api/` and mirror the future NestJS DTOs.
- See [`docs/future-backend-integration.md`](docs/future-backend-integration.md).

---

## 9. Styling

- Tailwind utilities with semantic tokens only (`bg-background`, `text-muted-foreground`, `text-brand-strong`). No raw hex values, no arbitrary colour values, no inline styles for static styling.
- Dark sections use the `surface-dark` utility, which re-scopes tokens; do not hand-pick light-on-dark colours.
- Brand orange (`bg-brand`) is a fill/accent colour. Orange **text** on light backgrounds must use `text-brand-strong` (contrast).
- New tokens go in `globals.css` **and** must be registered in `src/lib/utils.ts` (`cn` theme) and documented in `docs/design-system.md`.
- Exception: `<meta name="theme-color">` in `root.tsx` uses the ink hex, because meta tags cannot read CSS variables. Keep it in sync with `--ink`.
- Brand images live in `public/assets/images/` (`kapi-forge.jpeg` is the original logo and favicon; `kapi-forge-96.jpeg` is the resized copy `Logo` renders). Icons come from `lucide-react`, not from image files.
- Conditional classes via `cn()`; variants via `cva`.
- Mobile-first. Test at 360px, 768px, 1024px and 1440px.

---

## 10. Animation

Tokens and interaction patterns: [`docs/design-system.md` §8](docs/design-system.md#8-motion-and-interaction).

- **Motion** for component-level animation: entrances, hover/press, accordions, step transitions, `AnimatePresence`. Use `m.*` components and variants/tokens from `@/lib/motion`.
- **GSAP + ScrollTrigger** only for scroll-scrubbed or pinned sequences that Motion's `useScroll` cannot express cleanly. At most one or two per page. Always `useGSAP(() => …, { scope: ref })`, which reverts animations and kills triggers on unmount.
- **CSS transitions** for simple colour/border hovers; shadcn primitives keep their `tw-animate-css` data-state animations.
- **Page transitions**: React `<ViewTransition>` in the site layout (200 ms cross-fade). Do not add React Router `viewTransition` props.
- Animate `transform` and `opacity` only. No animating `width`, `height`, `top`, `left`, `box-shadow` or filters on large areas.
- No `scroll` event listeners. Use `whileInView` / `IntersectionObserver` / ScrollTrigger.
- Reduced motion: `MotionConfig reducedMotion="user"` is set globally. GSAP code must branch with `gsap.matchMedia()` on `(prefers-reduced-motion: no-preference)`. Content must be fully visible with animations disabled.
- Scroll reveals animate once, are subtle (≤ 24px travel), and never delay content above the fold.

---

## 11. Performance targets

Measured on the production build (`npm run build && npm run preview`), Lighthouse mobile, simulated 4G.

| Metric                                   | Target                            |
| ---------------------------------------- | --------------------------------- |
| Lighthouse Performance / A11y / SEO / BP | ≥ 90 / 100 / 100 / ≥ 95           |
| LCP                                      | < 2.5 s                           |
| CLS                                      | < 0.05                            |
| INP                                      | < 200 ms                          |
| Shared JS (all routes)                   | ≤ 160 KB gzip (currently ~140 KB) |
| Per-route JS on top of shared            | ≤ 40 KB gzip; quote route ≤ 70 KB |

- Routes are code-split automatically. Heavy, below-the-fold or interaction-only components use `React.lazy`.
- Zod, React Hook Form and GSAP must only load on routes that use them; do not import them from `config/`, `lib/seo.ts` or layout components.
- Images: explicit `width`/`height`, AVIF/WebP, `srcset`/`sizes`; the hero image uses `fetchPriority="high"` and no lazy loading; everything else `loading="lazy"`.
- Fonts: only the two variable families; no additional weights or families.
- Avoid re-renders: no inline object/array props into memoised children in hot paths; subscribe to specific RHF fields (`useWatch({ name })`) rather than `watch()` everything.

---

## 12. Accessibility (WCAG 2.2 AA)

- Semantic landmarks: one `<h1>` per page, sequential headings, `header`/`nav`/`main`/`footer`, lists for lists.
- Everything reachable and operable by keyboard; visible focus via the global `:focus-visible` outline (never `outline-none` without a replacement).
- Use Radix-based primitives for menus, dialogs, selects, accordions, tabs. Do not build custom dropdowns.
- Forms: visible labels, `aria-describedby` for hints and errors, errors in text (not colour alone), required fields indicated.
- Wizard: step heading receives focus on step change; progress is announced; steps are not hidden from assistive technology when visible.
- Images: meaningful `alt`, or `alt=""` for decorative images.
- Touch targets ≥ 44 × 44 px. Respect reduced motion (§10). Colour pairings follow the contrast table in the design system.

---

## 13. SEO

- Every route module exports `meta` built with `buildMeta()` from `@/lib/seo` (unique title, description, canonical, Open Graph).
- `VITE_SITE_URL` must be set for production builds, otherwise canonical URLs point to localhost.
- `sitemap.xml` and `robots.txt` are generated from `paths` at build time. Add a path to `src/config/paths.ts` only when its route exists.
- Structured data (`Organization` / `LocalBusiness` JSON-LD) uses only non-null fields from `siteConfig`. No ratings, reviews or opening hours unless verified.

---

## 14. Testing

- `npm run check` must pass before any change is complete.
- Unit-test pure logic: schemas, spec registry, summary builder, handoff link builder, `cn` config, SEO helpers.
- Component tests (Testing Library) for behaviour, not markup: wizard step navigation and validation, file validation, draft restore, form error display. Query by role and label.
- After UI changes, check the page in a browser at mobile and desktop widths, keyboard-only, and with reduced motion enabled.

---

## 15. Change management

- Make the smallest change that solves the problem; preserve the existing architecture.
- Search for an existing component, hook or helper before creating one.
- New dependency: justify it in the PR/change description (what it replaces, size, why not existing tools) and add it to §2.
- Architectural change (new folder, new state tool, new rendering mode, new convention): update this file and the relevant `docs/` file in the same change.
- shadcn components: add with `npx shadcn@latest add <name>`, then (1) change `from "cn"` to `from "@/lib/utils"`, (2) align classes to tokens (remove `dark:` variants and `outline-none` focus overrides), (3) ensure `radix-ui` is installed, (4) generated classes use `data-open`, `data-closed`, `data-checked` and `data-unchecked` variants and `animate-accordion-*`; these are defined in `src/styles/globals.css` (as `[data-state=...]` variants and keyframes), so do not install the shadcn package that normally provides them. Do not re-run `shadcn init` (it overwrites `globals.css`).
- Refactor when a pattern is duplicated a third time, when a file exceeds ~250 lines, or when a component needs more than ~8 props. Refactors are separate changes from features.

---

## 16. Open business inputs (blocking launch, not development)

| Input                                                           | Used by                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------ |
| Business email, phone, WhatsApp number                          | `siteConfig.contact`, enquiry handoff, Contact page, JSON-LD |
| Street address / PIN (if public)                                | Contact page, JSON-LD                                        |
| Production domain                                               | `VITE_SITE_URL`                                              |
| Confirmed materials, paper stocks, finishes, minimum quantities | Service content, quote option lists                          |
| Licensed photography                                            | Heroes and service pages                                     |
| Logo and favicon                                                | Header, footer, `public/`                                    |
| Hosting provider                                                | SPA fallback and 404 configuration                           |
