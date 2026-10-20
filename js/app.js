/* ============================================================
   EduShare — shared front-end logic
   Mock data + storage for the prototype.
   No backend: everything lives in the browser.
   ============================================================ */

/* Resilient storage: falls back to in-memory if localStorage is
   blocked (e.g. some browsers block storage on file:// origins).
   This guarantees pages still load and Sign In always navigates. */
const SafeStore = {
  ok: (() => {
    try {
      window.localStorage.setItem("__test__", "1");
      window.localStorage.removeItem("__test__");
      return true;
    } catch (e) { return false; }
  })(),
  mem: {},
  get(k) { try { return this.ok ? window.localStorage.getItem(k) : (k in this.mem ? this.mem[k] : null); } catch (e) { return k in this.mem ? this.mem[k] : null; } },
  set(k, v) { try { if (this.ok) window.localStorage.setItem(k, v); else this.mem[k] = v; } catch (e) { this.mem[k] = v; } },
  remove(k) { try { if (this.ok) window.localStorage.removeItem(k); else delete this.mem[k]; } catch (e) { delete this.mem[k]; } },
};

/* ============================================================
   i18n — lightweight runtime translator (English ⇄ Polish)
   Pages are authored in English. When Polish is selected we
   translate the visible DOM, placeholders, the document title,
   and any dynamically-added nodes (cards, toasts, modals).
   Switching language simply flips a stored flag and reloads.
   ============================================================ */
