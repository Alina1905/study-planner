/* ============================================================
   Rehearsal — app.js
   All app state, rendering and interaction logic. Vanilla JS,
   no build step, no backend — everything lives in localStorage.
   ============================================================ */

const STORAGE_KEY = "rehearsal_v1";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let state = null;
let currentSubjectId = null;
let currentPlannerDay = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
let currentQuoteIndex = null;

/* ---------------- state helpers ---------------- */
function defaultState() {
  return {
    onboarded: false,
    profile: { name: "", groupId: "pre-engineering", examDate: "" },
    theme: "almanac",
    progress: {},          // { subjectId: { topicIndex: true } }
    planner: { sessions: [], todos: [] },
    apiKey: "",
    chat: [],               // {role:'user'|'assistant', content}
    stats: { studyLog: [], aiUsed: false, sessionsDoneCount: 0 },
    earnedBadges: [],
    gamification: { xp: 0, friends: [] }, // friends: {id, name, xp}
    tourSeen: false,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed, profile: { ...defaultState().profile, ...(parsed.profile || {}) }, stats: { ...defaultState().stats, ...(parsed.stats || {}) }, gamification: { ...defaultState().gamification, ...(parsed.gamification || {}) } };
  } catch (e) {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function logActivity() {
  const t = todayStr();
  if (!state.stats.studyLog.includes(t)) {
    state.stats.studyLog.push(t);
    state.stats.studyLog = state.stats.studyLog.slice(-120);
  }
}

function computeStreak() {
  const log = new Set(state.stats.studyLog);
  let streak = 0;
  let d = new Date();
  // if today not logged yet, streak counts back from yesterday
  if (!log.has(todayStr())) d.setDate(d.getDate() - 1);
  while (true) {
    const s = d.toISOString().slice(0, 10);
    if (log.has(s)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

function getGroup() {
  return GROUPS.find((g) => g.id === state.profile.groupId) || GROUPS[0];
}
function getSubjectsForGroup() {
  return getGroup().subjects;
}
function getSubjectById(id) {
  return getSubjectsForGroup().find((s) => s.id === id);
}
function subjectProgress(subject) {
  const p = state.progress[subject.id] || {};
  const done = subject.topics.filter((_, i) => p[i]).length;
  return { done, total: subject.topics.length, pct: subject.topics.length ? Math.round((done / subject.topics.length) * 100) : 0 };
}

function computeGlobalStats() {
  let totalCompleted = 0;
  let subjectMastered = false;
  getSubjectsForGroup().forEach((s) => {
    const sp = subjectProgress(s);
    totalCompleted += sp.done;
    if (sp.total > 0 && sp.done === sp.total) subjectMastered = true;
  });
  return {
    totalCompleted,
    subjectMastered,
    streak: computeStreak(),
    sessionsDone: state.planner.sessions.filter((s) => s.done).length,
    aiUsed: state.stats.aiUsed,
  };
}

function effectiveApiKey() {
  return (state.apiKey && state.apiKey.trim()) || DEV_API_KEY || "";
}

/* ---------------- XP / levels ---------------- */
function getLevelInfo(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) idx = i;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] || null;
  const span = next ? next.min - current.min : 1;
  const into = next ? xp - current.min : span;
  const pct = next ? Math.min(100, Math.round((into / span) * 100)) : 100;
  return { levelNum: idx + 1, title: current.title, xp, next, xpToNext: next ? next.min - xp : 0, pct };
}
function addXP(amount) {
  const before = getLevelInfo(state.gamification.xp).levelNum;
  state.gamification.xp = Math.max(0, state.gamification.xp + amount);
  const after = getLevelInfo(state.gamification.xp).levelNum;
  saveState();
  if (after > before) {
    const info = getLevelInfo(state.gamification.xp);
    setTimeout(() => toast(`⬆️ Level up! You're now "${info.title}"`), 300);
  }
}

/* ---------------- toast ---------------- */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------------- confetti ---------------- */
const CONFETTI_EMOJI = ["🎉", "✨", "⭐", "🎯", "📘"];
function burstConfetti(originEl) {
  const rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const count = 14;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = CONFETTI_EMOJI[i % CONFETTI_EMOJI.length];
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.setProperty("--dx", `${dx}px`);
    piece.style.setProperty("--dy", `${dy}px`);
    piece.style.setProperty("--rot", `${(Math.random() - 0.5) * 360}deg`);
    piece.style.fontSize = `${12 + Math.random() * 10}px`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 900);
  }
}

