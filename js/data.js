/* ============================================================
   Rehearsal — data.js
   Static reference data: matric groups/subjects, quotes, badges
   ============================================================ */

const GROUPS = [
  {
    id: "pre-engineering",
    name: "Science – Pre-Engineering",
    tagline: "Physics, Chemistry & Math — built for future engineers",
    subjects: [
      { id: "physics", name: "Physics", topics: ["Measurements", "Vectors & Equilibrium", "Motion & Force", "Turning Effect of Forces", "Work, Energy & Power", "Thermal Properties of Matter", "Waves", "Electrostatics", "Current Electricity", "Electromagnetism"] },
      { id: "chemistry", name: "Chemistry", topics: ["Fundamentals of Chemistry", "Structure of Atoms", "Periodic Table & Periodicity", "Structure of Molecules", "Physical States of Matter", "Solutions", "Electrochemistry", "Chemical Reactivity"] },
      { id: "math", name: "Mathematics", topics: ["Matrices & Determinants", "Real & Complex Numbers", "Logarithms", "Algebraic Expressions", "Factorization", "Algebraic Formulas", "Linear Equations", "Basic Statistics", "Introduction to Trigonometry", "Practical Geometry"] },
      { id: "english", name: "English", topics: ["Prose Unit 1–3", "Poetry", "Grammar & Comprehension", "Letter & Essay Writing", "Translation (Urdu–English)"] },
      { id: "urdu", name: "اردو", topics: ["نثر", "نظم", "قواعد", "مضمون نویسی", "خط و درخواست نویسی"] },
      { id: "pak-studies", name: "Pakistan Studies", topics: ["Ideology of Pakistan", "Freedom Movement", "Land & Environment", "Government & Politics", "Economic Development"] },
      { id: "islamiat", name: "Islamiat", topics: ["Quran & Hadith", "Beliefs (Aqaid)", "Worship (Ibadat)", "Islamic History", "Ethics & Society"] },
    ],
  },
  {
    id: "pre-medical",
    name: "Science – Pre-Medical",
    tagline: "Biology, Chemistry & Physics — for future doctors",
    subjects: [
      { id: "biology", name: "Biology", topics: ["Introduction to Biology", "Biodiversity", "Cell Structure & Function", "Cell Cycle", "Enzymes", "Bioenergetics", "Nutrition", "Transport in Organisms", "Gaseous Exchange"] },
      { id: "chemistry", name: "Chemistry", topics: ["Fundamentals of Chemistry", "Structure of Atoms", "Periodic Table & Periodicity", "Structure of Molecules", "Physical States of Matter", "Solutions", "Electrochemistry", "Chemical Reactivity"] },
      { id: "physics", name: "Physics", topics: ["Measurements", "Vectors & Equilibrium", "Motion & Force", "Work, Energy & Power", "Thermal Properties of Matter", "Waves", "Electrostatics", "Current Electricity"] },
      { id: "english", name: "English", topics: ["Prose Unit 1–3", "Poetry", "Grammar & Comprehension", "Letter & Essay Writing", "Translation (Urdu–English)"] },
      { id: "urdu", name: "اردو", topics: ["نثر", "نظم", "قواعد", "مضمون نویسی", "خط و درخواست نویسی"] },
      { id: "pak-studies", name: "Pakistan Studies", topics: ["Ideology of Pakistan", "Freedom Movement", "Land & Environment", "Government & Politics", "Economic Development"] },
      { id: "islamiat", name: "Islamiat", topics: ["Quran & Hadith", "Beliefs (Aqaid)", "Worship (Ibadat)", "Islamic History", "Ethics & Society"] },
    ],
  },
  {
    id: "computer-science",
    name: "Computer Science",
    tagline: "Logic, code & systems — for future developers",
    subjects: [
      { id: "comp-sci", name: "Computer Science", topics: ["Basics of Information Technology", "Data Communication", "Computer Networks", "Number Systems", "Boolean Algebra & Logic Gates", "Programming Fundamentals (C++)", "Control Structures", "Arrays & Functions"] },
      { id: "physics", name: "Physics", topics: ["Measurements", "Vectors & Equilibrium", "Motion & Force", "Work, Energy & Power", "Thermal Properties of Matter", "Waves", "Electrostatics", "Current Electricity"] },
      { id: "math", name: "Mathematics", topics: ["Matrices & Determinants", "Real & Complex Numbers", "Logarithms", "Algebraic Expressions", "Factorization", "Linear Equations", "Basic Statistics", "Introduction to Trigonometry"] },
      { id: "english", name: "English", topics: ["Prose Unit 1–3", "Poetry", "Grammar & Comprehension", "Letter & Essay Writing", "Translation (Urdu–English)"] },
      { id: "urdu", name: "اردو", topics: ["نثر", "نظم", "قواعد", "مضمون نویسی", "خط و درخواست نویسی"] },
      { id: "pak-studies", name: "Pakistan Studies", topics: ["Ideology of Pakistan", "Freedom Movement", "Land & Environment", "Government & Politics", "Economic Development"] },
      { id: "islamiat", name: "Islamiat", topics: ["Quran & Hadith", "Beliefs (Aqaid)", "Worship (Ibadat)", "Islamic History", "Ethics & Society"] },
    ],
  },
  {
    id: "humanities",
    name: "Humanities / Arts",
    tagline: "Economics, civics & society — for future thinkers",
    subjects: [
      { id: "economics", name: "Economics", topics: ["Basic Economic Concepts", "Consumer & Producer", "Money & Banking", "Population", "Pakistan's Economy"] },
      { id: "civics", name: "Civics", topics: ["Citizenship", "Constitution of Pakistan", "Fundamental Rights", "Local Government", "International Organizations"] },
      { id: "general-math", name: "General Math", topics: ["Sets & Functions", "Percentage & Ratio", "Financial Arithmetic", "Consumer Math", "Basic Geometry"] },
      { id: "english", name: "English", topics: ["Prose Unit 1–3", "Poetry", "Grammar & Comprehension", "Letter & Essay Writing", "Translation (Urdu–English)"] },
      { id: "urdu", name: "اردو", topics: ["نثر", "نظم", "قواعد", "مضمون نویسی", "خط و درخواست نویسی"] },
      { id: "pak-studies", name: "Pakistan Studies", topics: ["Ideology of Pakistan", "Freedom Movement", "Land & Environment", "Government & Politics", "Economic Development"] },
      { id: "islamiat", name: "Islamiat", topics: ["Quran & Hadith", "Beliefs (Aqaid)", "Worship (Ibadat)", "Islamic History", "Ethics & Society"] },
    ],
  },
  {
    id: "general-home-ec",
    name: "General Science / Home Economics",
    tagline: "Everyday science & home management",
    subjects: [
      { id: "home-ec", name: "Home Economics", topics: ["Food & Nutrition", "Family Resource Management", "Child Development", "Textiles & Clothing", "Housing & Home Management"] },
      { id: "general-science", name: "General Science", topics: ["General Physics Concepts", "General Chemistry Concepts", "General Biology Concepts", "Health & Hygiene"] },
      { id: "english", name: "English", topics: ["Prose Unit 1–3", "Poetry", "Grammar & Comprehension", "Letter & Essay Writing", "Translation (Urdu–English)"] },
      { id: "urdu", name: "اردو", topics: ["نثر", "نظم", "قواعد", "مضمون نویسی", "خط و درخواست نویسی"] },
      { id: "pak-studies", name: "Pakistan Studies", topics: ["Ideology of Pakistan", "Freedom Movement", "Land & Environment", "Government & Politics", "Economic Development"] },
      { id: "islamiat", name: "Islamiat", topics: ["Quran & Hadith", "Beliefs (Aqaid)", "Worship (Ibadat)", "Islamic History", "Ethics & Society"] },
    ],
  },
];