const I18N_PL = {
  /* ---- Page / document titles ---- */
  "EduShare · Teacher Sign In": "EduShare · Logowanie nauczyciela",
  "EduShare · Dashboard": "EduShare · Panel",
  "EduShare · My Materials": "EduShare · Moje materiały",
  "EduShare · Explore & Shared": "EduShare · Odkrywaj i udostępnione",
  "EduShare · Discussion Forums": "EduShare · Fora dyskusyjne",

  /* ---- Login page ---- */
  "The staffroom,": "Pokój nauczycielski,",
  "reimagined online.": "na nowo w internecie.",
  "A platform built for teachers to organise their own resources, share materials with colleagues, and swap ideas in subject-focused discussion forums.": "Platforma stworzona dla nauczycieli do organizowania własnych materiałów, dzielenia się nimi z kolegami i wymiany pomysłów na forach tematycznych.",
  "Keep your personal lesson library in one place": "Trzymaj swoją osobistą bibliotekę lekcji w jednym miejscu",
  "Share & discover materials from teachers worldwide": "Udostępniaj i odkrywaj materiały od nauczycieli z całego świata",
  "Ask questions and trade tips in the forums": "Zadawaj pytania i wymieniaj się wskazówkami na forach",
  "Track how often your resources get reused": "Śledź, jak często Twoje materiały są ponownie wykorzystywane",
  "Prototype · Frontend demo · No real data is stored on a server.": "Prototyp · Demo frontendowe · Żadne prawdziwe dane nie są przechowywane na serwerze.",
  "Welcome back 👋": "Witaj ponownie 👋",
  "Sign in to your teacher account": "Zaloguj się na swoje konto nauczyciela",
  "Demo login:": "Logowanie demo:",
  "any email & password works — just click": "dowolny e‑mail i hasło działają — wystarczy kliknąć",
  "Sign In": "Zaloguj się",
  "School email": "E‑mail szkolny",
  "Password": "Hasło",
  "Remember me": "Zapamiętaj mnie",
  "Forgot password?": "Nie pamiętasz hasła?",
  "Sign In →": "Zaloguj się →",
  "or continue with": "lub kontynuuj przez",
  "🏫 Sign in with School SSO": "🏫 Zaloguj się przez szkolne SSO",
  "New here?": "Nowy tutaj?",
  "Request a teacher account": "Poproś o konto nauczyciela",
  "Password reset is a prototype stub": "Resetowanie hasła to funkcja prototypowa",
  "Registration is a prototype stub": "Rejestracja to funkcja prototypowa",

  /* ---- Shell: sidebar / topbar ---- */
  "Dashboard": "Panel",
  "My Materials": "Moje materiały",
  "Explore & Shared": "Odkrywaj i udostępnione",
  "Discussion Forums": "Fora dyskusyjne",
  "Account": "Konto",
  "Profile": "Profil",
  "Settings": "Ustawienia",
  "Sign out": "Wyloguj się",
  "Search materials, forums, teachers…": "Szukaj materiałów, forów, nauczycieli…",
  "3 new notifications": "3 nowe powiadomienia",
  "Messages is a prototype stub": "Wiadomości to funkcja prototypowa",
  "Profile is a prototype stub": "Profil to funkcja prototypowa",
  "Settings is a prototype stub": "Ustawienia to funkcja prototypowa",
  "Search is a prototype stub": "Wyszukiwanie to funkcja prototypowa",
  "Science Teacher · Grade 9": "Nauczyciel przedmiotów ścisłych · Klasa 9",

  /* ---- Cards / common UI ---- */
  "⬇ Get": "⬇ Pobierz",
  "Share": "Udostępnij",
  "Make Private": "Ustaw jako prywatne",
  "Shared": "Udostępnione",
  "Private": "Prywatne",
  "Downloading": "Pobieranie",
  "prototype": "prototyp",
  "Material is now shared with the community": "Materiał jest teraz udostępniony społeczności",
  "Material set to private": "Materiał ustawiono jako prywatny",
  "All": "Wszystkie",
  "replies": "odpowiedzi",
  "Replies": "Odpowiedzi",

  /* ---- Subjects ---- */
  "Biology": "Biologia",
  "Chemistry": "Chemia",
  "Physics": "Fizyka",
  "Maths": "Matematyka",
  "English": "Angielski",
  "History": "Historia",
  "Geography": "Geografia",

  /* ---- Grades ---- */
  "Grade 6": "Klasa 6",
  "Grade 7": "Klasa 7",
  "Grade 8": "Klasa 8",
  "Grade 9": "Klasa 9",
  "Grade 10": "Klasa 10",
  "Grade 11": "Klasa 11",
  "Grade 12": "Klasa 12",

  /* ---- Material / content types ---- */
  "Slides": "Slajdy",
  "Worksheet": "Karta pracy",
  "Document": "Dokument",
  "Quiz": "Quiz",
  "Video": "Wideo",
  "Flashcards": "Fiszki",
  "Poster": "Plakat",

  /* ---- Relative times ---- */
  "just now": "przed chwilą",
  "1 day ago": "1 dzień temu",
  "2 days ago": "2 dni temu",
  "3 days ago": "3 dni temu",
  "4 days ago": "4 dni temu",
  "5 days ago": "5 dni temu",
  "6 days ago": "6 dni temu",
  "1 week ago": "tydzień temu",
  "2 weeks ago": "2 tygodnie temu",
  "1h ago": "1 godz. temu",
  "2h ago": "2 godz. temu",
  "3h ago": "3 godz. temu",
  "4h ago": "4 godz. temu",
  "5h ago": "5 godz. temu",

  /* ---- Material titles (mock data) ---- */
  "Photosynthesis — Interactive Slides": "Fotosynteza — interaktywne slajdy",
  "Cell Structure Worksheet": "Karta pracy: budowa komórki",
  "Chemistry Lab Safety Checklist": "Lista kontrolna bezpieczeństwa w laboratorium chemicznym",
  "Newton's Laws Quiz (with key)": "Quiz z praw Newtona (z kluczem)",
  "World War II Timeline Poster": "Plakat z osią czasu II wojny światowej",
  "Algebra Practice Pack (200 problems)": "Zestaw ćwiczeń z algebry (200 zadań)",
  "Creative Writing Prompts — 50 Cards": "Podpowiedzi do kreatywnego pisania — 50 kart",
  "The Water Cycle — Animated Lesson": "Obieg wody — animowana lekcja",
  "Periodic Table Flashcards": "Fiszki z układem okresowym",
  "Shakespeare — Macbeth Study Guide": "Shakespeare — przewodnik do Makbeta",

  /* ---- Forum categories ---- */
  "Teaching Tips": "Wskazówki dydaktyczne",
  "EdTech": "EdTech",
  "Classroom Mgmt": "Zarządzanie klasą",

  /* ---- Forum threads (mock data) ---- */
  "Best hands-on activities for teaching photosynthesis?": "Najlepsze praktyczne zajęcia do nauczania fotosyntezy?",
  "I'm looking for engaging, low-cost lab activities to explain photosynthesis to Grade 9. What has worked well in your classrooms?": "Szukam angażujących, tanich zajęć laboratoryjnych, aby wyjaśnić fotosyntezę w klasie 9. Co sprawdziło się w Waszych klasach?",
  "The elodea + baking soda oxygen bubble experiment is a classroom favourite. Cheap and very visual.": "Eksperyment z moczarką i sodą oczyszczoną (pęcherzyki tlenu) to klasowy faworyt. Tani i bardzo obrazowy.",
  "I use spinach leaf discs in a syringe — students love watching them float as they photosynthesise.": "Używam krążków z liści szpinaku w strzykawce — uczniowie uwielbiają patrzeć, jak unoszą się podczas fotosyntezy.",
  "How do you handle differentiated homework at scale?": "Jak radzicie sobie ze zróżnicowaną pracą domową na dużą skalę?",
  "With 30+ students at different levels, grading tiered homework is eating my evenings. Any workflow tips or tools?": "Przy 30+ uczniach na różnych poziomach ocenianie wielopoziomowej pracy domowej pochłania moje wieczory. Macie wskazówki lub narzędzia?",
  "Self-marking quizzes for the mechanical parts, then one open reflection question I actually read. Cut my time in half.": "Samooceniające się quizy do części mechanicznych, a potem jedno otwarte pytanie refleksyjne, które faktycznie czytam. Skróciło to mój czas o połowę.",
  "Free tools for interactive maths lessons?": "Darmowe narzędzia do interaktywnych lekcji matematyki?",
  "Moving away from static PDFs. Recommendations for interactive whiteboard / maths visualisation tools that are free?": "Odchodzę od statycznych plików PDF. Polecacie darmowe narzędzia do interaktywnej tablicy / wizualizacji matematyki?",
  "Managing classroom noise during group work": "Zarządzanie hałasem w klasie podczas pracy w grupach",
  "Group projects are great but the room gets loud fast. How do you keep energy productive without constant reminders?": "Projekty grupowe są świetne, ale w sali szybko robi się głośno. Jak utrzymać produktywną energię bez ciągłego upominania?",
  "A visual noise-level meter on the board + assigning a 'volume monitor' role per group worked wonders for me.": "Wizualny miernik poziomu hałasu na tablicy + przydzielenie roli „strażnika głośności” w każdej grupie zdziałały u mnie cuda.",
  "(no details provided)": "(nie podano szczegółów)",
  "No replies yet — be the first to help!": "Brak odpowiedzi — bądź pierwszy, który pomoże!",

  /* ---- Dashboard ---- */
  "Welcome back": "Witaj ponownie",
  "Welcome back,": "Witaj ponownie,",
  "Here's what's happening across your classroom resources today.": "Oto co dzieje się dziś w Twoich materiałach klasowych.",
  "＋ Upload Material": "＋ Prześlij materiał",
  "My materials": "Moje materiały",
  "Shared with community": "Udostępnione społeczności",
  "Total downloads": "Łączne pobrania",
  "Active discussions": "Aktywne dyskusje",
  "Recent materials": "Ostatnie materiały",
  "View all →": "Zobacz wszystkie →",
  "Trending in the community": "Popularne w społeczności",
  "Explore →": "Odkrywaj →",
  "🔥 Hot discussions": "🔥 Gorące dyskusje",
  "Open forums": "Otwórz fora",
  "👥 Colleagues to follow": "👥 Koledzy do obserwowania",
  "History · 12 resources": "Historia · 12 materiałów",
  "Maths · 28 resources": "Matematyka · 28 materiałów",
  "Geography · 9 resources": "Geografia · 9 materiałów",
  "Follow": "Obserwuj",
  "Now following James": "Obserwujesz teraz Jamesa",
  "Now following Priya": "Obserwujesz teraz Priyę",
  "Now following Ana": "Obserwujesz teraz Anę",
  "📅 Upcoming": "📅 Nadchodzące",
  "Staff CPD: EdTech tools": "Doskonalenie kadry: narzędzia EdTech",
  "Grade 9 Science reports due": "Termin raportów z przyrody dla klasy 9",
  "Department planning meeting": "Spotkanie planujące wydziału",

  /* ---- My Materials ---- */
  "Your private lesson library. Keep resources for yourself, or share them with the community in one click.": "Twoja prywatna biblioteka lekcji. Zachowaj materiały dla siebie lub udostępnij je społeczności jednym kliknięciem.",
  "Sort: Recent": "Sortuj: Najnowsze",
  "Sort: Most downloaded": "Sortuj: Najczęściej pobierane",
  "Sort: A–Z": "Sortuj: A–Z",
  "No materials match this filter yet.": "Żadne materiały nie pasują jeszcze do tego filtra.",
  "Upload a new material": "Prześlij nowy materiał",
  "Title": "Tytuł",
  "Subject": "Przedmiot",
  "Type": "Typ",
  "Grade": "Klasa",
  "Visibility": "Widoczność",
  "File": "Plik",
  "Cancel": "Anuluj",
  "Upload": "Prześlij",
  "Private (only me)": "Prywatne (tylko ja)",
  "e.g. Photosynthesis — Interactive Slides": "np. Fotosynteza — interaktywne slajdy",
  "Please enter a title": "Proszę podać tytuł",
  "Material uploaded to your library": "Materiał przesłany do Twojej biblioteki",

  /* ---- Explore & Shared ---- */
  "Discover resources shared by teachers everywhere — and see what you've contributed to the community.": "Odkrywaj materiały udostępniane przez nauczycieli z całego świata — i zobacz, czym podzieliłeś się ze społecznością.",
  "＋ Share your own": "＋ Udostępnij własne",
  "🔍 Search shared materials…": "🔍 Szukaj udostępnionych materiałów…",
  "All subjects": "Wszystkie przedmioty",
  "All grades": "Wszystkie klasy",
  "Sort: Most popular": "Sortuj: Najpopularniejsze",
  "🌐 Community library": "🌐 Biblioteka społeczności",
  "📤 Shared by me": "📤 Udostępnione przeze mnie",
  "You haven't shared any materials yet. Share one from": "Nie udostępniłeś jeszcze żadnych materiałów. Udostępnij coś z",
  "No community materials match your filters.": "Żadne materiały społeczności nie pasują do Twoich filtrów.",

  /* ---- Forums ---- */
  "Ask questions, swap teaching tips, and learn from colleagues across subjects.": "Zadawaj pytania, wymieniaj się wskazówkami i ucz się od kolegów z różnych przedmiotów.",
  "＋ New Discussion": "＋ Nowa dyskusja",
  "📌 Forum guidelines": "📌 Zasady forum",
  "Be respectful and constructive.": "Bądź uprzejmy i konstruktywny.",
  "Share sources when you can.": "Udostępniaj źródła, gdy możesz.",
  "Keep student data private.": "Chroń dane uczniów.",
  "Upvote answers that helped you.": "Głosuj na odpowiedzi, które Ci pomogły.",
  "🏷️ Popular categories": "🏷️ Popularne kategorie",
  "⭐ Top contributors": "⭐ Najlepsi autorzy",
  "312 helpful answers": "312 pomocnych odpowiedzi",
  "274 helpful answers": "274 pomocnych odpowiedzi",
  "198 helpful answers": "198 pomocnych odpowiedzi",
  "Start a new discussion": "Rozpocznij nową dyskusję",
  "Category": "Kategoria",
  "Details": "Szczegóły",
  "Ask a clear, specific question…": "Zadaj jasne, konkretne pytanie…",
  "Give some context so others can help…": "Podaj kontekst, aby inni mogli pomóc…",
  "Post discussion": "Opublikuj dyskusję",
  "Discussion": "Dyskusja",
  "Add your reply": "Dodaj swoją odpowiedź",
  "Share your thoughts…": "Podziel się przemyśleniami…",
  "Post reply": "Opublikuj odpowiedź",
  "No discussions in this category yet.": "Brak dyskusji w tej kategorii.",
  "Upvoted": "Oddano głos",
  "Write something first": "Najpierw coś napisz",
  "Reply posted": "Odpowiedź opublikowana",
  "Please add a title": "Proszę dodać tytuł",
  "Discussion posted": "Dyskusja opublikowana",
};