/* ---------------- badge celebration ---------------- */
function celebrateBadge(badge) {
  const overlay = document.createElement("div");
  overlay.className = "badge-celebrate-backdrop";
  overlay.innerHTML = `<div class="badge-celebrate-card">
    <div class="bc-icon">🏅</div>
    <div class="bc-title">Badge unlocked!</div>
    <div class="bc-name">${badge.label}</div>
    <div class="bc-desc">${badge.desc}</div>
    <button class="btn btn-primary" id="bc-close">Nice!</button>
  </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
  burstConfetti(overlay.querySelector(".bc-icon"));
  const close = () => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 250);
  };
  overlay.querySelector("#bc-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
}

/* ---------------- theme ---------------- */
function applyTheme(id) {
  document.documentElement.setAttribute("data-theme", id);
  state.theme = id;
  saveState();
}

/* ================= ONBOARDING ================= */
let obStep = 1;
function renderOnboarding() {
  const groupGrid = document.getElementById("ob-group-grid");
  groupGrid.innerHTML = GROUPS.map(
    (g) => `<button class="group-choice ${state.profile.groupId === g.id ? "selected" : ""}" data-group="${g.id}">
      <strong>${g.name}</strong><span>${g.tagline}</span>
    </button>`
  ).join("");
  groupGrid.querySelectorAll(".group-choice").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.profile.groupId = btn.dataset.group;
      groupGrid.querySelectorAll(".group-choice").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    })
  );

  const themeGrid = document.getElementById("ob-theme-grid");
  themeGrid.innerHTML = THEMES.map(
    (t) => `<button class="theme-choice ${state.theme === t.id ? "selected" : ""}" data-theme-id="${t.id}">
      <div class="swatch-row">${t.swatch.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("")}</div>
      <div class="tname">${t.name}</div>
    </button>`
  ).join("");
  themeGrid.querySelectorAll(".theme-choice").forEach((btn) =>
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.themeId);
      themeGrid.querySelectorAll(".theme-choice").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    })
  );
}

function goObStep(n) {
  obStep = n;
  document.querySelectorAll(".ob-step").forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === n));
  document.getElementById("ob-back").style.display = n === 1 ? "none" : "block";
  document.getElementById("ob-next").textContent = n === 3 ? "Start planning" : "Continue";
}

function initOnboardingEvents() {
  document.getElementById("ob-next").addEventListener("click", () => {
    if (obStep === 1) {
      state.profile.name = document.getElementById("ob-name").value.trim() || "Student";
      state.profile.examDate = document.getElementById("ob-examdate").value;
      goObStep(2);
    } else if (obStep === 2) {
      goObStep(3);
    } else {
      state.onboarded = true;
      saveState();
      document.getElementById("onboarding-screen").style.display = "none";
      document.getElementById("app-shell").style.display = "flex";
      boot();
    }
  });
  document.getElementById("ob-back").addEventListener("click", () => goObStep(Math.max(1, obStep - 1)));
}

/* ================= NAVIGATION ================= */
function showView(name) {
  document.querySelectorAll("main.view").forEach((v) => v.classList.remove("active"));
  const view = document.getElementById(`view-${name}`);
  if (view) view.classList.add("active");
  document.querySelectorAll("nav.bottom-nav button").forEach((b) => b.classList.toggle("active", b.dataset.nav === name));
  if (name === "home") renderHome();
  if (name === "subjects") renderSubjects();
  if (name === "planner") renderPlanner();
  if (name === "ai") renderAI();
  if (name === "progress") renderProgress();
  if (name === "settings") renderSettings();
  window.scrollTo(0, 0);
}

function initNavEvents() {
  document.querySelectorAll("[data-nav]").forEach((el) =>
    el.addEventListener("click", () => showView(el.dataset.nav))
  );
}

/* ================= HOME ================= */
function renderHome() {
  const g = getGroup();
  document.getElementById("home-date").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  document.getElementById("home-greeting").textContent = `Hi, ${state.profile.name || "Student"} 👋`;
  document.getElementById("home-group-name").textContent = g.name;
  const streakVal = computeStreak();
  const streakEl = document.getElementById("home-streak");
  streakEl.textContent = streakVal;
  streakEl.parentElement.classList.toggle("home-streak-active", streakVal > 0);

  const dayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todayCode = DAYS[dayIdx];
  const todaySessions = state.planner.sessions.filter((s) => s.day === todayCode).sort((a, b) => a.time.localeCompare(b.time));
  const hoursThisWeek = Math.round((state.planner.sessions.filter((s) => s.done).reduce((sum, s) => sum + Number(s.duration), 0) / 60) * 10) / 10;
  document.getElementById("stat-hours").textContent = hoursThisWeek;
  document.getElementById("stat-topics").textContent = computeGlobalStats().totalCompleted;

  if (state.profile.examDate) {
    const days = Math.ceil((new Date(state.profile.examDate) - new Date(todayStr())) / 86400000);
    document.getElementById("stat-exam").textContent = days >= 0 ? days : "0";
  } else {
    document.getElementById("stat-exam").textContent = "—";
  }

  if (currentQuoteIndex === null) currentQuoteIndex = Math.floor(Date.now() / 86400000) % QUOTES.length;
  document.getElementById("home-quote").textContent = QUOTES[currentQuoteIndex];

  const list = document.getElementById("home-today-list");
  if (todaySessions.length === 0) {
    list.innerHTML = `<div class="empty-state"><span class="eicon">🗓️</span><p>No sessions planned for today. Add one from the Planner tab.</p></div>`;
  } else {
    list.innerHTML = todaySessions
      .map((s) => {
        const subj = getSubjectById(s.subjectId);
        return `<div class="task-item">
          <button class="task-check ${s.done ? "done" : ""}" data-session-toggle="${s.id}">${s.done ? "✓" : ""}</button>
          <div>
            <div class="ttext">${subj ? subj.name : "Subject"}</div>
            <div class="tmeta">${s.time} · ${s.duration} min</div>
          </div>
        </div>`;
      })
      .join("");
    list.querySelectorAll("[data-session-toggle]").forEach((b) => b.addEventListener("click", () => toggleSessionDone(b.dataset.sessionToggle)));
  }

  const preview = document.getElementById("home-subjects-preview");
  preview.innerHTML = getSubjectsForGroup().slice(0, 3).map(subjectSlipHTML).join("");
  preview.querySelectorAll(".roll-slip").forEach((el, i) => (el.style.animationDelay = `${i * 60}ms`));
  bindSlipEvents(preview);

  const refreshBtn = document.getElementById("quote-refresh");
  refreshBtn.onclick = () => {
    let next = currentQuoteIndex;
    while (next === currentQuoteIndex) next = Math.floor(Math.random() * QUOTES.length);
    currentQuoteIndex = next;
    const qEl = document.getElementById("home-quote");
    qEl.classList.add("quote-fade-out");
    refreshBtn.classList.add("spin");
    setTimeout(() => {
      qEl.textContent = QUOTES[currentQuoteIndex];
      qEl.classList.remove("quote-fade-out");
      qEl.classList.add("quote-fade-in");
      setTimeout(() => qEl.classList.remove("quote-fade-in"), 300);
    }, 180);
    setTimeout(() => refreshBtn.classList.remove("spin"), 500);
  };
}

/* ================= SUBJECTS ================= */
function subjectSlipHTML(subject) {
  const p = subjectProgress(subject);
  return `<div class="roll-slip" data-subject="${subject.id}">
    <div class="badge"><span class="pct">${p.pct}%</span><span class="of">${p.done}/${p.total}</span></div>
    <div class="info">
      <div class="sname">${subject.name}</div>
      <div class="stopics">${p.total} chapters · ${p.total - p.done} left</div>
    </div>
    <div class="chev">›</div>
    <div class="track"><b style="width:${p.pct}%"></b></div>
  </div>`;
}
function bindSlipEvents(container) {
  container.querySelectorAll("[data-subject]").forEach((el) =>
    el.addEventListener("click", () => openSubjectDetail(el.dataset.subject))
  );
}
function renderSubjects() {
  const list = document.getElementById("subjects-list");
  list.innerHTML = `<div class="group-pill">${getGroup().name} <button data-nav="settings">change</button></div>` +
    `<div style="margin-top:16px;">${getSubjectsForGroup().map(subjectSlipHTML).join("")}</div>`;
  bindSlipEvents(list);
  list.querySelectorAll("[data-nav]").forEach((el) => el.addEventListener("click", () => showView(el.dataset.nav)));
}

function openSubjectDetail(id) {
  currentSubjectId = id;
  showView("subject-detail");
  renderSubjectDetail();
}
function renderSubjectDetail() {
  const subject = getSubjectById(currentSubjectId);
  if (!subject) return;
  const p = subjectProgress(subject);
  document.getElementById("sd-title").textContent = subject.name;
  document.getElementById("sd-progress-label").textContent = `${p.done} / ${p.total} topics`;
  document.getElementById("sd-progress-pct").textContent = `${p.pct}%`;
  document.getElementById("sd-progress-bar").style.width = `${p.pct}%`;

  const list = document.getElementById("sd-topic-list");
  const progressObj = state.progress[subject.id] || {};
  list.innerHTML = subject.topics
    .map(
      (t, i) => `<div class="topic-row">
        <button class="task-check ${progressObj[i] ? "done" : ""}" data-topic-toggle="${i}">${progressObj[i] ? "✓" : ""}</button>
        <div class="tname ${progressObj[i] ? "done" : ""}">${t}</div>
      </div>`
    )
    .join("");
  list.querySelectorAll("[data-topic-toggle]").forEach((b) =>
    b.addEventListener("click", () => toggleTopic(subject.id, Number(b.dataset.topicToggle)))
  );
}
function toggleTopic(subjectId, idx) {
  if (!state.progress[subjectId]) state.progress[subjectId] = {};
  state.progress[subjectId][idx] = !state.progress[subjectId][idx];
  const justCompleted = state.progress[subjectId][idx];
  if (justCompleted) logActivity();
  addXP(justCompleted ? 10 : -10);
  saveState();
  renderSubjectDetail();
  if (justCompleted) {
    const checkEl = document.querySelector(`[data-topic-toggle="${idx}"]`);
    burstConfetti(checkEl);
  }
  checkBadges();
}

/* ================= PLANNER ================= */
function renderPlannerDayTabs() {
  const wrap = document.getElementById("planner-day-tabs");
  wrap.innerHTML = DAYS.map((d) => `<button class="day-tab ${d === currentPlannerDay ? "active" : ""}" data-day="${d}">${d}</button>`).join("");
  wrap.querySelectorAll("[data-day]").forEach((b) =>
    b.addEventListener("click", () => {
      currentPlannerDay = b.dataset.day;
      renderPlanner();
    })
  );
}
function renderPlanner() {
  renderPlannerDayTabs();
  const sessions = state.planner.sessions.filter((s) => s.day === currentPlannerDay).sort((a, b) => a.time.localeCompare(b.time));
  const wrap = document.getElementById("planner-sessions");
  if (sessions.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><span class="eicon">📚</span><p>Nothing scheduled for ${currentPlannerDay}. Tap + to add a study session.</p></div>`;
  } else {
    wrap.innerHTML = sessions
      .map((s) => {
        const subj = getSubjectById(s.subjectId);
        return `<div class="session-item">
          <div class="session-time">${s.time}</div>
          <div class="sinfo"><div class="ssubj">${subj ? subj.name : "Subject"}</div><div class="sdur">${s.duration} min</div></div>
          <button class="task-check ${s.done ? "done" : ""}" data-session-toggle="${s.id}">${s.done ? "✓" : ""}</button>
          <button class="tdel" data-session-del="${s.id}">✕</button>
        </div>`;
      })
      .join("");
    wrap.querySelectorAll("[data-session-toggle]").forEach((b) => b.addEventListener("click", () => toggleSessionDone(b.dataset.sessionToggle)));
    wrap.querySelectorAll("[data-session-del]").forEach((b) => b.addEventListener("click", () => deleteSession(b.dataset.sessionDel)));
  }

  const todoWrap = document.getElementById("planner-todos");
  if (state.planner.todos.length === 0) {
    todoWrap.innerHTML = `<div class="empty-state"><span class="eicon">✅</span><p>No to-dos yet. Add revision tasks, past papers, or reminders.</p></div>`;
  } else {
    todoWrap.innerHTML = state.planner.todos
      .map(
        (t) => `<div class="task-item ${t.done ? "done" : ""}">
          <button class="task-check ${t.done ? "done" : ""}" data-todo-toggle="${t.id}">${t.done ? "✓" : ""}</button>
          <div class="ttext">${t.text}</div>
          <button class="tdel" data-todo-del="${t.id}">✕</button>
        </div>`
      )
      .join("");
    todoWrap.querySelectorAll("[data-todo-toggle]").forEach((b) => b.addEventListener("click", () => toggleTodoDone(b.dataset.todoToggle)));
    todoWrap.querySelectorAll("[data-todo-del]").forEach((b) => b.addEventListener("click", () => deleteTodo(b.dataset.todoDel)));
  }
}
function toggleSessionDone(id) {
  const s = state.planner.sessions.find((x) => x.id === id);
  if (!s) return;
  s.done = !s.done;
  const justCompleted = s.done;
  if (justCompleted) logActivity();
  addXP(justCompleted ? 8 : -8);
  saveState();
  const checkEl = document.querySelector(`[data-session-toggle="${id}"]`);
  const rect = checkEl ? checkEl.getBoundingClientRect() : null;
  renderPlanner();
  renderHome();
  if (justCompleted) burstConfetti(rect ? { getBoundingClientRect: () => rect } : null);
  checkBadges();
}
function deleteSession(id) {
  state.planner.sessions = state.planner.sessions.filter((s) => s.id !== id);
  saveState();
  renderPlanner();
}
function toggleTodoDone(id) {
  const t = state.planner.todos.find((x) => x.id === id);
  if (!t) return;
  t.done = !t.done;
  if (t.done) logActivity();
  addXP(t.done ? 4 : -4);
  saveState();
  renderPlanner();
}
function deleteTodo(id) {
  state.planner.todos = state.planner.todos.filter((t) => t.id !== id);
  saveState();
  renderPlanner();
}