const DEV_API_KEY = "grok_api_key"; //Paste your own groq api key here

const QUOTES = [
  "Consistency beats intensity. One hour today, every day, wins matric.",
  "Roll number slips don't ask how you felt — they ask what you revised.",
  "You don't need a perfect plan. You need today's plan.",
  "Every past paper you solve is a rehearsal for the real one.",
  "Tough syllabus, small chapters. One topic at a time.",
  "Your future college doesn't see your bad days — it sees your grade card.",
  "Revision is where marks are actually won.",
  "Board exams reward habits, not miracles.",
  "Close the book. Recall it. That's how it sticks.",
  "Discipline today, choices tomorrow.",
  "The syllabus doesn't shrink by worrying about it — only by opening it.",
  "You're not behind. You're exactly where today's plan starts.",
  "Small chapters finished beat big chapters postponed.",
  "The version of you sitting the exam is built in these next few weeks.",
  "Nobody remembers the day you started late. They remember the grade card.",
  "One solved past paper is worth three re-reads of the textbook.",
  "Tired is not the same as done. Rest, then finish the topic.",
  "Your competition is asleep right now. This hour is yours.",
  "Marks come from recall, not from re-reading. Test yourself.",
  "A 25-minute focused session beats a distracted 2-hour one.",
  "You don't have to feel ready. You just have to start the first line.",
  "Every checkbox you tick today is one less thing to fear in the exam hall.",
  "Progress is quiet. Keep going even when no one's clapping.",
  "The night before the exam should be for sleep, not for starting a chapter.",
  "Streaks aren't about perfection — they're about showing up again tomorrow.",
  "Confusion today is just clarity that hasn't arrived yet. Ask, don't guess.",
  "Your roll number slip doesn't care how you felt about studying — only that you did.",
  "Board exams are a memory game with rules. Learn the rules, then play.",
  "The best time to review today's lecture is today, not exam week.",
  "You're allowed to be proud of a 20-minute session. It still counts.",
];

