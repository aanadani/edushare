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

function downloadMat(title) { toast(`Downloading “${title}” (prototype)`); }

function toggleShare(id) {
  const s = Store.get();
  const m = s.materials.find(x => x.id === id);
  if (!m) return;
  m.visibility = m.visibility === "shared" ? "private" : "shared";
  Store.set(s);
  toast(m.visibility === "shared" ? "Material is now shared with the community" : "Material set to private");
  if (window.__rerender) window.__rerender();
}