function openSheet(id) {
  document.getElementById(id).classList.add("active");
}
function closeSheet(id) {
  document.getElementById(id).classList.remove("active");
}

function initPlannerSheetEvents() {
  document.getElementById("planner-fab").addEventListener("click", () => openSheet("fab-sheet-backdrop"));
  document.getElementById("fab-add-session").addEventListener("click", () => {
    closeSheet("fab-sheet-backdrop");
    const sel = document.getElementById("ses-subject");
    sel.innerHTML = getSubjectsForGroup().map((s) => `<option value="${s.id}">${s.name}</option>`).join("");
    document.getElementById("ses-day").value = currentPlannerDay;
    openSheet("session-sheet-backdrop");
  });
  document.getElementById("fab-add-todo").addEventListener("click", () => {
    closeSheet("fab-sheet-backdrop");
    openSheet("todo-sheet-backdrop");
  });
  document.getElementById("ses-save").addEventListener("click", () => {
    const subjectId = document.getElementById("ses-subject").value;
    const day = document.getElementById("ses-day").value;
    const time = document.getElementById("ses-time").value || "17:00";
    const duration = Number(document.getElementById("ses-duration").value) || 45;
    state.planner.sessions.push({ id: "s" + Date.now(), subjectId, day, time, duration, done: false });
    saveState();
    closeSheet("session-sheet-backdrop");
    currentPlannerDay = day;
    renderPlanner();
    toast("Session added");
  });
  document.getElementById("todo-save").addEventListener("click", () => {
    const text = document.getElementById("todo-text").value.trim();
    if (!text) return;
    state.planner.todos.unshift({ id: "t" + Date.now(), text, done: false });
    document.getElementById("todo-text").value = "";
    saveState();
    closeSheet("todo-sheet-backdrop");
    renderPlanner();
    toast("To-do added");
  });
  document.querySelectorAll(".sheet-backdrop").forEach((bd) =>
    bd.addEventListener("click", (e) => {
      if (e.target === bd) bd.classList.remove("active");
    })
  );
}

