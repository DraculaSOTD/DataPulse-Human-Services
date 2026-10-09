# DataPulse AI — Project Summary

**DataPulse AI — The Joy of Creation**

A marketing website for DataPulse AI, a human and data science consultancy that partners with leaders and operations teams to implement data, machine learning, and AI technology.

> For the full code-level reference — every component, function, API endpoint, and its status — see **[TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md)**.
> For production deployment (nginx, PM2, SSL), see **[DEPLOYMENT-README.md](DEPLOYMENT-README.md)**.

---

## What this is

A five-page single-page application with a small Express API behind it. The only server-side behaviour is the contact form, which validates a submission and sends two emails (a notification to the business and a confirmation to the sender). There is **no database** and no user accounts — nothing is persisted.

The site was substantially overhauled in October 2026: repositioned from a fixed-price "on-demand AI & software squad" to a consultancy, restyled from a cyan/blue/purple palette to a black-and-white greyscale system, and restructured (Services became Offerings, a new Use Cases page was added).

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19.2, Vite 7.1, React Router 7.9, Framer Motion 12.23, react-helmet-async 2.0 |
| Backend | Node.js, Express 5.1, Nodemailer 7.0, dotenv, cors |
| Styling | Hand-written CSS with custom properties — no framework |
| Data | None — no database, no persistence |
| Tooling | concurrently, nodemon |

Verified on Node v24.13.0 / npm 11.4.2.

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero (animated background + "The Joy of Creation" pill), the partnership statement with four performance indicators, the problem framing, "Power behind our Offerings" (Ava & Ada), and a closing CTA |
| `/about` | Who the company is — positioning, 17+ years banner, Philosophy, Our Practice, Our Values, and Our Leadership (Arthur Procopos, Calvin Nigrini) |
| `/offerings` | Two service catalogues as tables — "Advanced Analytics, Insights, and AI Services" and the "Design, Product, and Software Track" — plus the startup partnership model and 18 examples of delivered work |
| `/use-cases` | Track record: six project case summaries, three outcome statistics, and a looping partner logo carousel |
| `/contact` | Contact details and the form that posts to the API |
| `/services` | Redirects to `/offerings` (the page was renamed; old links still resolve) |

## Running it locally

```bash
# 1. Root dependencies
npm install

# 2. Client dependencies — the flag is required, see below
cd client && npm install --legacy-peer-deps && cd ..

# 3. Start both servers
npm run dev
```

Then open **http://localhost:3000**. The Express API runs on port 5000; Vite proxies `/api` to it, so always use the 3000 URL — port 5000 serves only `/api/*` and has no frontend.

> **`--legacy-peer-deps` is not optional.** `react-helmet-async@2.0.5` declares peer `react@^16 || ^17 || ^18`, but this project runs React 19. A plain `npm install` in `client/` aborts partway through and leaves a broken `node_modules` containing only platform binaries — the symptom is `npm run dev` starting the API fine while the Vite half dies instantly with "vite not found". This is the single most likely thing to block a fresh clone.

| Command | Effect |
|---|---|
| `npm run dev` | Both servers (API on 5000 with nodemon, Vite on 3000) |
| `npm run server` | API only |
| `npm run client` | Frontend only — API calls will fail |
| `npm start` | Production API only (`node server/index.js`); serves no frontend |
| `cd client && npm run build` | Production bundle to `client/dist/` |

## Current state

**Working:** All five pages and the `/services` redirect. Navigation, routing, scroll-restoration, the canvas background animation, and all scroll-reveal animations. Per-page SEO metadata and JSON-LD structured data. The contact form submits, validates, and reports success or failure. Responsive from 375px up. Production build is clean with no console errors.

**Accessibility:** Every text node on every page measures at least **7.04:1** contrast against its background (WCAG AAA), verified programmatically. This was a hard requirement of the greyscale redesign.

**Needs configuration:** Email. Without `EMAIL_USER` and `EMAIL_PASS` the server logs a startup warning and the contact form still returns success to the user, but no email is sent — the submission exists only in the server log. See the configuration section of [TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md).

**Known constraints:**
- Contact submissions are **not persisted** — if email is unconfigured or delivery fails, the only record is the server's stdout log.
- **No tests.** `npm test` is a placeholder that exits 1.
- `npm audit` reports 11 advisories (9 high) in the client dependency tree; these were left untouched because `audit fix` can shift versions underneath a working install.
- The partner carousel shows 4 logos; a 5th ("Sens") was requested but no asset exists. There is a commented placeholder in the code ready for the file.

A consolidated list with severity and suggested fixes is in the **Known Issues** section of the technical documentation.
