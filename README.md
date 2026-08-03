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

## 1. Run it locally 

```bash
cd study-planner
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser (use Chrome DevTools'
device toolbar, or open it on your phone via your computer's local IP, to see
the mobile layout).

## 2. Get a free Groq API key (for the AI Coach)

1. Go to **https://console.groq.com/keys**
2. Sign up / log in (free)
3. Click **Create API Key**, copy it (starts with `gsk_...`)
4. In the app, open **Settings → AI Coach**, paste the key, tap **Save key**

The key is stored only in your browser's `localStorage`. It is sent directly
from the browser to `api.groq.com` when you chat — never to any server of
ours, because there is no server.

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
