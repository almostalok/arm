# ARM (AI Relationship Manager)

A modern, intelligent Customer Relationship Management (CRM) and Relationship Manager web application built with React, Vite, Tailwind CSS, and Lucide Icons.

---

## Overview

**ARM** is designed for modern teams, founders, and sales professionals to manage their contacts, leads, deals pipeline, tasks, and notes with integrated AI assistance.

### Key Features

- **Intuitive Dashboard**: Real-time sales metrics, conversion rates, visual revenue charts, and quick-action widgets.
- **Visual Deal Pipeline**: Interactive drag-and-drop Kanban board for managing deals across stages (Lead, Contacted, Proposal, Negotiation, Won, Lost).
- **Leads & Contacts Management**: Rich profiles, interaction history, activity tracking, and status filtering.
- **AI-Powered Assistance**:
  - AI email generator and draft composer with customizable tone and context.
  - Smart lead insights, automated qualification scoring, and next-action recommendations.
- **Task & Activity Tracking**: Prioritized tasks, deadlines, completion statuses, and reminders.
- **Notes & Logs**: Rich notes tied to contacts, leads, and deal histories.
- **Authentication & Security**: Dedicated login, registration, and role-aware protected routing.

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide React, dnd-kit, Sonner
- **Routing & State**: React Router v7, React Context API, React Hook Form
- **Styling**: Modern dark & light design system, Tailwind CSS v4, Glassmorphism UI tokens
- **Architecture**: Modular component architecture with reusable UI primitives and mock data services

---

## Project Structure

```
arm/
├── client/                     # Frontend Single Page Application (React + Vite)
│   ├── public/                 # Static assets, icons, and SVG graphics
│   ├── src/
│   │   ├── assets/             # Brand graphics and images
│   │   ├── components/
│   │   │   ├── ai/             # AI draft dialogs and smart insight cards
│   │   │   ├── common/         # Page headers, stat cards, empty states, dialogs
│   │   │   ├── dashboard/      # Dashboard hero widgets and summary cards
│   │   │   ├── layout/         # AppLayout, Topbar, Sidebar, IconRail, ProtectedRoute
│   │   │   ├── leads/          # Lead forms and detail drawers
│   │   │   └── ui/             # Core UI library (Button, Badge, Card, Input, Tabs, etc.)
│   │   ├── context/            # AuthContext and global application state
│   │   ├── lib/                # API helpers, services, constants, formatters, mock data
│   │   └── pages/              # Dashboard, Leads, Contacts, Pipeline, Tasks, Notes, Settings, Auth
│   ├── index.html              # Vite entry HTML
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

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

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