function currentLang() { return SafeStore.get("edushare_lang") === "pl" ? "pl" : "en"; }

/* Translate a single string (preserving leading/trailing whitespace). */
function tr(s) {
  if (currentLang() !== "pl" || s == null) return s;
  const str = String(s);
  const key = str.trim();
  if (!key) return s;
  const hit = I18N_PL[key];
  if (hit == null) return s;
  const lead = str.match(/^\s*/)[0];
  const trail = str.match(/\s*$/)[0];
  return lead + hit + trail;
}

function toggleLang() {
  SafeStore.set("edushare_lang", currentLang() === "pl" ? "en" : "pl");
  location.reload();
}

function _translateTextNode(node) {
  const p = node.parentNode;
  if (!p) return;
  if (p.nodeName === "SCRIPT" || p.nodeName === "STYLE") return;
  const raw = node.nodeValue;
  if (!raw || !raw.trim()) return;
  const out = tr(raw);
  if (out !== raw) node.nodeValue = out;
}

function _translatePlaceholders(root) {
  if (root.nodeType === 1 && root.hasAttribute("placeholder")) {
    const ph = root.getAttribute("placeholder");
    const out = tr(ph);
    if (out !== ph) root.setAttribute("placeholder", out);
  }
  const els = root.querySelectorAll ? root.querySelectorAll("[placeholder]") : [];
  els.forEach(el => {
    const ph = el.getAttribute("placeholder");
    const out = tr(ph);
    if (out !== ph) el.setAttribute("placeholder", out);
  });
}

