# ARM — Account & Relationship Manager

A modern, high-velocity Customer Relationship Management (CRM) and Relationship Operations platform built with React 19, Vite, Tailwind CSS, Framer Motion, and Skiper-inspired UI component architecture.

---

## Overview

**ARM** is built for high-performance revenue teams, founders, and sales leaders to manage enterprise accounts, pipeline velocity, prospect outreach playbooks, tasks, and deal intelligence without gimmicky AI fluff.

### Key Features & Highlights

- **Executive Revenue Dashboard**: Real-time sales metrics, conversion rates, animated number tickers, visual revenue charts, and quick-action triggers.
- **Skiper-Inspired Motion Design**:
  - `SpotlightCard`: Smooth cursor-following radial glow cards.
  - `AnimatedTabs`: Fluid Framer Motion sliding pill tab indicators.
  - `NumberTicker`: Easing counter animations for high-impact ARR/deal metrics.
  - `CommandPalette`: Instant universal search & action launcher (`⌘K` / `Ctrl+K`).
  - `StatusPill`: High-visibility pulse indicators for deal and lead lifecycles.
- **Visual Deal Pipeline & Celebrations**: Interactive drag-and-drop Kanban board for managing deals across stages (*Lead, Contacted, Proposal, Negotiation, Won, Lost*) with integrated canvas confetti celebrations upon winning deals.
- **Sales Playbook Outreach Composer**:
  - Multi-playbook sales templates (*Enterprise Discovery, Inbound Fast-Response, Multi-Thread Exec Intro, Value Prop ROI, Objection Handling, Winback*).
  - Instant dynamic merge tags (`{{firstName}}`, `{{company}}`, `{{dealName}}`, `{{dealValue}}`).
- **Lead Scoring & Deal Health Radar**:
  - Deterministic 0-100 quantitative scoring algorithm.
  - Buying signals, risk factor breakdown, qualification checklists, and recommended revenue next steps.
- **Tasks & Activity Execution**: Prioritized sales tasks, deadline countdowns, completion toggles, and status filters.
- **Account Notes & Logs**: Rich categorized meeting notes and strategy briefs tied to enterprise contacts and leads.
- **Modern Typography & Luxury Dark Aesthetic**:
  - Typography: **Plus Jakarta Sans**, **Outfit**, and **JetBrains Mono**.
  - Slate & Obsidian palette (`#090d16`, `#0f1422`, `#141b2d`) with electric blue and indigo neon accents.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Canvas Confetti, Recharts, Lucide React, dnd-kit, Sonner
- **Routing & State**: React Router v7, React Context API, React Hook Form
- **Component Architecture**: Skiper UI primitives (`SpotlightCard`, `AnimatedTabs`, `NumberTicker`, `CommandPalette`, `StatusPill`, `Logo`)
- **Styling**: Modern dark luxury glassmorphism tokens, Tailwind CSS v4, custom CSS utilities

---

## Project Structure

```
arm/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── public/                 # Static assets, SVG favicons, logo files
│   ├── src/
│   │   ├── assets/             # Brand graphics and ARM monogram logo
│   │   ├── components/
│   │   │   ├── common/         # Page headers, stat cards, empty states
│   │   │   ├── dashboard/      # Dashboard hero widgets and revenue cards
│   │   │   ├── layout/         # AppLayout, TopNav, Sidebar, IconRail, ProtectedRoute
│   │   │   ├── leads/          # Lead forms and detail drawers
│   │   │   ├── outreach/       # Playbook EmailComposerDialog & LeadScoringCard
│   │   │   └── ui/             # Skiper UI primitives (SpotlightCard, AnimatedTabs, CommandPalette, etc.)
│   │   ├── context/            # AuthContext and global application state
│   │   ├── lib/                # API helpers, services, constants, formatters, mock data
│   │   └── pages/              # Dashboard, Leads, Contacts, Pipeline, Tasks, Notes, Settings, Auth
│   ├── index.html              # Vite entry HTML with Google Fonts
│   ├── package.json            # Client dependencies and scripts
│   └── vite.config.js          # Vite configuration
└── server/                     # Backend API services (future expansion)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/almostalok/arm.git
   cd arm
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## Scripts

From the `client/` directory:

- `npm run dev` – Launch local development server with HMR.
- `npm run build` – Build optimized production bundle.
- `npm run preview` – Locally preview the production build.
- `npm run lint` – Run ESLint to verify code quality.

---

## License

This project is licensed under the MIT License.
