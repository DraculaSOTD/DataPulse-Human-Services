# DataPulse AI — Technical Documentation

Code-level reference for the DataPulse AI website. For a high-level orientation see [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md); for production deployment see [DEPLOYMENT-README.md](DEPLOYMENT-README.md).

**Status vocabulary used throughout:**

| Status | Meaning |
|---|---|
| **Active** | In use and working |
| **Needs config** | Correct, but inert until environment variables are set |
| **Partially wired** | Present and reachable, but not fully exercised |
| **Unused** | Dead or orphaned — kept deliberately, or awaiting cleanup |

---

## 1. Architecture

Two processes in development, one in production.

```
DEVELOPMENT
  Browser :3000 ──► Vite dev server ──► React SPA (HMR)
                         │
                         └── proxy /api/* ──► Express :5000 ──► Nodemailer ──► SMTP

PRODUCTION
  Browser :443 ──► nginx ──┬── static  client/dist/   (SPA fallback to index.html)
                           └── /api/*  ──► Express (PM2) ──► Nodemailer ──► SMTP
```

**The `/api` boundary.** The frontend never calls the API by absolute URL. [Contact.jsx](client/src/pages/Contact.jsx) fetches the relative path `/api/contact`; in development [vite.config.js](client/vite.config.js) proxies that to `http://localhost:5000`, and in production nginx routes it. This is why the site must be used via port 3000 in development — loading port 5000 directly gives you the API only.

**Client-side routing.** All six routes — plus the two legacy redirects — are resolved in the browser by React Router; the server only ever serves `index.html`. **Any production host must rewrite unknown paths to `index.html`**, or a hard refresh on `/about` returns 404. The Vite dev server does this automatically.

**No persistence layer.** There is no database, ORM, session store, or auth. A contact submission's entire lifecycle is: POST → validate → log to stdout → send two emails → respond.

## 2. Directory map

```
.
├── client/                         React SPA
│   ├── index.html                  HTML shell; static <title>, favicons, theme-color
│   ├── vite.config.js              Dev server port 3000 + /api proxy to :5000
│   ├── public/
│   │   ├── partners/               27 logo files — only 4 referenced
│   │   ├── team/                   arthur.jpg, calvin.jpg (+ riaan.jpg, unused)
│   │   ├── sitemap.xml             6 URLs
│   │   ├── robots.txt, site.webmanifest, favicon-*.png, og-image.png
│   │   ├── maintenance.html        Static holding page used by the nginx gate
│   │   └── partners.backup/        Orphaned duplicate of partners/
│   └── src/
│       ├── main.jsx                ReactDOM root
│       ├── App.jsx                 Providers, route table
│       ├── animations/             AnimatedBackground (canvas)
│       ├── components/             Navigation, Footer, SEO, ScrollToTop
│       ├── constants/              animations.js, config.js, indicators.js
│       ├── pages/                  Home, About, Offerings, UseCases, Contact, PrivacyPolicy (+ .css each)
│       ├── styles/global.css       Design tokens, base styles, shared utilities
│       └── utils/structuredData.js JSON-LD builders
└── server/                         Express API
    ├── index.js                    App bootstrap, middleware, health check
    ├── routes/contact.js           POST / → controller
    ├── controllers/contactController.js   Validation + send orchestration
    ├── config/email.js             Nodemailer transporter
    └── templates/contactEmail.js   HTML + plain-text email bodies
```

---

## 3. Frontend reference

### Entry and shell

| File | Exports | Status | Notes |
|---|---|---|---|
| [main.jsx](client/src/main.jsx) | — | **Active** | Mounts `<App />` into `#root`. No `StrictMode` wrapper. |
| [App.jsx](client/src/App.jsx) | `App` | **Active** | Wraps the tree in `HelmetProvider` → `Router` → `ScrollToTop` + `Navigation` + `<main><Routes></main>` + `Footer`. Both `Navigation` and `Footer` sit **outside** the routed area, so they render on every page without each page having to mount them. |

**Route table** ([App.jsx](client/src/App.jsx)):

| Path | Element | Status |
|---|---|---|
| `/` | `Home` | **Active** |
| `/about` | `About` | **Active** |
| `/offerings` | `Offerings` | **Active** |
| `/use-cases` | `UseCases` | **Active** |
| `/contact` | `Contact` | **Active** |
| `/privacy-policy` | `PrivacyPolicy` | **Active** — reached from the footer link; deliberately absent from `navLinks` |
| `/services` | `<Navigate to="/offerings" replace />` | **Active** — legacy redirect; the page was renamed in the Oct 2026 overhaul and this keeps old inbound links and search results alive |
| `/privacy` | `<Navigate to="/privacy-policy" replace />` | **Active** — the shorthand people type and link to; same alias pattern as `/services` |

There is **no catch-all `*` route** — an unknown path renders the header and an empty `<main>`. See Known Issues.

### Components

#### [Navigation.jsx](client/src/components/Navigation.jsx) — **Active**

Fixed two-row header: the wordmark sits above the links, centred.

- **State:** `scrolled` (boolean, set from a `scroll` listener at a 50px threshold; drives the `.scrolled` class for the opaque backdrop) and `mobileMenuOpen`.
- **`navLinks`** — the single source of truth for the menu: About → `/about`, Offerings → `/offerings`, Use Cases → `/use-cases`, Contact → `/contact`. **Home is deliberately absent**; the wordmark links to `/`.
- Active link is matched with `location.pathname === link.path` (exact equality, not prefix).
- The same `navLinks` array renders both the desktop list and the `AnimatePresence`-wrapped mobile drawer, so the two can't drift.
- The scroll listener is registered once (`[]` deps) and removed on unmount.

#### [SEO.jsx](client/src/components/SEO.jsx) — **Active**