function translateSubtree(root) {
  if (currentLang() !== "pl" || !root) return;
  if (root.nodeType === 3) { _translateTextNode(root); return; }
  if (root.nodeType !== 1) return;
  _translatePlaceholders(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(_translateTextNode);
}

function applyLang() {
  if (currentLang() !== "pl") return;
  document.title = tr(document.title);
  if (document.body) translateSubtree(document.body);
  const obs = new MutationObserver(muts => {
    muts.forEach(m => {
      if (m.type === "characterData") { _translateTextNode(m.target); return; }
      m.addedNodes && m.addedNodes.forEach(node => {
        if (node.nodeType === 3) _translateTextNode(node);
        else translateSubtree(node);
      });
    });
  });
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applyLang);
} else {
  applyLang();
}

const Store = {
  key: "edushare_state_v1",

  seed() {
    const state = {
      user: { name: "Sarah Mitchell", role: "Science Teacher · Grade 9", initials: "SM", email: "s.mitchell@school.edu" },
      materials: [
        { id: 1, title: "Photosynthesis — Interactive Slides", type: "Slides", subject: "Biology", grade: "Grade 9", visibility: "shared", size: "4.2 MB", downloads: 128, updated: "2 days ago", owner: "Sarah Mitchell", ownerInit: "SM", color: "#16a34a", icon: "🧬" },
        { id: 2, title: "Cell Structure Worksheet", type: "Worksheet", subject: "Biology", grade: "Grade 9", visibility: "private", size: "820 KB", downloads: 0, updated: "5 days ago", owner: "Sarah Mitchell", ownerInit: "SM", color: "#0ea5e9", icon: "📄" },
        { id: 3, title: "Chemistry Lab Safety Checklist", type: "Document", subject: "Chemistry", grade: "Grade 10", visibility: "shared", size: "1.1 MB", downloads: 342, updated: "1 week ago", owner: "Sarah Mitchell", ownerInit: "SM", color: "#d97706", icon: "🧪" },
        { id: 4, title: "Newton's Laws Quiz (with key)", type: "Quiz", subject: "Physics", grade: "Grade 11", visibility: "private", size: "560 KB", downloads: 0, updated: "2 weeks ago", owner: "Sarah Mitchell", ownerInit: "SM", color: "#4f46e5", icon: "📝" },
      ],
      explore: [
        { id: 101, title: "World War II Timeline Poster", type: "Poster", subject: "History", grade: "Grade 8", size: "6.4 MB", downloads: 1204, updated: "3 days ago", owner: "James Okoro", ownerInit: "JO", color: "#dc2626", icon: "🗺️" },
        { id: 102, title: "Algebra Practice Pack (200 problems)", type: "Worksheet", subject: "Maths", grade: "Grade 9", size: "2.8 MB", downloads: 3410, updated: "1 day ago", owner: "Priya Sharma", ownerInit: "PS", color: "#4f46e5", icon: "➗" },
        { id: 103, title: "Creative Writing Prompts — 50 Cards", type: "Slides", subject: "English", grade: "Grade 7", size: "3.1 MB", downloads: 890, updated: "6 days ago", owner: "Liam Byrne", ownerInit: "LB", color: "#0ea5e9", icon: "✍️" },
        { id: 104, title: "The Water Cycle — Animated Lesson", type: "Video", subject: "Geography", grade: "Grade 6", size: "48 MB", downloads: 2050, updated: "4 days ago", owner: "Ana Torres", ownerInit: "AT", color: "#16a34a", icon: "🌧️" },
        { id: 105, title: "Periodic Table Flashcards", type: "Flashcards", subject: "Chemistry", grade: "Grade 10", size: "1.9 MB", downloads: 1670, updated: "1 week ago", owner: "James Okoro", ownerInit: "JO", color: "#d97706", icon: "🧪" },
        { id: 106, title: "Shakespeare — Macbeth Study Guide", type: "Document", subject: "English", grade: "Grade 12", size: "2.2 MB", downloads: 1330, updated: "2 weeks ago", owner: "Priya Sharma", ownerInit: "PS", color: "#7c3aed", icon: "📖" },
      ],
      threads: [
        { id: 201, title: "Best hands-on activities for teaching photosynthesis?", body: "I'm looking for engaging, low-cost lab activities to explain photosynthesis to Grade 9. What has worked well in your classrooms?", author: "Sarah Mitchell", authorInit: "SM", category: "Biology", votes: 24, replies: [
          { who: "James Okoro", init: "JO", when: "3h ago", text: "The elodea + baking soda oxygen bubble experiment is a classroom favourite. Cheap and very visual." },
          { who: "Ana Torres", init: "AT", when: "1h ago", text: "I use spinach leaf discs in a syringe — students love watching them float as they photosynthesise." },
        ], when: "5h ago", tags: ["activities", "labs"] },
        { id: 202, title: "How do you handle differentiated homework at scale?", body: "With 30+ students at different levels, grading tiered homework is eating my evenings. Any workflow tips or tools?", author: "Liam Byrne", authorInit: "LB", category: "Teaching Tips", votes: 41, replies: [
          { who: "Priya Sharma", init: "PS", when: "2h ago", text: "Self-marking quizzes for the mechanical parts, then one open reflection question I actually read. Cut my time in half." },
        ], when: "1 day ago", tags: ["workload", "assessment"] },
        { id: 203, title: "Free tools for interactive maths lessons?", body: "Moving away from static PDFs. Recommendations for interactive whiteboard / maths visualisation tools that are free?", author: "Priya Sharma", authorInit: "PS", category: "EdTech", votes: 18, replies: [], when: "2 days ago", tags: ["tools", "maths"] },
        { id: 204, title: "Managing classroom noise during group work", body: "Group projects are great but the room gets loud fast. How do you keep energy productive without constant reminders?", author: "Ana Torres", authorInit: "AT", category: "Classroom Mgmt", votes: 33, replies: [
          { who: "Sarah Mitchell", init: "SM", when: "4h ago", text: "A visual noise-level meter on the board + assigning a 'volume monitor' role per group worked wonders for me." },
        ], when: "3 days ago", tags: ["classroom", "management"] },
      ],
    };
    SafeStore.set(this.key, JSON.stringify(state));
    return state;
  },

  get() {
    const raw = SafeStore.get(this.key);
    if (!raw) return this.seed();
    try { return JSON.parse(raw); } catch { return this.seed(); }
  },

  set(state) { SafeStore.set(this.key, JSON.stringify(state)); },
};