/* ================= QUIZ ================= */
let quizState = null; // { subjectId, questions, idx, score, answered }

function openQuiz(subjectId) {
  const subject = getSubjectById(subjectId);
  if (!subject) return;
  quizState = { subjectId, questions: null, idx: 0, score: 0, answered: false };
  showView("quiz");
  document.getElementById("quiz-title").textContent = `${subject.name} Quiz`;
  renderQuizIntro();
}
function renderQuizIntro() {
  const subject = getSubjectById(quizState.subjectId);
  const bank = QUIZ_BANK[subject.id] || [];
  const body = document.getElementById("quiz-body");
  body.innerHTML = `
    <div class="card" style="text-align:center;">
      <div style="font-size:38px;">📝</div>
      <h3 style="margin-top:8px;">${subject.name}</h3>
      <p style="font-size:13px; color:var(--ink-muted); margin-top:6px;">${bank.length} practice questions ready. Earn 5 XP per correct answer.</p>
      <button class="btn btn-primary btn-block" id="quiz-start-local" style="margin-top:16px;" ${bank.length ? "" : "disabled"}>Start Practice Quiz</button>
      ${effectiveApiKey() ? `<button class="btn btn-ghost btn-block" id="quiz-start-ai" style="margin-top:10px;">🤖 Generate a fresh AI quiz</button>` : `<p class="api-warning" style="margin-top:14px;">Add a Groq API key in Settings to generate fresh AI quizzes.</p>`}
    </div>`;
  const startLocal = document.getElementById("quiz-start-local");
  if (startLocal) startLocal.addEventListener("click", () => {
    quizState.questions = bank;
    quizState.idx = 0;
    quizState.score = 0;
    renderQuizQuestion();
  });
  const startAI = document.getElementById("quiz-start-ai");
  if (startAI) startAI.addEventListener("click", () => generateAIQuiz(subject));
}