Wraps `react-helmet-async`'s `<Helmet>`; emits title, description, keywords, canonical, Open Graph, Twitter card, and a JSON-LD block.

| Prop | Default | Notes |
|---|---|---|
| `title` | — | Rendered as `` `${title} \| DataPulse AI` ``. **Omit it** and the fallback `DataPulse AI - The Joy of Creation` is used — this is what Home does. Pass a bare page name (`"About Us"`), never one that already contains the brand, or it renders twice. |
| `description` | — | Used for the meta description plus both social cards |
| `keywords` | — | Optional; omitted from output when absent |
| `ogImage` | `/og-image.png` | Prefixed with `SITE_URL` |
| `ogType` | `'website'` | |
| `canonical` | derived | Defaults to `` `${SITE_URL}${pathname}` `` from `useLocation()`, so each page declares its own URL automatically and a new page cannot forget to set it. Pass the prop only to override. Also feeds `og:url` and `twitter:url`. |
| `structuredData` | — | Object or array, `JSON.stringify`-ed into one `application/ld+json` script |

The origin comes from `SITE_URL` in [config.js](client/src/constants/config.js) — not hardcoded here.

#### [ScrollToTop.jsx](client/src/components/ScrollToTop.jsx) — **Active**

Renders `null`. Calls `window.scrollTo(0, 0)` on every `pathname` change, so navigation starts at the top rather than inheriting the previous page's scroll offset.

#### [Footer.jsx](client/src/components/Footer.jsx) — **Active**

One centred line of legal chrome on every page: `© 2024–<year> DataPulse AI | All rights reserved | Privacy Policy`. Stateless, no props.

- **The year range end is derived, not written down.** `FOUNDING_YEAR = 2024` (matching registration no. 2024/530497/07) is compared against `new Date().getFullYear()`, so the notice cannot go stale and collapses to a single year if the two ever match.
- The company name comes from `COMPANY_INFO.NAME` in [config.js](client/src/constants/config.js) rather than a literal — this is the first and so far only consumer of that constant.
- The `|` separators are `<span aria-hidden="true">`, so a screen reader reads a clean sentence instead of announcing pipe characters between every item.
- **No framer-motion, deliberately.** `Navigation` animates because it enters once; a footer outside the routed area would re-animate on every route change, which reads as noise rather than polish.
- **`position: relative` is load-bearing**, not decoration — without it the footer sits behind the fixed `z-index: -1` canvas.
- It **inverts the global link convention**: `global.css` makes links `--white` and dims them on hover, but inside a muted `--grey-mid` line that reads backwards, so `.site-footer a` starts at `--text-secondary` and brightens to `--white` with an underline. Keyboard focus still comes from the global `a:focus-visible` outline.

The link is a react-router `<Link to="/privacy-policy">`, so it navigates client-side like every other internal link on the site.

### Pages

#### [Home.jsx](client/src/pages/Home.jsx) — **Active**

| Section | Content |
|---|---|
| Hero | Animated background and the "The Joy of Creation" pill only — no heading or CTA by design |
| Partnership | "We partner with leaders on AI and technology strategies." — **this is the page `<h1>`** — plus lead paragraph and the indicators block |
| Examples of what we do | Industry filter chips over a grid of 18 example tiles. Moved here from Offerings in Oct 2026, replacing a "Strategic Initiatives are getting stuck…" problem framing |
| Power behind our Offerings | Ava & Ada flow diagram, three capability cards, closing quote |
| CTA | "Let's create together" → Our Story (`/about`), Offerings (`/offerings`) |

- **`PERFORMANCE_INDICATORS`** — four `{value, label}` imported from [indicators.js](client/src/constants/indicators.js), **not** declared here: 80% Work Automated, 15min Prototype Speed, 7% Month 1 Increase in Revenue, 80% Prediction Accuracy on Payment Collection. [UseCases.jsx](client/src/pages/UseCases.jsx) renders the same array, so the two pages cannot drift. Edit the constant, not the pages.
- **The `<h1>` lives in the partnership section, not the hero** — the hero carries no heading by design, so the outline starts one section down. The heading is sized by `.partnership-section .section-title`, which out-specifies the bare `h1` rule in `global.css`, so it renders identically to the `<h2>` it replaced. Changing its tag or that selector will change the visual design.

**The examples filter — read before editing.** Two module-level consts drive it: `INDUSTRIES` (nine `{id, label}` chips — `all`, finance, banking, insurance, cybersecurity, telecoms, retail, insights, rnd) and `examples` (18 `{title, summary, industries}`). One piece of `industry` state selects the active chip.

- Under `'all'` a tile shows its `summary`; under any other id it shows `industries[id]`.
- **Presence of a key in a tile's `industries` map is also what decides whether that tile appears at all** under that chip — `visibleExamples` filters on it. So adding an industry is a *content* job, not a markup one: a new chip with no copy added to any example renders an empty grid. Current coverage is 17 of 18 tiles for both `telecoms` and `retail`; "Claims and benefits processing" is deliberately insurance-only.
- **Tiles set their own `initial`/`animate` instead of inheriting a `fadeInUp` variant.** The section's `whileInView` gesture fires once and then freezes, so a variant child mounting later — which is exactly what a filter change does — would have no state to animate to and would stay invisible. If you "tidy" these onto the shared variant, filtering silently blanks the grid.
- The `aria-live` count paragraph exists because filtering otherwise changes the grid with no announcement at all.

#### [About.jsx](client/src/pages/About.jsx) — **Active**

Order is deliberate: Hero → **Who we are → Our Practice → Our Values → Our Leadership** → CTA. Leadership sits *below* Values as specified.

