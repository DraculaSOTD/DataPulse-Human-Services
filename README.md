# DataPulse AI Website

A fullstack marketing website for DataPulse AI, a human and data science consultancy that partners with leaders and operations teams to implement data, machine learning, and AI technology.

> **Orientation:** [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) for a high-level tour · [TECHNICAL-DOCUMENTATION.md](TECHNICAL-DOCUMENTATION.md) for the code-level reference · [DEPLOYMENT-README.md](DEPLOYMENT-README.md) for production deployment.

## Features

- **Animated Background**: Particle-and-wave canvas behind every page
- **Responsive Design**: Fully responsive from 375px up
- **Smooth Animations**: Built with Framer Motion for scroll-reveal and page transitions
- **Modern Stack**: React + Vite frontend with Express backend
- **Accessibility**: Every text node measures at least 7.04:1 contrast against its background (WCAG AAA)
- **Five Pages**:
  - Home (`/`): Hero, the partnership statement with four performance indicators, "Examples of what we do" (18 examples filterable by industry), "Power behind our Offerings" (Ava & Ada), and a closing CTA
  - Offerings (`/offerings`): Advanced Analytics/Insights/AI services and Design/Product/Software services as tables, plus the startup partnership model
  - Use Cases (`/use-cases`): Six project case summaries, the performance indicators, and a partner logo carousel
  - About (`/about`): Who we are, Our Practice, Our Values, Our Leadership
  - Contact (`/contact`): Contact details and a form wired to the backend API
  - `/services` redirects to `/offerings` — the page was renamed and old links still resolve

## Tech Stack

### Frontend
- React 19
- Vite 7
- Framer Motion (animations)
- React Router DOM (routing)
- react-helmet-async (per-page meta tags and JSON-LD)
- CSS3 (hand-written, custom properties — no framework)

### Backend
- Express 5
- Node.js
- CORS
- Body Parser

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies — **the flag is required**:
```bash
cd client
npm install --legacy-peer-deps
cd ..
```

> **`--legacy-peer-deps` is not optional.** `react-helmet-async@2.0.5` declares peer `react@^16 || ^17 || ^18`, but this project runs React 19. A plain `npm install` in `client/` aborts partway through and leaves a broken `node_modules` — the symptom is `npm run dev` starting the API fine while the Vite half dies instantly with "vite not found".

## Running the Application

### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

Use the **3000** URL. Vite proxies `/api` to the backend, so port 5000 serves only `/api/*` and has no frontend.

### Backend Only
```bash
npm run server
```

### Frontend Only
```bash
npm run client
```

### Production
```bash
npm start              # API only — serves no frontend
cd client && npm run build   # Production bundle → client/dist/
```

`client/dist/` is gitignored, so a fresh clone contains no build output — building is a required step before deploying, not a refresh of something already in the repo.

## Project Structure

```
DataPulse-Human-Services/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── animations/    # AnimatedBackground (canvas)
│   │   ├── components/    # Reusable components (Navigation, SEO, ScrollToTop)
│   │   ├── constants/     # Shared data (animations.js, config.js, indicators.js)
│   │   ├── pages/         # Page components (Home, Offerings, UseCases, About, Contact)
│   │   ├── styles/        # Global tokens, base styles, shared utilities
│   │   ├── utils/         # structuredData.js (JSON-LD builders)
│   │   ├── App.jsx        # Providers and route table
│   │   └── main.jsx       # Entry point
│   └── vite.config.js     # Vite configuration
├── server/                # Backend Express application
│   ├── controllers/       # Request handlers
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
└── package.json          # Root package configuration
```

## Color Scheme

Black-and-white greyscale — **no hue anywhere in `client/src`**. The October 2026 redesign replaced an earlier cyan/blue/purple palette.

- Page ground: `#000000` · Section ground: `#0a0a0a` · Cards: `#141414`
- Headings: `#f5f5f5` · Body copy: `#c4c4c4` · Muted labels: `#a0a0a0`
- Emphasis and primary buttons: `#ffffff`

Defined as custom properties on `:root` in `client/src/styles/global.css`. **That file is the authority** — the full token table, and the contrast requirement the values exist to satisfy, are documented in [TECHNICAL-DOCUMENTATION.md §4](TECHNICAL-DOCUMENTATION.md).

## Animated Background

One static greyscale canvas (`z-index: -1`) drawing filled sine waves, connections between nearby particles, and the particles themselves. It reads identically on all five pages and does **not** change with scroll position or section — each page simply mounts its own `<AnimatedBackground />`. Particle count scales with viewport area.

Note for anyone tuning it: the canvas is never fully cleared, so layer alphas accumulate over several seconds rather than rendering at their nominal value. See the warning in [TECHNICAL-DOCUMENTATION.md §3](TECHNICAL-DOCUMENTATION.md) before raising them.

## Contact Form

The form posts to `POST /api/contact`, which validates the submission and sends two emails via Nodemailer — a notification to the business and a confirmation to the sender. Set the `EMAIL_*` variables in a root `.env` to enable sending; without them the server logs a startup warning and submissions reach the server log only.

Submissions are **not persisted** — there is no database. Durable storage would mean adding one of:
- CRM system (Salesforce, HubSpot, etc.)
- Database storage or a webhook

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Contact

- Email: arthur@datapulseai.co
- Email: info@datapulseai.co