/* ---------- Auth guard ---------- */
function requireAuth() {
  // Only bounce to login when storage works AND user is not signed in.
  // If storage is unavailable, allow through so the prototype still runs.
  if (SafeStore.ok && SafeStore.get("edushare_auth") !== "1") {
    window.location.href = "index.html";
  }
}
function login() {
  SafeStore.set("edushare_auth", "1");
  // Navigate regardless of storage success.
  window.location.href = "dashboard.html";
}
function logout() {
  SafeStore.remove("edushare_auth");
  window.location.href = "index.html";
}

/* ---------- Toast ---------- */
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Modal helpers ---------- */
function openModal(id) { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }

/* ---------- Sidebar / topbar renderer ---------- */
function renderShell(active) {
  const s = Store.get();
  const u = s.user;
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", href: "dashboard.html" },
    { id: "my", label: "My Materials", icon: "📁", href: "my-materials.html" },
    { id: "explore", label: "Explore & Shared", icon: "🌐", href: "shared.html" },
    { id: "forums", label: "Discussion Forums", icon: "💬", href: "forums.html" },
  ];
  const navHtml = nav.map(n =>
    `<a class="nav-link ${active === n.id ? "active" : ""}" href="${n.href}">
       <span class="ico">${n.icon}</span> ${n.label}
     </a>`).join("");

  const sidebar = `
    <aside class="sidebar">
      <div class="brand"><span class="logo">🎓</span> EduShare</div>
      ${navHtml}
      <div class="nav-section">Account</div>
      <a class="nav-link" href="#" onclick="toast('Profile is a prototype stub');return false;"><span class="ico">👤</span> Profile</a>
      <a class="nav-link" href="#" onclick="toast('Settings is a prototype stub');return false;"><span class="ico">⚙️</span> Settings</a>
      <div class="sidebar-foot">
        <a class="nav-link" href="#" onclick="logout();return false;"><span class="ico">🚪</span> Sign out</a>
      </div>
    </aside>`;

  const topbar = `
    <header class="topbar">
      <div class="search">
        <span class="ico">🔍</span>
        <input type="text" placeholder="Search materials, forums, teachers…" onkeydown="if(event.key==='Enter')toast('Search is a prototype stub')">
      </div>
      <div class="spacer"></div>
      <button class="lang-btn" title="Language / Język" onclick="toggleLang()">🌐 <span>${currentLang() === "pl" ? "EN" : "PL"}</span></button>
      <button class="icon-btn" title="Notifications" onclick="toast('3 new notifications')">🔔<span class="dot-notif"></span></button>
      <button class="icon-btn" title="Messages" onclick="toast('Messages is a prototype stub')">✉️</button>
      <div class="user-mini">
        <div class="avatar sm">${u.initials}</div>
        <div>
          <div class="name">${u.name}</div>
          <div class="role">${u.role}</div>
        </div>
      </div>
    </header>`;

  return { sidebar, topbar };
}