- **`leadership`** — two `{name, title, photo, photoClass}`: Arthur Procopos (CEO and Innovation Officer), Calvin Nigrini (CTO and Information Officer). `photoClass` carries a per-person `object-position` correction so the crop frames each face. This is the page's only data array; every other section is literal JSX.
- **Who we are, Our Practice and Our Values share the `.statement-block` wrapper** — same measure, same type scale, differing only in the section tint. A new statement-style subsection should reuse it rather than introduce a fourth variant.
- **One content measure for the whole page.** [About.css](client/src/pages/About.css) gives `.about-hero-content`, `.statement-block` and `.about-block` a single `max-width: 900px; margin: 0 auto` rule, so the hero and every subsection below it share one left edge. Before this, the hero sat in a centred 900px box while the subsections ran flush to the container edge roughly 118px further out, and the page read as misaligned. **Setting a width on an individual section re-introduces that bug** — change the shared rule instead.
- Emits two `getPersonSchema` blocks plus `getWebPageSchema`.

#### [Offerings.jsx](client/src/pages/Offerings.jsx) — **Active**

| Export / const | Status | Notes |
|---|---|---|
| `analyticsServices` | **Active** | 8 `{service, outcome}` rows — Advanced Analytics, Insights, and AI Services |
| `softwareServices` | **Active** | 8 `{service, outcome}` rows — Design, Product, and Software Track |
| `ServiceTable` | **Active** | Local presentational component, used twice |

Section order: Hero → Advanced Analytics → Design/Product/Software → For Startups → CTA. The page tint alternates down that order — analytics plain, software tinted, startups plain, CTA tinted — so **adding or removing a section means re-checking which ones carry `background: rgba(255,255,255,0.015)`**, or you get two tinted blocks in a row.

`ServiceTable({ rows, caption })` renders a real `<table>` with a visually-hidden `<caption>`, `<th scope="col">` headers, and `<th scope="row">` for the service name. Each `<td>` carries `data-label`, which the CSS surfaces as a pseudo-element heading when the table collapses to stacked cards below 640px. The `.visually-hidden` class it relies on lives in [global.css](client/src/styles/global.css), not in `Offerings.css`.

All pricing was removed in the Oct 2026 overhaul — there is no `$13,500`, no comparison table, and `getServiceSchema()` no longer advertises an `offers` block.

The "Examples of what we do" section **moved to [Home.jsx](client/src/pages/Home.jsx)** in Oct 2026; its data arrays, filter state and CSS went with it. Nothing of it remains here.

#### [UseCases.jsx](client/src/pages/UseCases.jsx) — **Active**

Holds the three sections moved off About: track record, outcome stats, partner carousel.

- **`trackRecord`** — six `{title, description}` project summaries.
- **"Built on Trust and Results"** maps `PERFORMANCE_INDICATORS` from [indicators.js](client/src/constants/indicators.js) — the same four figures Home shows. It previously hardcoded three different ones (80% Prediction Accuracy, 7% Increased Revenue, 58% Client Conversion), which had already drifted from Home's set; the 58% figure appeared nowhere else on the site. `.value-item` carries a fixed flex basis so the four labels wrap into even columns instead of a ragged row.
- **`partners`** — four `{name, logo}`: Abacus Insurance, Advanced Health Intelligence (ahi), Metropolitan (`/partners/mmi-holdings.png`, relabelled), Precium. A commented line holds the slot for a future `sens.png`.
- **Carousel geometry — read before editing.** Four module-level constants drive the loop:

  ```js
  PARTNER_CARD_WIDTH = 200            // must equal .partner-card width in UseCases.css
  PARTNER_CARD_GAP   = 32             // must equal the .carousel-track gap (2rem)
  PARTNER_SET_REPEAT = 5              // sets rendered, so wide viewports stay filled
  PARTNER_SCROLL_SECONDS_PER_CARD = 3 // pace
  ```

  `setWidth = partners.length * (CARD + GAP)` and the track animates `x: [0, -setWidth]` — exactly one set — so card *i* lands where card *i+4* was and the loop is seamless. The previous implementation hardcoded `-5400` for 20 logos; that value is wrong for any other count. **If you change the logo count, the maths follows automatically, but if you change the card width or gap in CSS you must update the constants here to match.** `.partner-card` is therefore pinned to 200px at every breakpoint.

#### [Contact.jsx](client/src/pages/Contact.jsx) — **Active**

- **State:** `formData` (`name`, `email`, `company`, `message`), `status` (`{type, message}`), `isSubmitting`.
- `handleChange` — single generic handler keyed on `e.target.name`.
- `handleSubmit` — POSTs JSON to `/api/contact`; on `response.ok` shows success and clears the form, otherwise surfaces `data.error`. A thrown fetch (network failure) falls back to a message naming the direct email address. `isSubmitting` is cleared in `finally`, so the button always re-enables.
- Required fields are enforced in the browser via `required` *and* server-side — see §5.
- Section order: Hero → Contact details + form → CTA. The closing `contact-cta` ("Still not sure?" → Our Story `/about`, Offerings `/offerings`) was added in Oct 2026; before that this was the only page with no closing section, so it dead-ended after the form. It follows the same `cta-content` / `cta-buttons` pattern as the other four pages, which is why `Link` is imported here.

#### [PrivacyPolicy.jsx](client/src/pages/PrivacyPolicy.jsx) — **Active**

The company's POPIA privacy policy, reproduced from `DataPulse AI information/DataPulse AI_Website_Privacy_Policy.docx`. Section order: Hero → policy body. **The only page with no closing CTA** — a legal document should not end in a sales pitch — which is also why it imports no `Link`.

**Content shape.** The policy lives in a `POLICY_SECTIONS` array at **module scope**, not inside the component. The other pages declare their small data arrays in-component; thirteen sections of legal text is enough that rebuilding it on every render is pointless work. Each section is `{title, clauses[], note?}` and each clause renders four optional fields in a fixed order:

| Field | Renders as |
|---|---|
| `text` | the numbered clause paragraph |
| `lead` | a paragraph introducing a list |
| `bullets` | a `<ul>`; an entry may itself be `{text, bullets}` for one level of nesting |
| `note` | a closing paragraph after the list |