async function generateAIQuiz(subject) {
  const body = document.getElementById("quiz-body");
  body.innerHTML = `<div class="card" style="text-align:center;"><div class="typing-dots" style="margin:20px auto;"><span></span><span></span><span></span></div><p style="font-size:13px;color:var(--ink-muted);">Building a fresh quiz on ${subject.name}…</p></div>`;
  const prompt = `Create exactly 5 multiple-choice questions for a Pakistani Matric (grade 9-10) student studying ${subject.name}, covering topics from: ${subject.topics.join(", ")}. Respond with ONLY a raw JSON array, no markdown, no code fences, no commentary. Each item must have this exact shape: {"q": "question text", "options": ["a","b","c","d"], "correct": 0, "explain": "short one-sentence explanation"}. "correct" is the zero-based index of the right option.`;
  try {
    const raw = await askGroq(effectiveApiKey(), [{ role: "user", content: prompt }], "You output only valid JSON arrays as instructed, nothing else.");
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("bad-format");
    quizState.questions = parsed;
    quizState.idx = 0;
    quizState.score = 0;
    renderQuizQuestion();
  } catch (e) {
    toast("Couldn't generate an AI quiz — showing the practice bank instead");
    quizState.questions = QUIZ_BANK[subject.id] || [];
    quizState.idx = 0;
    quizState.score = 0;
    if (quizState.questions.length) renderQuizQuestion();
    else renderQuizIntro();
  }
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.idx];
  quizState.answered = false;
  const body = document.getElementById("quiz-body");
  body.innerHTML = `
    <div class="quiz-progress">Question ${quizState.idx + 1} of ${quizState.questions.length}</div>
    <div class="card quiz-q-card">
      <div class="quiz-q">${escapeHTML(q.q)}</div>
      <div class="quiz-options" id="quiz-options">
        ${q.options.map((opt, i) => `<button class="quiz-opt" data-opt="${i}">${escapeHTML(opt)}</button>`).join("")}
      </div>
      <div class="quiz-explain" id="quiz-explain" style="display:none;"></div>
      <button class="btn btn-primary btn-block" id="quiz-next" style="display:none;margin-top:14px;">Next</button>
    </div>`;
  document.querySelectorAll(".quiz-opt").forEach((btn) => btn.addEventListener("click", () => answerQuiz(Number(btn.dataset.opt))));
  document.getElementById("quiz-next").addEventListener("click", () => {
    quizState.idx++;
    if (quizState.idx < quizState.questions.length) renderQuizQuestion();
    else finishQuiz();
  });
}
function answerQuiz(selectedIdx) {
  if (quizState.answered) return;
  quizState.answered = true;
  const q = quizState.questions[quizState.idx];
  const correct = Number(q.correct);
  const opts = document.querySelectorAll(".quiz-opt");
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    else if (i === selectedIdx) btn.classList.add("wrong");
  });
  if (selectedIdx === correct) {
    quizState.score++;
    addXP(5);
    burstConfetti(opts[selectedIdx]);
  }
  const explainEl = document.getElementById("quiz-explain");
  explainEl.style.display = "block";
  explainEl.textContent = q.explain || "";
  document.getElementById("quiz-next").style.display = "block";
  logActivity();
  checkBadges();
}
function finishQuiz() {
  const subject = getSubjectById(quizState.subjectId);
  const pct = Math.round((quizState.score / quizState.questions.length) * 100);
  const body = document.getElementById("quiz-body");
  body.innerHTML = `
    <div class="card" style="text-align:center;">
      <div style="font-size:42px;">${pct >= 80 ? "🏆" : pct >= 50 ? "🎯" : "📘"}</div>
      <h3 style="margin-top:8px;">${quizState.score} / ${quizState.questions.length} correct</h3>
      <p style="font-size:13px; color:var(--ink-muted); margin-top:6px;">You earned ${quizState.score * 5} XP on ${subject.name}.</p>
      <button class="btn btn-primary btn-block" id="quiz-retry" style="margin-top:16px;">Try again</button>
      <button class="btn btn-ghost btn-block" id="quiz-done" style="margin-top:10px;">Back to subject</button>
    </div>`;
  document.getElementById("quiz-retry").addEventListener("click", () => renderQuizIntro());
  document.getElementById("quiz-done").addEventListener("click", () => openSubjectDetail(quizState.subjectId));
  if (pct === 100) burstConfetti(body);
}
function initQuizEvents() {
  document.getElementById("sd-quiz-btn").addEventListener("click", () => openQuiz(currentSubjectId));
  document.getElementById("quiz-back").addEventListener("click", () => openSubjectDetail(quizState ? quizState.subjectId : currentSubjectId));
}