const THEMES = [
  { id: "almanac", name: "Ink & Almanac", swatch: ["#F3F1E7", "#1F6F5C", "#E8A33D"] },
  { id: "lightsout", name: "Lights Out", swatch: ["#12151B", "#3DDC97", "#7C5CFF"] },
  { id: "bubblegum", name: "Bubble Gum", swatch: ["#FFF3F8", "#FF6FA5", "#8C7CFF"] },
  { id: "deepocean", name: "Deep Ocean", swatch: ["#EAF4F6", "#0E7C86", "#F2A93B"] },
  { id: "sunsetsprint", name: "Sunset Sprint", swatch: ["#FFF4EC", "#FF5D5D", "#FFB24C"] },
];

const BADGES = [
  { id: "first-topic", label: "First Step", desc: "Completed your first topic", check: (s) => s.totalCompleted >= 1 },
  { id: "streak-3", label: "3-Day Streak", desc: "Studied 3 days in a row", check: (s) => s.streak >= 3 },
  { id: "streak-7", label: "7-Day Streak", desc: "Studied a full week straight", check: (s) => s.streak >= 7 },
  { id: "ten-topics", label: "Momentum", desc: "Completed 10 topics", check: (s) => s.totalCompleted >= 10 },
  { id: "subject-master", label: "Subject Master", desc: "Finished every topic in a subject", check: (s) => s.subjectMastered },
  { id: "planner-pro", label: "Planner Pro", desc: "Logged 10 study sessions", check: (s) => s.sessionsDone >= 10 },
  { id: "ai-curious", label: "AI Curious", desc: "Asked the AI Coach a question", check: (s) => s.aiUsed },
];

const AI_SYSTEM_PROMPT = `You are Rehearsal Coach, a friendly, encouraging study assistant built for Matric (grade 9-10) students in Pakistan preparing for board exams. You know the Pakistani matric curriculum (Science Pre-Engineering, Pre-Medical, Computer Science, Humanities, General Science/Home Economics groups) and boards like BISE Lahore, Karachi, Federal Board, etc. Keep answers short, clear, exam-focused, and use simple language a 15-16 year old can follow. When asked to make a study plan, format it as a short day-by-day list. When asked to explain a topic, use short paragraphs or bullet points with an example. When asked to quiz the student, ask one question at a time and wait for their answer. Be warm and motivating, never condescending.`;

/* ---------------- Gamification: XP levels ---------------- */
const LEVELS = [
  { title: "Getting Started", min: 0 },
  { title: "Warming Up", min: 40 },
  { title: "Building Habits", min: 100 },
  { title: "Focused", min: 200 },
  { title: "Disciplined", min: 350 },
  { title: "On Track", min: 550 },
  { title: "Board Ready", min: 800 },
  { title: "Topper", min: 1150 },
  { title: "Legend", min: 1600 },
];