A section-level `note` sits outside the numbered clauses, because the source document leaves those paragraphs unnumbered. `subclauses` adds the third level (e.g. 3.2.1).

**Helpers**, all local to the file: `linkifyEmail` splits a string on `CONTACT_EMAILS.INFO` and wraps the match in a `mailto:` anchor — so every entry in the array stays a plain string and the address itself stays sourced from [config.js](client/src/constants/config.js); `PolicyBullets` recurses for nested bullets; `PolicyClauseBody` enforces the field order above for both clauses and subclauses.

**The document's table of contents is dropped.** The .docx numbers it as clause 1, which would push Introduction to 2 — but the policy's own cross-references are counted from Introduction as 1, so keeping it would make every internal reference wrong. A page-anchor TOC is also meaningless on a single scrollable page.

> **The page and the .docx have deliberately diverged — four corrections.** Clause 7.1 opened with a lowercase "if"; clause 12.4 read "and I again accessible" (a stray "I"); the last bullet of 3.2.3 had its full stop inside the bracket plus a double space. The fourth is structural: the source document dropped its *Children's Data Collection* section without updating the two cross-references that followed it, so "Clause 7" and "Clause 11" both pointed one section too far and are renumbered here to **6** (Sharing and Disclosure) and **10** (Personal Information Rights). **The module header comment in the file is the authoritative record of all four** — read it before re-importing the document, or the next import will silently reintroduce them. See Known Issues.

### [AnimatedBackground.jsx](client/src/animations/AnimatedBackground.jsx) — **Active**

A full-viewport fixed canvas (`z-index: -1`) drawing three layers each frame: filled sine waves, straight-line connections between nearby particles, and the particles themselves. Driven by `requestAnimationFrame`; the loop is cancelled on unmount and re-created when `dimensions` change. Particle count scales with viewport area (`width * height / 15000`); connections are drawn between pairs closer than 150px.

**It takes no props.** One greyscale level site-wide: every layer draws white, the background reads identically on all six pages, and it does not shift as you scroll. Each page mounts its own `<AnimatedBackground />` as the first child. An earlier version accepted a `theme` prop (`default | problem | solution | acceleration`) driven by a scroll listener on Home; both were removed with the greyscale redesign.

> **Alpha accumulation — the trap in this file.** The canvas is never fully cleared; each frame paints `rgba(0,0,0,0.12)` over the previous one. Three wave bands then fill *down to the bottom edge* every frame. Those alphas therefore accumulate toward roughly `sum / (sum + clearAlpha)`, not toward their nominal value. With the original cyan-on-navy values (~0.03 each) the asymptote is about **44% white** — a solid grey slab across the lower half of every page that dropped body text to ~3.4:1 contrast. The wave alphas are consequently set very low (0.002–0.009). **If you raise them, raise them by a little and check the result after several seconds of running**, not on the first frame — the build-up is invisible initially.

### Constants and utilities

| File | Export | Status | Notes |
|---|---|---|---|
| [animations.js](client/src/constants/animations.js) | `fadeInUp` | **Active** | `{opacity 0, y 60}` → `{opacity 1, y 0}`, 0.6s. Used on nearly every animated element. |
| | `staggerContainer` | **Active** | `staggerChildren: 0.2` |
| | `staggerContainerFast` | **Unused** | `staggerChildren: 0.15`; defined but imported nowhere |
| [indicators.js](client/src/constants/indicators.js) | `PERFORMANCE_INDICATORS` | **Active** | Four `{value, label}` headline figures. Imported by [Home.jsx](client/src/pages/Home.jsx) (partnership section) and [UseCases.jsx](client/src/pages/UseCases.jsx) ("Built on Trust and Results") — extracted in Oct 2026 precisely because those two had drifted apart while both claiming to be the company's numbers. The two layouts differ (Home a 4-up divided grid, Use Cases a centred flex row); only the data is shared. |
| [config.js](client/src/constants/config.js) | `SITE_URL` | **Active** | `https://datapulseai.co` — the single source of truth for the public origin. Imported by [SEO.jsx](client/src/components/SEO.jsx) (canonical, OG/Twitter URLs and images) and [structuredData.js](client/src/utils/structuredData.js) (all absolute URLs). |
| | `CONTACT_EMAILS` | **Active** | `PRIMARY: arthur@datapulseai.co`, `INFO: info@datapulseai.co`. Consumed by `structuredData.js` for schema `email` fields, and by [PrivacyPolicy.jsx](client/src/pages/PrivacyPolicy.jsx), whose `linkifyEmail` helper splits the policy text on `INFO` to build the `mailto:` link. |
| | `COMPANY_INFO` | **Partially wired** | `NAME` is **Active** — [Footer.jsx](client/src/components/Footer.jsx) renders the copyright line from it. `TAGLINE` ("The Joy of Creation") is still imported nowhere, and remains duplicated as literals in `index.html` and `SEO.jsx`. |

#### [structuredData.js](client/src/utils/structuredData.js)

| Function | Status | Used by |
|---|---|---|
| `getOrganizationSchema()` | **Active** | Home. Founders: Arthur Procopos, Calvin Nigrini. `slogan: "The Joy of Creation"`. `foundingDate: "2020"` — note this sits oddly against the About page's "Since 2024". |
| `getServiceSchema()` | **Active** | Offerings. The `offers`/`price` block was removed with the pricing section, so the markup no longer advertises a price the site doesn't show. |
| `getLocalBusinessSchema()` | **Unused** | Defined but imported nowhere — Contact does not use it |
| `getPersonSchema(name, jobTitle, image)` | **Active** | About (twice). `image` is never passed, so the emitted `image` key is `undefined` and drops out of the JSON. |
| `getBreadcrumbSchema(items)` | **Unused** | Defined but imported nowhere |
| `getWebPageSchema(path, name, description)` | **Active** | All six pages. `path` is the **route path** (`'/'`, `'/about'`, …); the absolute URL is built as `` `${SITE_URL}${path}` ``, so the emitted node always matches both the route and [sitemap.xml](client/public/sitemap.xml). Note `name` here legitimately carries the `- DataPulse AI` suffix — unlike the `SEO` `title` prop, it is not re-suffixed. |