/* ================= AI COACH ================= */
const QUICK_PROMPTS = [
  { label: "📅 Plan my week", prompt: "Make me a simple day-by-day study plan for this week based on my matric subjects." },
  { label: "🧠 Explain a topic", prompt: "Can you explain a tricky topic from my syllabus in simple words with an example?" },
  { label: "📝 Quiz me", prompt: "Quiz me with one question at a time on a topic from my matric syllabus." },
  { label: "⏰ Beat procrastination", prompt: "I keep procrastinating on studying. Give me 3 practical tips." },
];

function renderAI() {
  document.getElementById("ai-key-warning").style.display = effectiveApiKey() ? "none" : "block";
  const qp = document.getElementById("ai-quick-prompts");
  qp.innerHTML = QUICK_PROMPTS.map((q, i) => `<button class="qp-btn" data-qp="${i}">${q.label}</button>`).join("");
  qp.querySelectorAll("[data-qp]").forEach((b) => b.addEventListener("click", () => sendAIMessage(QUICK_PROMPTS[Number(b.dataset.qp)].prompt)));
  renderChat();
}
function renderChat() {
  const wrap = document.getElementById("ai-chat");
  if (state.chat.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><span class="eicon">🤖</span><p>Ask about a topic, request a study plan, or get quizzed — your AI coach knows the matric syllabus.</p></div>`;
    return;
  }
  wrap.innerHTML = state.chat
    .map((m) => `<div class="msg ${m.role === "user" ? "user" : "ai"}">${escapeHTML(m.content)}</div>`)
    .join("");
  wrap.scrollTop = wrap.scrollHeight;
}
function escapeHTML(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}
async function sendAIMessage(customText) {
  const input = document.getElementById("ai-input");
  const text = (customText || input.value).trim();
  if (!text) return;
  const apiKey = effectiveApiKey();
  if (!apiKey) {
    toast("Add your Groq API key in Settings first");
    showView("settings");
    return;
  }
  input.value = "";
  state.chat.push({ role: "user", content: text });
  state.stats.aiUsed = true;
  saveState();
  renderChat();

  const wrap = document.getElementById("ai-chat");
  const typingEl = document.createElement("div");
  typingEl.className = "msg ai typing-dots";
  typingEl.innerHTML = "<span></span><span></span><span></span>";
  wrap.appendChild(typingEl);
  wrap.scrollTop = wrap.scrollHeight;

  try {
    const contextNote = `Student's group: ${getGroup().name}. Subjects: ${getSubjectsForGroup().map((s) => s.name).join(", ")}.`;
    const history = [{ role: "user", content: contextNote }, { role: "assistant", content: "Got it, I'll tailor my help to that." }, ...state.chat.slice(-10)];
    const reply = await askGroq(apiKey, history, AI_SYSTEM_PROMPT);
    state.chat.push({ role: "assistant", content: reply });
    saveState();
    logActivity();
    addXP(3);
    checkBadges();
  } catch (e) {
    let msg = "Something went wrong talking to the AI. Please try again.";
    if (e.message === "invalid-key") msg = "That Groq API key looks invalid. Please check it in Settings.";
    state.chat.push({ role: "assistant", content: msg });
  }
  typingEl.remove();
  renderChat();
}
function initAIEvents() {
  document.getElementById("ai-send").addEventListener("click", () => sendAIMessage());
  document.getElementById("ai-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendAIMessage();
  });
}

