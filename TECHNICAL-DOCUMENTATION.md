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

**Client-side routing.** All five routes are resolved in the browser by React Router; the server only ever serves `index.html`. **Any production host must rewrite unknown paths to `index.html`**, or a hard refresh on `/about` returns 404. The Vite dev server does this automatically.

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
│   │   ├── sitemap.xml             5 URLs
│   │   ├── robots.txt, site.webmanifest, favicon-*.png, og-image.png
│   │   ├── maintenance.html        Static holding page used by the nginx gate
│   │   └── partners.backup/        Orphaned duplicate of partners/
│   └── src/
│       ├── main.jsx                ReactDOM root
│       ├── App.jsx                 Providers, route table
│       ├── animations/             AnimatedBackground (canvas)
│       ├── components/             Navigation, SEO, ScrollToTop
│       ├── constants/              animations.js, config.js
│       ├── pages/                  Home, About, Offerings, UseCases, Contact (+ .css each)
│       ├── styles/global.css       Design tokens and base styles
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
| [App.jsx](client/src/App.jsx) | `App` | **Active** | Wraps the tree in `HelmetProvider` → `Router` → `ScrollToTop` + `Navigation` + `<Routes>`. |

**Route table** ([App.jsx](client/src/App.jsx)):

| Path | Element | Status |
|---|---|---|
| `/` | `Home` | **Active** |
| `/about` | `About` | **Active** |
| `/offerings` | `Offerings` | **Active** |
| `/use-cases` | `UseCases` | **Active** |
| `/contact` | `Contact` | **Active** |
| `/services` | `<Navigate to="/offerings" replace />` | **Active** — legacy redirect; the page was renamed in the Oct 2026 overhaul and this keeps old inbound links and search results alive |

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

### Pages

#### [Home.jsx](client/src/pages/Home.jsx) — **Active**

| Section | Content |
|---|---|
| Hero | Animated background and the "The Joy of Creation" pill only — no heading or CTA by design |
| Partnership | "We partner with leaders on AI and technology strategies." — **this is the page `<h1>`** — plus lead paragraph and the indicators block |
| Problem | Three cards: Slow Delivery, High Cost & Risk, Inaccessible Technology |
| Power behind our Offerings | Ava & Ada flow diagram, three capability cards, closing quote |
| CTA | "Let's achieve your AI strategies together" → Our Story (`/about`), Offerings (`/offerings`) |

- **`indicators`** — local array of four `{value, label}`: 80% Work Automated, 15min Prototype Speed, 17+ Years Experience, 7% Increase in Revenue.
- **The `<h1>` lives in the partnership section, not the hero** — the hero carries no heading by design, so the outline starts one section down. The heading is sized by `.partnership-section .section-title`, which out-specifies the bare `h1` rule in `global.css`, so it renders identically to the `<h2>` it replaced. Changing its tag or that selector will change the visual design.
- **Scroll-theme effect** — a `scroll` listener maps viewport offset onto the four `AnimatedBackground` themes (`default` → `solution` → `problem` → `acceleration`) at 0.8/1.8/2.8 viewport-height thresholds. **These thresholds are tuned to this page's four sections**; adding or removing a section requires retuning them or the background shifts stop lining up.

#### [About.jsx](client/src/pages/About.jsx) — **Active**

Order is deliberate: Hero → 17+ Years banner → Philosophy → **Our Practice → Our Values → Our Leadership**. Leadership sits *below* Values as specified.

- **`philosophyPillars`** — three `{title, description}`.
- **`leadership`** — two `{name, title, photo, photoClass}`: Arthur Procopos (CEO and Innovation Officer), Calvin Nigrini (CTO and Information Officer). `photoClass` carries a per-person `object-position` correction so the crop frames each face.
- Emits two `getPersonSchema` blocks plus `getWebPageSchema`.

#### [Offerings.jsx](client/src/pages/Offerings.jsx) — **Active**

| Export / const | Status | Notes |
|---|---|---|
| `analyticsServices` | **Active** | 8 `{service, outcome}` rows — Advanced Analytics, Insights, and AI Services |
| `softwareServices` | **Active** | 8 `{service, outcome}` rows — Design, Product, and Software Track |
| `examples` | **Active** | 18 strings rendered as a multi-column grid |
| `ServiceTable` | **Active** | Local presentational component, used twice |