---

## 4. Design system

Defined as custom properties on `:root` in [global.css](client/src/styles/global.css). The October 2026 redesign replaced a cyan/blue/purple palette with greyscale; **no hue remains anywhere in `client/src`.**

| Token | Value | Role |
|---|---|---|
| `--black` | `#000000` | Page ground |
| `--off-black` | `#0a0a0a` | Section ground |
| `--surface` | `#141414` | Cards, tables |
| `--surface-raised` | `#1c1c1c` | Hover state |
| `--border` | `rgba(255,255,255,0.12)` | Hairlines |
| `--border-strong` | `rgba(255,255,255,0.28)` | Hover / active edges |
| `--border-soft` | `rgba(255,255,255,0.07)` | Hairlines on elevated surfaces — the shadow carries the separation, so the line steps back |
| `--grey-mid` | `#a0a0a0` | Meta and muted labels only — **never body copy** |
| `--text-secondary` | `#c4c4c4` | Body copy |
| `--text-primary` | `#f5f5f5` | Headings |
| `--white` | `#ffffff` | Emphasis, primary button fill |
| `--radius` | `2px` | Near-square corners — the "sharp" of the sharper UI |
| `--radius-pill` | `2px` | Chips and badges. Deliberately **not** a pill despite the name — it exists so the pill-shaped elements can be found and changed as a group, not to round them |
| `--nav-height` | `112px` | Height of the two-row fixed header |
| `--hero-offset` | `calc(var(--nav-height) + 3rem)` | Top padding every page hero must clear |

**Contrast is a hard requirement**, not a preference: every text node on every page measures **≥ 7.04:1** (WCAG AAA), verified programmatically across all six routes. `--grey-mid` is as dark as the muted tone may go — it lands at roughly 7:1 on `--surface`. Darkening it breaks the guarantee.

The footer and privacy policy page were measured the same way and clear the floor without moving it. The worst new node is the footer's muted legal line at **7.84:1** (`--grey-mid` over the footer's `rgba(255,255,255,0.015)` band, compositing to `#040404`); the privacy page's muted tones — the eyebrow and the CSS-counter section and clause numbers — sit at **8.03:1** on the page ground, its body copy at **12.04:1**, and its `mailto:` links at **21.00:1**. **The 7.04:1 floor is still set by `--grey-mid` on `--surface` elsewhere**, not by anything added here.

Translucent surfaces are included in that guarantee and are measured against their **composited** value, not their token value: a glass panel is alpha-composited over its section band, which is itself composited over the page ground. The frosted elements all clear the floor comfortably — the worst of them is the resting filter chip at **10.43:1** (`--text-secondary` over `--glass-bg` on the Examples band, compositing to `#151515`), and the bright primary CTA measures **16.08:1** (`--black` over `--glass-bg-bright`, compositing to `#e1e1e1`). **Any new glass surface must be checked the same way** — lowering a `--glass-bg*` opacity moves the composited background toward the ground and can quietly cost several stops of contrast.

### Elevation and glass

A depth layer over the same greyscale palette. No hue, no new colours — only alpha.

| Token | Value | Role |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.45)` | Small objects — icon squares, chips |
| `--shadow-md` | `0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.55)` | Resting state for tiles, cards, buttons |
| `--shadow-lg` | `0 2px 4px rgba(0,0,0,0.45), 0 10px 32px rgba(0,0,0,0.6)` | Hover state, and large panels (tables, the contact form) |
| `--edge-light` | `inset 0 1px 0 rgba(255,255,255,0.06)` | Faint top-edge highlight — pairs with every dark shadow |
| `--edge-light-bright` | `inset 0 1px 0 rgba(255,255,255,0.5)` | The same, for bright glass |
| `--glass-bg` | `rgba(255,255,255,0.07)` | Frosted panel fill |
| `--glass-bg-hover` | `rgba(255,255,255,0.12)` | Frosted panel, hover |
| `--glass-bg-bright` | `rgba(255,255,255,0.88)` | Dominant action — carries `--black` text |
| `--glass-bg-bright-hover` | `rgba(255,255,255,0.96)` | The same, hover |
| `--glass-border` | `rgba(255,255,255,0.18)` | Frosted panel edge |
| `--glass-border-bright` | `rgba(255,255,255,0.55)` | Bright glass edge |
| `--glass-blur` | `blur(12px) saturate(120%)` | The `backdrop-filter` value — always emit the `-webkit-` prefix beside it |

**Why every shadow is paired with an inset highlight.** This is the one non-obvious thing in the system. The ground is `#000` and surfaces are `#141414`, so a dark drop shadow on its own is very nearly invisible — the eye has nothing to compare the falloff against. `--edge-light` catches the top edge of the element instead, and that is what actually reads as lift. A shadow applied without it will look like nothing happened, and the instinct to then raise the shadow opacity does not help.