/* ================= PROGRESS ================= */
function renderProgress() {
  const stats = computeGlobalStats();
  const info = getLevelInfo(state.gamification.xp);
  document.getElementById("pg-level-title").textContent = info.title;
  document.getElementById("pg-level-num").textContent = info.levelNum;
  document.getElementById("pg-level-sub").textContent = `${info.xp} XP`;
  document.getElementById("pg-xp-bar").style.width = `${info.pct}%`;
  document.getElementById("pg-level-next").textContent = info.next ? `${info.xpToNext} XP to "${info.next.title}"` : "Max level reached 🎉";

  document.getElementById("pg-streak").textContent = stats.streak;
  document.getElementById("pg-sessions").textContent = stats.sessionsDone;
  document.getElementById("pg-badges").textContent = state.earnedBadges.length;

  const chart = document.getElementById("pg-bar-chart");
  chart.innerHTML = getSubjectsForGroup()
    .map((s) => {
      const p = subjectProgress(s);
      return `<div class="bar-row">
        <div class="bhead"><span>${s.name}</span><span>${p.done}/${p.total}</span></div>
        <div class="bar-track"><b style="width:${p.pct}%"></b></div>
      </div>`;
    })
    .join("");

  const grid = document.getElementById("pg-badge-grid");
  grid.innerHTML = BADGES.map((b) => {
    const earned = state.earnedBadges.includes(b.id);
    return `<div class="badge-tile ${earned ? "earned" : ""}" title="${b.desc}">
      <div class="bicon">${earned ? "🏅" : "🔒"}</div>
      <div class="blabel">${b.label}</div>
    </div>`;
  }).join("");

  renderLeaderboard();
}