`ServiceTable({ rows, caption })` renders a real `<table>` with a visually-hidden `<caption>`, `<th scope="col">` headers, and `<th scope="row">` for the service name. Each `<td>` carries `data-label`, which the CSS surfaces as a pseudo-element heading when the table collapses to stacked cards below 640px.

All pricing was removed in the Oct 2026 overhaul — there is no `$13,500`, no comparison table, and `getServiceSchema()` no longer advertises an `offers` block.

#### [UseCases.jsx](client/src/pages/UseCases.jsx) — **Active**

Holds the three sections moved off About: track record, outcome stats, partner carousel.

- **`trackRecord`** — six `{title, description}` project summaries.
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

### [AnimatedBackground.jsx](client/src/animations/AnimatedBackground.jsx) — **Active**

A full-viewport fixed canvas (`z-index: -1`) drawing three layers each frame: filled sine waves, straight-line connections between nearby particles, and the particles themselves. Driven by `requestAnimationFrame`; the loop is cancelled on unmount and re-created when `dimensions` or `theme` change. Particle count scales with viewport area (`width * height / 15000`); connections are drawn between pairs closer than 150px.

**The `theme` prop** takes `default | problem | solution | acceleration`. After the greyscale redesign these no longer encode *hue* — every layer draws white, and the theme selects an **alpha** (a step along the greyscale ramp), so sections still read as distinct without colour.

> **Alpha accumulation — the trap in this file.** The canvas is never fully cleared; each frame paints `rgba(0,0,0,0.12)` over the previous one. Three wave bands then fill *down to the bottom edge* every frame. Those alphas therefore accumulate toward roughly `sum / (sum + clearAlpha)`, not toward their nominal value. With the original cyan-on-navy values (~0.03 each) the asymptote is about **44% white** — a solid grey slab across the lower half of every page that dropped body text to ~3.4:1 contrast. The wave alphas are consequently set very low (0.002–0.009). **If you raise them, raise them by a little and check the result after several seconds of running**, not on the first frame — the build-up is invisible initially.

### Constants and utilities

| File | Export | Status | Notes |
|---|---|---|---|
| [animations.js](client/src/constants/animations.js) | `fadeInUp` | **Active** | `{opacity 0, y 60}` → `{opacity 1, y 0}`, 0.6s. Used on nearly every animated element. |
| | `staggerContainer` | **Active** | `staggerChildren: 0.2` |
| | `staggerContainerFast` | **Unused** | `staggerChildren: 0.15`; defined but imported nowhere |
| [config.js](client/src/constants/config.js) | `SITE_URL` | **Active** | `https://datapulseai.co` — the single source of truth for the public origin. Imported by [SEO.jsx](client/src/components/SEO.jsx) (canonical, OG/Twitter URLs and images) and [structuredData.js](client/src/utils/structuredData.js) (all absolute URLs). |
| | `CONTACT_EMAILS` | **Active** | `PRIMARY: arthur@datapulseai.co`, `INFO: info@datapulseai.co`. Also consumed by `structuredData.js` for schema `email` fields. |
| | `COMPANY_INFO` | **Partially wired** | `NAME` and `TAGLINE` ("The Joy of Creation") are exported but not imported anywhere — the tagline is still duplicated as literals in `index.html` and `SEO.jsx` |

#### [structuredData.js](client/src/utils/structuredData.js)