/* ---------------- Quiz bank (per subject id) ---------------- */
const QUIZ_BANK = {
  physics: [
    { q: "What is the SI unit of force?", options: ["Newton", "Joule", "Watt", "Pascal"], correct: 0, explain: "Force is measured in Newtons (N), named after Isaac Newton." },
    { q: "Which quantity is a vector?", options: ["Mass", "Speed", "Velocity", "Time"], correct: 2, explain: "Velocity has both magnitude and direction, so it's a vector; speed is scalar." },
    { q: "Work done is zero when:", options: ["Force and displacement are in the same direction", "Force is applied but no displacement occurs", "Displacement is large", "Force is doubled"], correct: 1, explain: "If there's no displacement, no work is done regardless of force applied." },
  ],
  chemistry: [
    { q: "The smallest particle of an element that retains its properties is called:", options: ["Molecule", "Atom", "Ion", "Compound"], correct: 1, explain: "An atom is the smallest unit of an element that keeps its chemical identity." },
    { q: "Which of these is a noble gas?", options: ["Oxygen", "Nitrogen", "Helium", "Hydrogen"], correct: 2, explain: "Helium is a noble gas — it rarely reacts with other elements." },
    { q: "The process of a solid changing directly to gas is called:", options: ["Melting", "Sublimation", "Evaporation", "Condensation"], correct: 1, explain: "Sublimation skips the liquid state entirely, e.g. dry ice." },
  ],
  math: [
    { q: "What is the value of log₁₀(100)?", options: ["1", "2", "10", "100"], correct: 1, explain: "log₁₀(100) = 2, since 10² = 100." },
    { q: "A matrix with equal number of rows and columns is called:", options: ["Row matrix", "Column matrix", "Square matrix", "Null matrix"], correct: 2, explain: "When rows = columns, it's called a square matrix." },
    { q: "Factorization of x² − 9 is:", options: ["(x−3)(x+3)", "(x−9)(x+1)", "(x−3)²", "x(x−9)"], correct: 0, explain: "This is the difference of squares: a² − b² = (a−b)(a+b)." },
  ],
  english: [
    { q: "Choose the correct synonym for 'Diligent':", options: ["Lazy", "Hardworking", "Careless", "Slow"], correct: 1, explain: "Diligent means showing care and effort — hardworking is the closest synonym." },
    { q: "Identify the tense: 'She has completed her homework.'", options: ["Simple past", "Present perfect", "Future", "Present continuous"], correct: 1, explain: "\"has completed\" is the present perfect tense." },
    { q: "A word that describes a noun is called:", options: ["Verb", "Adverb", "Adjective", "Preposition"], correct: 2, explain: "Adjectives describe or modify nouns." },
  ],
  urdu: [
    { q: "In Urdu grammar, 'اسم' refers to which part of speech?", options: ["Verb", "Noun", "Adjective", "Pronoun"], correct: 1, explain: "'اسم' (Ism) is the Urdu grammatical term for a noun." },
    { q: "'نظم' in Urdu literature typically refers to:", options: ["Prose", "Poetry", "Letter", "Essay"], correct: 1, explain: "'نظم' (Nazm) refers to a form of poetry." },
    { q: "'مضمون نویسی' means:", options: ["Letter writing", "Essay writing", "Translation", "Poetry recitation"], correct: 1, explain: "'مضمون نویسی' translates to essay writing." },
  ],
  "pak-studies": [
    { q: "Pakistan came into being in:", options: ["1945", "1946", "1947", "1948"], correct: 2, explain: "Pakistan gained independence on 14 August 1947." },
    { q: "The Lahore Resolution was passed in:", options: ["1930", "1940", "1947", "1935"], correct: 1, explain: "The Lahore Resolution was passed on 23 March 1940." },
    { q: "Which river is the longest in Pakistan?", options: ["Ravi", "Chenab", "Indus", "Jhelum"], correct: 2, explain: "The Indus is the longest river in Pakistan." },
  ],
  islamiat: [
    { q: "How many Surahs are in the Quran?", options: ["100", "110", "114", "120"], correct: 2, explain: "The Quran contains 114 Surahs." },
    { q: "The first revelation was received in the cave of:", options: ["Thawr", "Hira", "Uhud", "Badr"], correct: 1, explain: "The first revelation came to the Prophet ﷺ in the Cave of Hira." },
    { q: "Zakat is obligatory on wealth that:", options: ["Is below Nisab", "Reaches Nisab and one lunar year passes", "Is inherited only", "Is borrowed"], correct: 1, explain: "Zakat becomes due once wealth reaches the Nisab threshold and a lunar year passes." },
  ],
  biology: [
    { q: "The basic unit of life is:", options: ["Tissue", "Organ", "Cell", "Organism"], correct: 2, explain: "The cell is the basic structural and functional unit of all living things." },
    { q: "Photosynthesis mainly occurs in:", options: ["Roots", "Chloroplasts", "Mitochondria", "Nucleus"], correct: 1, explain: "Chloroplasts contain chlorophyll, where photosynthesis takes place." },
    { q: "Which organ pumps blood in the human body?", options: ["Lungs", "Liver", "Heart", "Kidney"], correct: 2, explain: "The heart pumps blood through the circulatory system." },
  ],
  "comp-sci": [
    { q: "Binary number system uses how many digits?", options: ["2", "8", "10", "16"], correct: 0, explain: "Binary uses only two digits: 0 and 1." },
    { q: "Which of these is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], correct: 2, explain: "A keyboard sends data into the computer, making it an input device." },
    { q: "A logic gate that outputs true only if both inputs are true is:", options: ["OR", "AND", "NOT", "XOR"], correct: 1, explain: "An AND gate outputs true only when all its inputs are true." },
  ],
  economics: [
    { q: "A rise in general price level is called:", options: ["Deflation", "Inflation", "Recession", "Depression"], correct: 1, explain: "Inflation is a sustained increase in the general price level." },
    { q: "Which of these is a factor of production?", options: ["Advertising", "Labour", "Profit", "Price"], correct: 1, explain: "Labour is one of the four classic factors of production." },
    { q: "The study of individual economic units is called:", options: ["Macroeconomics", "Microeconomics", "Public Finance", "Statistics"], correct: 1, explain: "Microeconomics studies individual consumers, firms, and markets." },
  ],
  civics: [
    { q: "Pakistan's constitution was adopted in:", options: ["1956", "1962", "1973", "1985"], correct: 2, explain: "The current constitution of Pakistan was adopted in 1973." },
    { q: "The head of government in Pakistan is the:", options: ["President", "Prime Minister", "Chief Justice", "Governor"], correct: 1, explain: "The Prime Minister heads the government; the President is the head of state." },
    { q: "Fundamental rights are guaranteed in which part of the constitution?", options: ["Preamble", "Part II", "Schedule I", "Annexure"], correct: 1, explain: "Fundamental Rights are covered in Part II of the 1973 Constitution." },
  ],
  "general-math": [
    { q: "15% of 200 is:", options: ["20", "25", "30", "35"], correct: 2, explain: "15% of 200 = 0.15 × 200 = 30." },
    { q: "A ratio compares:", options: ["Two unlike quantities only", "Two quantities of the same kind", "Only percentages", "Only fractions"], correct: 1, explain: "A ratio compares two quantities of the same kind or unit." },
    { q: "Simple interest on Rs.1000 at 10% for 2 years is:", options: ["Rs.100", "Rs.150", "Rs.200", "Rs.250"], correct: 2, explain: "SI = P×R×T/100 = 1000×10×2/100 = Rs.200." },
  ],
  "home-ec": [
    { q: "Which nutrient is the body's main source of energy?", options: ["Protein", "Carbohydrate", "Vitamin", "Mineral"], correct: 1, explain: "Carbohydrates are the body's primary and most efficient energy source." },
    { q: "A balanced diet should include:", options: ["Only proteins", "Only carbohydrates", "All food groups in right amounts", "Only fruits"], correct: 2, explain: "A balanced diet includes all food groups in appropriate proportions." },
    { q: "Which fabric is best known for absorbing moisture?", options: ["Polyester", "Cotton", "Nylon", "Silk"], correct: 1, explain: "Cotton is a natural fibre well known for high moisture absorption." },
  ],
  "general-science": [
    { q: "Water boils at what temperature at sea level (Celsius)?", options: ["50", "90", "100", "120"], correct: 2, explain: "Water boils at 100°C at standard sea-level pressure." },
    { q: "Which gas do plants absorb from the air for photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 2, explain: "Plants absorb carbon dioxide from the air to make food via photosynthesis." },
    { q: "The process of germs causing disease is studied under:", options: ["Physics", "Chemistry", "Microbiology", "Geology"], correct: 2, explain: "Microbiology is the branch of science that studies microorganisms and disease." },
  ],
};

/* ---------------- Onboarding tour ---------------- */
const TOUR_SLIDES = [
  { icon: "🏠", title: "Your daily dashboard", body: "Home shows today's sessions, your streak, and quick stats — the first thing you see every day." },
  { icon: "📋", title: "Roll-slip subject cards", body: "Tap any subject to check off chapters as you revise. The badge fills in as you go." },
  { icon: "🗓️", title: "Plan your week", body: "Add study sessions and to-dos from the Planner tab — tap the ＋ button anytime." },
  { icon: "🤖", title: "Ask your AI Coach", body: "Stuck on a topic or want a quiz? Your AI Coach knows the matric syllabus and is ready to help." },
  { icon: "🏅", title: "Level up as you study", body: "Earn XP, unlock badges, and climb levels on the Progress tab — plus a Study Circle to compare with friends." },
];