function renderLeaderboard() {
  const wrap = document.getElementById("pg-leaderboard");
  const rows = [
    { id: "__you__", name: state.profile.name || "You", xp: state.gamification.xp, isYou: true },
    ...state.gamification.friends,
  ].sort((a, b) => b.xp - a.xp);

  wrap.innerHTML = rows
    .map((r, i) => {
      const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`;
      return `<div class="lb-row ${r.isYou ? "lb-you" : ""}">
        <div class="lb-rank">${medal}</div>
        <div class="lb-name">${escapeHTML(r.name)}${r.isYou ? " (You)" : ""}</div>
        <div class="lb-xp">${r.xp} XP</div>
        ${r.isYou ? "" : `<button class="lb-edit" data-rival-edit="${r.id}">✎</button><button class="tdel" data-rival-del="${r.id}">✕</button>`}
      </div>`;
    })
    .join("");

  wrap.querySelectorAll("[data-rival-edit]").forEach((b) => b.addEventListener("click", () => openRivalSheet(b.dataset.rivalEdit)));
  wrap.querySelectorAll("[data-rival-del]").forEach((b) =>
    b.addEventListener("click", () => {
      state.gamification.friends = state.gamification.friends.filter((f) => f.id !== b.dataset.rivalDel);
      saveState();
      renderLeaderboard();
    })
  );
}

let editingRivalId = null;
function openRivalSheet(id) {
  editingRivalId = id || null;
  const friend = id ? state.gamification.friends.find((f) => f.id === id) : null;
  document.getElementById("rival-sheet-title").textContent = friend ? "Edit rival" : "Add rival";
  document.getElementById("rival-name").value = friend ? friend.name : "";
  document.getElementById("rival-xp").value = friend ? friend.xp : "";
  openSheet("rival-sheet-backdrop");
}
function initLeaderboardEvents() {
  document.getElementById("pg-add-rival").addEventListener("click", () => openRivalSheet(null));
  document.getElementById("rival-save").addEventListener("click", () => {
    const name = document.getElementById("rival-name").value.trim();
    const xp = Math.max(0, Number(document.getElementById("rival-xp").value) || 0);
    if (!name) return;
    if (editingRivalId) {
      const f = state.gamification.friends.find((x) => x.id === editingRivalId);
      if (f) {
        f.name = name;
        f.xp = xp;
      }
    } else {
      state.gamification.friends.push({ id: "f" + Date.now(), name, xp });
    }
    saveState();
    closeSheet("rival-sheet-backdrop");
    renderLeaderboard();
    toast("Study Circle updated");
  });
}
function checkBadges() {
  const stats = computeGlobalStats();
  let newBadge = null;
  BADGES.forEach((b) => {
    if (!state.earnedBadges.includes(b.id) && b.check(stats)) {
      state.earnedBadges.push(b.id);
      newBadge = b;
    }
  });
  saveState();
  if (newBadge) {
    addXP(20);
    setTimeout(() => celebrateBadge(newBadge), 250);
  }
}

/* ================= SETTINGS ================= */
function renderSettings() {
  const themeGrid = document.getElementById("settings-theme-grid");
  themeGrid.innerHTML = THEMES.map(
    (t) => `<button class="theme-choice ${state.theme === t.id ? "selected" : ""}" data-theme-id="${t.id}">
      <div class="swatch-row">${t.swatch.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("")}</div>
      <div class="tname">${t.name}</div>
    </button>`
  ).join("");
  themeGrid.querySelectorAll("[data-theme-id]").forEach((btn) =>
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.themeId);
      renderSettings();
      toast("Theme updated");
    })
  );

  document.getElementById("set-name").value = state.profile.name;
  document.getElementById("set-examdate").value = state.profile.examDate || "";
  const groupSel = document.getElementById("set-group");
  groupSel.innerHTML = GROUPS.map((g) => `<option value="${g.id}" ${g.id === state.profile.groupId ? "selected" : ""}>${g.name}</option>`).join("");
  document.getElementById("set-apikey").value = state.apiKey || "";
  const note = document.getElementById("set-apikey-note");
  if (note) {
    note.textContent = DEV_API_KEY
      ? "A default key is already active for this app — you only need to add your own if you want to use a different Groq account."
      : "Free at console.groq.com/keys. Stored only in this browser — never sent anywhere except Groq's API.";
  }
}
function initSettingsEvents() {
  document.getElementById("set-save-profile").addEventListener("click", () => {
    state.profile.name = document.getElementById("set-name").value.trim() || "Student";
    state.profile.examDate = document.getElementById("set-examdate").value;
    state.profile.groupId = document.getElementById("set-group").value;
    saveState();
    toast("Profile saved");
    renderHome();
  });
  document.getElementById("set-save-key").addEventListener("click", () => {
    state.apiKey = document.getElementById("set-apikey").value.trim();
    saveState();
    toast("API key saved");
  });
  document.getElementById("set-export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "rehearsal-backup.json";
    a.click();
  });
  document.getElementById("set-reset").addEventListener("click", () => {
    if (confirm("This will erase all your data on this device. Continue?")) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}

/* ================= ONBOARDING TOUR ================= */
let tourIdx = 0;
function renderTourSlide() {
  const slidesWrap = document.getElementById("tour-slides");
  const s = TOUR_SLIDES[tourIdx];
  slidesWrap.innerHTML = `<div class="tour-slide">
    <div class="tour-icon">${s.icon}</div>
    <h3>${s.title}</h3>
    <p>${s.body}</p>
  </div>`;
  document.getElementById("tour-dots").innerHTML = TOUR_SLIDES.map((_, i) => `<span class="tour-dot ${i === tourIdx ? "active" : ""}"></span>`).join("");
  document.getElementById("tour-next").textContent = tourIdx === TOUR_SLIDES.length - 1 ? "Let's go" : "Next";
}
function startTour() {
  tourIdx = 0;
  renderTourSlide();
  openSheet("tour-backdrop");
}
function closeTour() {
  closeSheet("tour-backdrop");
  state.tourSeen = true;
  saveState();
}
function initTourEvents() {
  document.getElementById("tour-next").addEventListener("click", () => {
    if (tourIdx < TOUR_SLIDES.length - 1) {
      tourIdx++;
      renderTourSlide();
    } else {
      closeTour();
    }
  });
  document.getElementById("tour-skip").addEventListener("click", closeTour);
  document.getElementById("set-replay-tour").addEventListener("click", startTour);
}

/* ================= BOOT ================= */
function boot() {
  document.documentElement.setAttribute("data-theme", state.theme);
  initNavEvents();
  initPlannerSheetEvents();
  initAIEvents();
  initSettingsEvents();
  initLeaderboardEvents();
  initQuizEvents();
  initTourEvents();
  showView("home");
  checkBadges();
  if (!state.tourSeen) setTimeout(startTour, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  state = loadState();
  document.documentElement.setAttribute("data-theme", state.theme);
  if (state.onboarded) {
    document.getElementById("onboarding-screen").style.display = "none";
    document.getElementById("app-shell").style.display = "flex";
    boot();
  } else {
    renderOnboarding();
    initOnboardingEvents();
    goObStep(1);
  }
});