| Function | Status | Used by |
|---|---|---|
| `getOrganizationSchema()` | **Active** | Home. Founders: Arthur Procopos, Calvin Nigrini. `slogan: "The Joy of Creation"`. `foundingDate: "2020"` — note this sits oddly against the About page's "Since 2024". |
| `getServiceSchema()` | **Active** | Offerings. The `offers`/`price` block was removed with the pricing section, so the markup no longer advertises a price the site doesn't show. |
| `getLocalBusinessSchema()` | **Unused** | Defined but imported nowhere — Contact does not use it |
| `getPersonSchema(name, jobTitle, image)` | **Active** | About (twice). `image` is never passed, so the emitted `image` key is `undefined` and drops out of the JSON. |
| `getBreadcrumbSchema(items)` | **Unused** | Defined but imported nowhere |
| `getWebPageSchema(path, name, description)` | **Active** | All five pages. `path` is the **route path** (`'/'`, `'/about'`, …); the absolute URL is built as `` `${SITE_URL}${path}` ``, so the emitted node always matches both the route and [sitemap.xml](client/public/sitemap.xml). Note `name` here legitimately carries the `- DataPulse AI` suffix — unlike the `SEO` `title` prop, it is not re-suffixed. |

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
| `--grey-mid` | `#a0a0a0` | Meta and muted labels only — **never body copy** |
| `--text-secondary` | `#c4c4c4` | Body copy |
| `--text-primary` | `#f5f5f5` | Headings |
| `--white` | `#ffffff` | Emphasis, primary button fill |
| `--radius` | `2px` | Near-square corners — the "sharp" of the sharper UI |
| `--nav-height` | `112px` | Height of the two-row fixed header |
| `--hero-offset` | `calc(var(--nav-height) + 3rem)` | Top padding every page hero must clear |

**Contrast is a hard requirement**, not a preference: every text node on every page measures **≥ 7.04:1** (WCAG AAA), verified programmatically across all five routes. `--grey-mid` is as dark as the muted tone may go — it lands at roughly 7:1 on `--surface`. Darkening it breaks the guarantee.

### Two conventions worth knowing

**`--hero-offset` and selector specificity.** `global.css` defines `.section { padding: 5rem 0 }` and `.section-sm { padding: 4rem 0 }` as *shorthands*. Because `global.css` is imported from `App.jsx` it loads **after** the page stylesheets, so a bare `.offerings-hero { padding-top: ... }` in a page file is silently overridden — the symptom is a page heading colliding with the fixed header. Every hero therefore uses a page-scoped selector to win on specificity:

```css
.offerings .offerings-hero { padding-top: var(--hero-offset); }
```

Follow this pattern for any new page.

**`.gradient-text`.** Retained for markup compatibility — it is applied via `<span className="gradient-text">` in several headings. Now a white → `#b5b5b5` ramp (clipped to the text), with no hue. The dim end stops at `#b5b5b5` (~9.7:1 on black) so the accent never costs legibility.

Also in `global.css`: a visible `:focus-visible` outline for keyboard users, and a `prefers-reduced-motion` block that collapses animation and transition durations.

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

Current build output: `index.html` ~1.1 kB, CSS ~26.7 kB (5.2 kB gzip), JS ~400 kB (127 kB gzip) — a single chunk, no code splitting.

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
| 11 | Tagline duplicated as literals | **Minor** | `COMPANY_INFO.TAGLINE` exists but nothing imports it; the string is repeated in `index.html` and `SEO.jsx`. `index.html` is static so it cannot consume the constant, but `SEO.jsx` could. (The site *URL* was centralised as `SITE_URL` and is no longer duplicated.) |
| 12 | Unused exports | **Cleanup** | `staggerContainerFast`, `getLocalBusinessSchema`, `getBreadcrumbSchema` are defined and imported nowhere. |
| 13 | Orphaned assets | **Cleanup** | `public/team/riaan.jpg` (unreferenced since the leadership change); **23 of 27** files in `public/partners/` unreferenced, including near-duplicate naming variants of the same logo (`abacus insurance.png` / `abacus-insurance.png`, `LG innotech.png` / `lg-innotek.png`, `Maxim_Integrated.png` / `maxim-integrated.png`, `Hannover_RE.svg` / `hannover-re.svg` / `hannover-re.png`, `Sony-Ericsson-Logo.png` / `sony-ericsson.png`, `nokia.svg` / `nokia.png`); the whole `public/partners.backup/` directory (21 more files); and a stray `nul` file at the repo root (a Windows shell-redirect artefact, safe to delete). |
| 14 | Missing partner logo | **Blocked on asset** | A "Sens" logo was requested for the carousel but no file exists. A commented placeholder sits in [UseCases.jsx](client/src/pages/UseCases.jsx); drop `sens.png` into `public/partners/` and uncomment. |
| 15 | `README.md` is stale | **Open** | Still describes the pre-overhaul site: a Services page, "25+ years", and the Acceleration Engine pitch. Superseded by this document and [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md). |
| 16 | Single 400 kB JS chunk | **Optimisation** | No route-level code splitting. `React.lazy` per route would cut first load. |
