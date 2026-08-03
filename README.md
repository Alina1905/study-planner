# Rehearsal — AI Study Planner for Matric Students

A mobile-first, installable web app that helps Pakistani Matric (Class IX–X)
students plan their board-exam revision, track syllabus progress by subject
group (Pre-Engineering, Pre-Medical, Computer Science, Humanities, General
Science/Home Economics), and get help from an AI study coach powered by Groq.

No build step, no backend, no database — pure HTML/CSS/JS, so it runs
anywhere a browser does and is free to host.

## Features

- **Onboarding** — name, exam date, matric group, and starter theme
- **5 subject groups** pre-loaded with real Matric subjects & chapter lists
- **Subjects** — tap a subject to check off chapters and watch progress grow
- **Planner** — a weekly timetable (add sessions by subject/day/time) plus a
  simple to-do list
- **AI Coach** — chat with an AI tutor (Groq `llama-3.3-70b-versatile`) that
  knows the matric syllabus; quick-prompt buttons for "plan my week",
  "explain a topic", "quiz me", and "beat procrastination"
- **Progress** — streaks, per-subject bar charts, and unlockable badges
- **5 themes** — Ink & Almanac, Lights Out (dark), Bubble Gum, Deep Ocean,
  Sunset Sprint — switchable anytime from Settings
- **Installable PWA** — "Add to Home Screen" on Android/iOS makes it behave
  like a native app icon; a service worker caches it for offline use
- **All data stays on-device** in `localStorage` — nothing is sent to a
  server except the direct AI request to Groq's API

## 1. Run it locally (to test before submitting)

You don't need Node, npm, or any install. Any static file server works:

```bash
cd study-planner
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser (use Chrome DevTools'
device toolbar, or open it on your phone via your computer's local IP, to see
the mobile layout).

Opening `index.html` by double-clicking also mostly works, but a local
server is recommended so the service worker and manifest load correctly.

## 2. Get a free Groq API key (for the AI Coach)

1. Go to **https://console.groq.com/keys**
2. Sign up / log in (free)
3. Click **Create API Key**, copy it (starts with `gsk_...`)
4. In the app, open **Settings → AI Coach**, paste the key, tap **Save key**

The key is stored only in your browser's `localStorage`. It is sent directly
from the browser to `api.groq.com` when you chat — never to any server of
ours, because there is no server.

## 3. Deploy it and get a public link (for judging)

Pick whichever is easiest — all are free and take under 2 minutes.

### Option A — Netlify Drop (easiest, no account needed to start)
1. Go to **https://app.netlify.com/drop**
2. Drag the whole `study-planner` folder onto the page
3. Netlify gives you a live URL immediately (e.g. `random-name.netlify.app`)
4. (Optional) Create a free account to keep the link permanently and rename it

### Option B — Vercel
1. Go to **https://vercel.com/new**
2. Import the project (drag-and-drop is also supported, or push to GitHub
   first and import the repo)
3. Framework preset: **Other** (static site) — no build command needed
4. Deploy — Vercel gives you a `your-project.vercel.app` link

### Option C — GitHub Pages
1. Create a new GitHub repo and push the `study-planner` folder contents to it
2. Repo **Settings → Pages → Deploy from branch → main → / (root)**
3. Your link will be `https://<username>.github.io/<repo-name>/`

Once deployed, open the live link on your phone and use **Add to Home
Screen** — the app icon and splash behave like a real installed app.

## 4. What to submit to the judges

- **App Link** — the deployed URL from step 3 above
- **2–3 minute demo video** — screen-record on your phone (or use the
  responsive view in Chrome DevTools) walking through: onboarding → picking
  a group → checking off a topic → adding a planner session → asking the AI
  Coach a question → switching themes → progress/badges screen
- **PDF document** — see `Problem_Statement_and_AI_Tools.pdf` in this folder,
  which already covers the problem, target users, and AI tools used. Edit
  it with your name/team details before submitting.

## Project structure

```
study-planner/
├── index.html          # single-page app shell (onboarding + all views)
├── manifest.json        # PWA manifest (installable app metadata)
├── sw.js                 # service worker (offline caching)
├── css/style.css        # theme system + all component styles
├── js/data.js            # matric groups/subjects, quotes, themes, badges
├── js/ai.js               # Groq API wrapper
├── js/app.js              # app state, rendering, all interactions
├── icons/                 # app icons (192px, 512px)
└── README.md
```

## Customizing

- **Add/edit subjects or groups**: edit `GROUPS` in `js/data.js`
- **Add a theme**: add a `[data-theme="yourname"]` block in `css/style.css`
  and an entry in the `THEMES` array in `js/data.js`
- **Change the AI model**: edit `GROQ_MODEL` in `js/ai.js` (see
  https://console.groq.com/docs/models for available models)
