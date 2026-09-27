# GrowTogether 🌸

**Two journeys. One purpose. Grow together. ❤️**

GrowTogether is a cute, romantic, motivational daily routine and career-growth PWA designed for two partners who want to build their careers together. It's a real, installable, offline-first Progressive Web App — no backend, no account, no tracking. Everything lives on your device.

---

## ✨ Features

- **Multi-user profiles** — supports two (or more) partners, each with their own routines, tasks, goals, progress, and achievements. Switch between profiles instantly.
- **Demo mode** — a fully populated demo with realistic sample data for "Hafeeza" (AI Engineer) and "Partner" (Software Developer), so you can explore every feature immediately.
- **Routine modes** — Normal Day 📚, Holiday 🌴, and Exam Mode 📝, each with its own independent schedule.
- **Routine timeline** — add, edit, delete, duplicate and complete activities with live "current / upcoming / completed" states.
- **Tasks** — priorities, categories, due dates, search and filters.
- **Goals** — personal, career, and learning goals with editable progress bars, plus shared **Couple Goals**.
- **Together page ("Our Journey")** — combined progress, shared stats, shared achievements, and "Little Things That Matter" daily check-ins.
- **Progress & charts** — weekly/monthly/all-time views with lightweight CSS/SVG bar and circular charts (no external chart service).
- **Achievements** — 7 auto-unlocking badges based on real usage stats.
- **Daily Reflection** — mood tracker + guided prompts with history.
- **Excel & JSON backup** — full data export/import via SheetJS, with clean per-entity sheets, plus a JSON backup option.
- **Installable PWA** — offline-capable, with a custom install prompt, app icons, and a service worker.
- **Pink/rose/blush romantic design system** — soft gradients, floating hearts, heart+sprout logo, dark mode.
- **100% private** — no server, no analytics, no tracking. All data stays in your browser's IndexedDB.

---

## 🛠 Tech Stack

- **React 19** + **Vite** — fast dev/build tooling
- **Tailwind CSS 3** — utility-first styling with a custom pink design system
- **Framer Motion** — smooth, subtle animations (respects `prefers-reduced-motion`)
- **React Router (Hash Router)** — client-side routing that works flawlessly on static hosts like GitHub Pages
- **idb** — a small Promise wrapper around IndexedDB for the local data layer
- **xlsx (SheetJS)** — Excel workbook generation and parsing, fully client-side
- **lucide-react** — icon set for functional UI (emojis are used for emotional/visual accents)
- **vite-plugin-pwa** — service worker + Web App Manifest generation

No paid APIs. No API keys. No backend of any kind is required to run or deploy this app.

---

## 📁 Folder Structure

```
growtogether-pwa/
├── public/
│   ├── icons/                 # PWA icons (192, 512, apple-touch, favicon-32)
│   ├── favicon.svg            # Custom GrowTogether logo (heart + sprout)
│   └── .nojekyll
├── src/
│   ├── assets/
│   ├── components/            # Reusable UI (Button, Card, Modal, cards, nav, modals…)
│   ├── context/                # AppContext (users/theme), ToastContext
│   ├── data/                   # constants, quotes, demo data generator
│   ├── db/                     # IndexedDB layer (db.js) + repository.js (CRUD)
│   ├── hooks/                   # useCollection, useInstallPrompt
│   ├── layouts/                 # AppLayout (sidebar + bottom nav + navbar)
│   ├── pages/                   # Splash, Onboarding, Dashboard, Routine, Tasks,
│   │                            # Goals, Together, Progress, Achievements,
│   │                            # Reflection, Profile, DataBackup, Settings, NotFound
│   ├── services/                # excelService, jsonBackupService, seedService,
│   │                            # achievementService, progressService
│   ├── utils/                   # dateUtils
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/workflows/deploy.yml # GitHub Pages deployment workflow
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

### 3. Build for production

```bash
npm run build
```

Output goes to the `dist/` folder.

### 4. Preview the production build locally

```bash
npm run preview
```

---

## 🌍 Deploying to GitHub Pages

This project ships with a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Create a new GitHub repository (any name — the workflow does **not** hardcode a repo name).
2. Push this project to the repository's `main` branch.
3. In your repository settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Push a commit to `main` (or run the workflow manually from the **Actions** tab).
5. The workflow will:
   - Install dependencies (`npm ci`)
   - Build the app with the correct base path (`/<your-repo-name>/`) automatically derived from the repository name
   - Deploy the `dist/` folder to GitHub Pages

Because the app uses a **Hash Router** (`/#/dashboard`, `/#/tasks`, etc.), all in-app navigation and page refreshes work correctly on GitHub Pages without any extra SPA-fallback configuration.

You can also deploy manually to any static host (Netlify, Vercel, Cloudflare Pages, plain S3/Nginx) by uploading the contents of `dist/` — just be sure to set `VITE_BASE_PATH` appropriately if the app isn't served from the domain root, e.g.:

```bash
VITE_BASE_PATH=/ npm run build
```

---

## 💾 How local storage works (IndexedDB)

All application data — users, routines, activities, tasks, goals, couple goals, daily progress, achievements, reflections, "little things," settings, and theme — lives in a single IndexedDB database (`growtogether-db`) managed by `src/db/db.js` and `src/db/repository.js`.

- Data survives page refreshes and browser restarts.
- Nothing is ever sent to a server — this app has none.
- If IndexedDB is unavailable (e.g. very old browser, blocked storage), the app shows a friendly explanation screen instead of crashing.

## 📊 How Excel backup works

From **Data & Backup**, choose **Export Excel** to download a workbook named `GrowTogether_Backup_YYYY-MM-DD.xlsx` containing separate sheets: `Users`, `Routines`, `Activities`, `Tasks`, `Goals`, `Daily_Progress`, `Achievements`, `Reflections`, `Settings`, and `Couple_Goals` — each with clean, documented column headers. Choose **Restore Excel** to pick a previously exported (or hand-edited) `.xlsx` file; you'll be asked to confirm before your current data is replaced. Invalid files are rejected with a friendly message and never crash the app. A **JSON backup** option is also available as a lighter-weight alternative, with the same safety confirmations.

## 📱 Installing as a PWA

Open the app in a supporting browser (Chrome, Edge, or most Android/desktop browsers). You'll see an **"Install GrowTogether 🌸"** card appear automatically when installation is available — tap **Install App**, or use your browser's own "Install" / "Add to Home Screen" option. Once installed, GrowTogether works fully offline.

## 🔒 Privacy

GrowTogether does not collect, transmit, or store any personal data outside your own device. There is no analytics, no tracking, and no third-party data sharing. You are always in control — export a backup any time from **Data & Backup**, and clear all data whenever you like from the same screen.

---

Made with 💕 for two people building their futures together.