**Glass is confined to interactive chrome.** The frosted treatment is applied to Home's `.industry-chip` filter tabs, the closing-CTA buttons on all five marketing pages, and the Offerings startup button — things the user clicks. (Five, not six: the privacy policy page has no closing CTA.) Content surfaces (tiles, tables, leadership cards, the contact form) take shadow plus `--border-soft` only and keep their opaque `--surface`, because a page of translucent panels over a moving canvas is unreadable. Two pill elements are **deliberately excluded** and must stay flat: `.hero-tag` (Home's "The Joy of Creation") and `.startup-badge` (Offerings' "For Startups").

**The bright/dim split preserves the CTA hierarchy.** Each closing CTA is a pair. If both buttons became dim glass the primary would stop reading as the main action, so the primary takes `--glass-bg-bright` with `--black` text while the secondary takes `--glass-bg`. That is the whole reason two glass fills exist rather than one.

**Expect tint, not blur.** `backdrop-filter` blurs what is behind it, and what is behind it here is the near-flat canvas gradient — so the glass reads mainly as its tint, bright border and shadow rather than as visible frosting. That is a consequence of the black ground, not a defect; raising `--glass-blur` will not change it.

> **`box-shadow` replaces, it does not stack.** The Contact inputs carry a resting inset *and* a focus ring, so [Contact.css](client/src/pages/Contact.css) restates **both** layers inside the `:focus` rule. Adding a resting shadow to any element that already sets `box-shadow` on `:focus` or `:hover` — without restating it there — silently drops one of the two. The symptom on Contact is a vanished keyboard focus ring, which is an accessibility regression rather than a cosmetic one.

> **A table header shadow needs a stacking context.** `.service-table thead th` sets `position: relative; z-index: 1` so its shadow paints *over* the `tbody` row backgrounds. Without them the shadow renders beneath the rows and is invisible — the rule looks correct and does nothing.

> **`overflow` and `mask-image` clip outer shadows.** `.partner-card` sits inside a masked, `overflow: hidden` carousel and is therefore left flat on purpose. The Offerings table wrapper is fine — `overflow-x: auto` clips its *children*, not the element's own shadow — but below 640px the wrapper drops its frame and each row becomes a card, so the wrapper's shadow is explicitly zeroed in that breakpoint and re-applied per row. **A frame and its shadow must move together.**

### Three conventions worth knowing

**`--hero-offset` and selector specificity.** `global.css` defines `.section { padding: 5rem 0 }` and `.section-sm { padding: 4rem 0 }` as *shorthands*. Because `global.css` is imported from `App.jsx` it loads **after** the page stylesheets, so a bare `.offerings-hero { padding-top: ... }` in a page file is silently overridden — the symptom is a page heading colliding with the fixed header. Every hero therefore uses a page-scoped selector to win on specificity:

```css
.offerings .offerings-hero { padding-top: var(--hero-offset); }
```

Follow this pattern for any new page. [PrivacyPolicy.css](client/src/pages/PrivacyPolicy.css) is the most recent worked example (`.privacy-policy .privacy-hero`), including the matching `@media (max-width: 768px)` override every page hero also carries.

**Numbered legal content uses CSS counters, not typed-in numbers.** The clause numbering on the privacy policy page (`1`, `1.1`, `3.2.1`) is generated entirely in [PrivacyPolicy.css](client/src/pages/PrivacyPolicy.css) from `counter(section)` / `counter(clause)` / `counter(subclause)`, rendered through `::before` into a gutter opened by `padding-left`. The numbers are therefore impossible to desynchronise from the content: when the source document dropped a whole mid-policy section, every following section renumbered itself with **no code change**. Two things to preserve if you touch it:

- The counter lists set `list-style: none` and so must keep their **`role="list"`** — without it Safari/VoiceOver stops treating them as lists at all.
- Each `::before` repeats the `font-size` and `line-height` of `.policy-text` so the hanging number baselines with the first line of its clause. Below 480px they switch to `position: static; display: block` and sit above the text instead, because the gutter costs too much measure on a narrow screen.

**`.gradient-text`.** Retained for markup compatibility — it is applied via `<span className="gradient-text">` in several headings. Now a white → `#b5b5b5` ramp (clipped to the text), with no hue. The dim end stops at `#b5b5b5` (~9.7:1 on black) so the accent never costs legibility.

Also in `global.css`: a visible `:focus-visible` outline for keyboard users, a `prefers-reduced-motion` block that collapses animation and transition durations, and the `.visually-hidden` utility (screen-reader-only text — used by the service-table captions on Offerings and the filter-count announcement on Home). That utility lived in `Offerings.css` until a second page needed it.

The frosted closing-CTA buttons live there too, as `.cta-buttons .btn-primary` / `.btn-secondary` (plus `.startup-content` for the Offerings startup button). Every closing section wraps its pair in the same `.cta-buttons` div, so **one rule block covers all five marketing pages** — the alternative was five near-identical copies in the page stylesheets, which is how `.cta-buttons` itself ended up defined five times. (The privacy policy page has no closing CTA, so it is not in scope here.) The descendant selector is also what scopes the treatment: it out-specifies the bare `.btn-primary` rule without `!important`, and it deliberately does not reach the Contact form's submit button, which sits in `.contact-form` rather than `.cta-buttons` and stays a solid white button.

---

## 5. Backend reference

### [server/index.js](server/index.js) — **Active**

Bootstraps the app. Middleware order: `dotenv.config()` → `cors()` → `express.json()` → `express.urlencoded({extended:true})` → routes → error handler.

- `cors()` is applied **with no options**, so the API accepts cross-origin requests from any origin. Acceptable behind nginx on one domain; see Known Issues.
- The error-handling middleware logs `err.stack` and returns a generic `500 {error:'Something went wrong!'}` — it never leaks internals to the client.
- On listen, it calls `verifyTransporter()` **only if** `EMAIL_USER` and `EMAIL_PASS` are both set; otherwise it prints `⚠️ Email not configured`.

| Route | Handler | Status |
|---|---|---|
| `GET /api/health` | inline | **Active** |
| `POST /api/contact` | `routes/contact.js` → `contactController.submitContact` | **Needs config** (validates and responds without email; sends only once SMTP is configured) |

### [server/routes/contact.js](server/routes/contact.js) — **Active**

Four lines. An `express.Router()` mapping `POST /` to `contactController.submitContact`, mounted at `/api/contact`.

### [server/controllers/contactController.js](server/controllers/contactController.js) — **Needs config**

`submitContact(req, res)` — the only exported handler.

**Validation, in order.** Any failure returns `400` with a single `error` string:

| Rule | Message |
|---|---|
| `name`, `email`, `message` all present | `Please provide name, email, and message` |
| `email` matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | `Please provide a valid email address` |
| `message.length >= 10` | `Message must be at least 10 characters long` |
| `message.length <= 5000` | `Message must be less than 5000 characters` |

`company` is optional. There is **no rate limiting, CAPTCHA, or honeypot**.

**After validation** the submission is logged to stdout (name, email, company, message *length*, ISO timestamp — not the message body), then:

> **Deliberate but surprising: the endpoint returns `200` even when email fails.** There are three success paths. (1) SMTP configured and both sends succeed → `200` with the normal message. (2) SMTP **not** configured → `200` with an added `note: 'Email service not configured - contact saved to logs'`. (3) SMTP configured but `sendMail` **throws** → the error is logged server-side and the user still gets `200` with `note: 'Your message was received but email notification may be delayed'`. The rationale is that a visitor should never see a failure for something they cannot fix. The consequence is that **a silently broken mail configuration looks identical to success from the browser** — monitor the server log, not the form. Only an unexpected exception outside the mail block produces `500`.

Both emails are dispatched concurrently with `Promise.all`, so one failing fails both.

### [server/config/email.js](server/config/email.js) — **Needs config**

| Function | Status | Notes |
|---|---|---|
| `createTransporter()` | **Needs config** | Returns a Nodemailer SMTP transport built from `EMAIL_HOST`, `EMAIL_PORT` (default `587`), `EMAIL_SECURE` (`'true'` → TLS, for port 465), `EMAIL_USER`, `EMAIL_PASS`. A new transport is created per request rather than pooled. |
| `verifyTransporter()` | **Needs config** | Called once at startup; `transporter.verify()` wrapped in try/catch, returns boolean and logs either way. Never throws. |

### [server/templates/contactEmail.js](server/templates/contactEmail.js) — **Active**

Four pure functions returning strings — no I/O, no dependencies.

| Function | Status | Returns |
|---|---|---|
| `getContactNotificationEmail(name, email, company, message)` | **Active** | HTML for the internal notification |
| `getConfirmationEmail(name)` | **Active** | HTML auto-reply to the sender |
| `getContactNotificationText(name, email, company, message)` | **Active** | Plain-text alternative |
| `getConfirmationText(name)` | **Active** | Plain-text alternative |

Each message is sent `multipart/alternative` (both `text` and `html` are supplied).

> **Content drift.** These templates still carry the pre-overhaul brand. The confirmation email tells every enquirer that "our **Acceleration Engine** can help transform your innovation **backlog** into delivered results" — positioning the website no longer uses — and the HTML styles use cyan `#64ffda`, which no longer matches the greyscale site. The tagline was updated to "The Joy of Creation"; the body copy and palette were not. Email is a separate design surface, so this was left as a deliberate decision rather than an oversight.

---

## 6. API reference

Base path `/api`. All bodies JSON.

### `GET /api/health` — **Active**

```json
{ "status": "ok", "message": "DataPulse AI API is running" }
```

Always `200`. Used as a liveness probe.

### `POST /api/contact` — **Needs config**

**Request**

```json
{
  "name":    "string, required",
  "email":   "string, required, must match the email regex",
  "company": "string, optional",
  "message": "string, required, 10–5000 characters"
}
```

**Responses**

| Status | Shape | When |
|---|---|---|
| `200` | `{success: true, message: "..."}` | Both emails sent |
| `200` | `{success: true, message: "...", note: "Email service not configured - contact saved to logs"}` | SMTP env vars absent |
| `200` | `{success: true, message: "...", note: "Your message was received but email notification may be delayed"}` | `sendMail` threw |
| `400` | `{error: "..."}` | Any validation rule failed |
| `500` | `{error: "An error occurred... email us directly at arthur@datapulseai.co"}` | Unexpected exception |

The client treats any non-`ok` response as an error and renders `data.error`.

---

## 7. Configuration

All server-side, read via `dotenv` from a `.env` file at the repo root. **There is currently no `.env` in the repo**, so email is unconfigured — the server says so at startup.

| Variable | Required | Default | Effect if unset |
|---|---|---|---|
| `PORT` | No | `5000` | API listens on 5000 |
| `NODE_ENV` | No | `development` | Logged at startup only |
| `EMAIL_HOST` | For email | — | SMTP connection fails |
| `EMAIL_PORT` | No | `587` | |
| `EMAIL_SECURE` | No | `false` | Set `'true'` for port 465 |
| `EMAIL_USER` | For email | — | **Gates the whole email path** — unset means no send and a startup warning |
| `EMAIL_PASS` | For email | — | Same gate as above |
| `EMAIL_FROM_NAME` | For email | — | Interpolated into the `From:` display name; renders `"undefined" <addr>` if unset while email is otherwise configured |
| `EMAIL_TO` | For email | — | Recipient of the internal notification; undefined recipient makes `sendMail` throw |

Frontend configuration is compile-time only and lives entirely in [config.js](client/src/constants/config.js) (`SITE_URL`, `CONTACT_EMAILS`, `COMPANY_INFO`). There are no `VITE_*` variables.

---

## 8. Build and deploy

| Command | Run from | Does |
|---|---|---|
| `npm run dev` | root | `concurrently` → nodemon API (5000) + Vite (3000) |
| `npm run server` | root | API only, with reload |
| `npm run client` | root | `cd client && vite` |
| `npm start` | root | `node server/index.js` — API only, no frontend |
| `npm run build` | `client/` | Production bundle → `client/dist/` |
| `npm run preview` | `client/` | Serves the built bundle locally |
| `npm test` | either | **Stub** — echoes and exits 1 |

Current build output: `index.html` ~1.1 kB, CSS ~30.9 kB (5.9 kB gzip), JS ~433.8 kB (138.0 kB gzip) — a single chunk, no code splitting.

`client/dist/` is gitignored, so a fresh clone contains no build output and `npm run build` is a required step before deploying, not a refresh of something already in the repo.

Production runs nginx (static + TLS + `/api` reverse proxy) with the Express app under PM2. **nginx must fall back to `index.html` for unknown paths** or client-side routes 404 on refresh. Full procedure, SSL, PM2 config, and rollback steps are in [DEPLOYMENT-README.md](DEPLOYMENT-README.md).

---

## 9. Known issues and technical debt

Roughly ordered by impact.

| # | Issue | Status | Detail |
|---|---|---|---|
| 1 | `--legacy-peer-deps` required | **Workaround in place** | `react-helmet-async@2.0.5` declares peer `react@^16 \|\| ^17 \|\| ^18` against React 19. A plain `npm install` in `client/` aborts and leaves a half-populated `node_modules`. The flag is not persisted — a `client/.npmrc` containing `legacy-peer-deps=true` would make it stick. **React 19 hoists `<title>`/`<meta>`/`<link>` natively**, so removing the dependency and simplifying [SEO.jsx](client/src/components/SEO.jsx) and the `HelmetProvider` in [App.jsx](client/src/App.jsx) would eliminate the conflict at its root. |
| 2 | No catch-all route | **Gap** | An unknown path renders the header over an empty `<main>` rather than a 404 page. Add `<Route path="*" ...>`. |
| 3 | npm audit: 11 advisories (9 high) | **Open** | Client dependency tree. Left untouched deliberately — `audit fix` can shift versions underneath a working install. Review before the next deploy. |
| 4 | No tests | **Gap** | `npm test` is a placeholder. No unit, integration, or E2E coverage. The validation logic in `contactController` is the highest-value thing to cover first — it is pure and easy to test. |
| 5 | Contact submissions not persisted | **By design, risky** | Only stdout. If mail is misconfigured, enquiries are effectively lost once logs rotate. A database row, file append, or webhook would make this durable. |
| 6 | Silent email failure | **By design, monitor it** | The endpoint returns `200` on send failure (see §5). The browser cannot distinguish a working mail setup from a broken one. |
| 7 | No rate limiting on `POST /api/contact` | **Gap** | No throttle, CAPTCHA, or honeypot. The endpoint triggers two outbound emails per request, so it is abusable. `express-rate-limit` plus a honeypot field would be proportionate. |
| 8 | Permissive CORS | **Review** | `cors()` with no options allows any origin. Harmless behind single-domain nginx; tighten if the API is ever exposed directly. |
| 9 | Stale copy and palette in email templates | **Open** | "Acceleration Engine"/"backlog" language and cyan `#64ffda` in [contactEmail.js](server/templates/contactEmail.js). See §5. |
| 10 | `foundingDate` vs "Since 2024" | **Inconsistency** | Schema says `2020`; the About page says "Since 2024". One of them is wrong. |
| 11 | Tagline duplicated as literals | **Minor** | `COMPANY_INFO.TAGLINE` exists but nothing imports it; the string is repeated in `index.html` and `SEO.jsx`. `index.html` is static so it cannot consume the constant, but `SEO.jsx` could. (`COMPANY_INFO.NAME` is no longer in this position — [Footer.jsx](client/src/components/Footer.jsx) consumes it. The site *URL* was centralised as `SITE_URL` and is no longer duplicated either.) |
| 12 | Unused exports | **Cleanup** | `staggerContainerFast`, `getLocalBusinessSchema`, `getBreadcrumbSchema` are defined and imported nowhere. |
| 13 | Orphaned assets | **Cleanup** | `public/team/riaan.jpg` (unreferenced since the leadership change); **23 of 27** files in `public/partners/` unreferenced, including near-duplicate naming variants of the same logo (`abacus insurance.png` / `abacus-insurance.png`, `LG innotech.png` / `lg-innotek.png`, `Maxim_Integrated.png` / `maxim-integrated.png`, `Hannover_RE.svg` / `hannover-re.svg` / `hannover-re.png`, `Sony-Ericsson-Logo.png` / `sony-ericsson.png`, `nokia.svg` / `nokia.png`); the whole `public/partners.backup/` directory (21 more files); and a stray `nul` file at the repo root (a Windows shell-redirect artefact, now gitignored; still safe to delete). |
| 14 | Missing partner logo | **Blocked on asset** | A "Sens" logo was requested for the carousel but no file exists. A commented placeholder sits in [UseCases.jsx](client/src/pages/UseCases.jsx); drop `sens.png` into `public/partners/` and uncomment. |
| 15 | Single ~434 kB JS chunk | **Optimisation** | No route-level code splitting. `React.lazy` per route would cut first load. The privacy policy page is a good first candidate: it carries ~21 kB of legal text that no other route needs. |
| 16 | Privacy policy page has diverged from its source document | **Tracked, needs a doc edit** | Four corrections live only in [PrivacyPolicy.jsx](client/src/pages/PrivacyPolicy.jsx) and not in `DataPulse AI_Website_Privacy_Policy.docx`: three typographical (clause 7.1 lowercase "if", clause 12.4 stray "I", clause 3.2.3 bracket/spacing) and one substantive — the document dropped its *Children's Data Collection* section without renumbering the two cross-references that followed, so "Clause 7"/"Clause 11" are wrong **in the document itself** and are corrected to 6/10 on the page. Fix by carrying all four back into the .docx; until then, any re-import silently reintroduces them. The file's module header comment is the authoritative list. |