function mountShell(active) {
  const shell = renderShell(active);
  const sb = document.getElementById("sidebar-slot");
  const tb = document.getElementById("topbar-slot");
  if (sb) sb.outerHTML = shell.sidebar;
  if (tb) tb.outerHTML = shell.topbar;
}

/* ---------- Material card renderer ---------- */
function materialCard(m, opts = {}) {
  const visBadge = m.visibility === "shared"
    ? `<span class="badge badge-green">Shared</span>`
    : m.visibility === "private"
      ? `<span class="badge badge-gray">Private</span>` : "";
  const actionBtn = opts.explore
    ? `<button class="btn btn-primary btn-sm" onclick="downloadMat('${m.title.replace(/'/g, "")}')">⬇ Get</button>`
    : `<button class="btn btn-outline btn-sm" onclick="toggleShare(${m.id})">${m.visibility === "shared" ? "Make Private" : "Share"}</button>`;
  return `
    <div class="mat-card">
      <div class="mat-thumb" style="background:linear-gradient(135deg, ${m.color}, ${shade(m.color)})">${m.icon}</div>
      <div class="mat-body">
        <div class="tag-row">
          <span class="badge badge-blue">${m.subject}</span>
          ${visBadge}
        </div>
        <h3>${m.title}</h3>
        <div class="mat-meta">
          <span>${m.type}</span><span>·</span><span>${m.grade}</span><span>·</span><span>${m.size}</span>
        </div>
      </div>
      <div class="mat-foot">
        <div class="avatar sm" title="${m.owner}">${m.ownerInit}</div>
        <span>${m.downloads.toLocaleString()} ⬇</span>
        <span class="spacer"></span>
        ${actionBtn}
      </div>
    </div>`;
}

function shade(hex) {
  // darken a hex colour ~18% for gradient end
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.round(r * 0.72); g = Math.round(g * 0.72); b = Math.round(b * 0.72);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function downloadMat(title) { toast(`${tr("Downloading")} “${title}” (${tr("prototype")})`); }

function toggleShare(id) {
  const s = Store.get();
  const m = s.materials.find(x => x.id === id);
  if (!m) return;
  m.visibility = m.visibility === "shared" ? "private" : "shared";
  Store.set(s);
  toast(m.visibility === "shared" ? "Material is now shared with the community" : "Material set to private");
  if (window.__rerender) window.__rerender();
}
