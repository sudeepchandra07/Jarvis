// src/data/simulationGenerator.js
// Parses whatever goal + URL the user types and generates a fresh,
// plausible simulated audit run from it. No live browsing — this is a
// template engine that reuses the same friction/a11y patterns real
// e-commerce sites commonly exhibit, populated with the user's own words.

function parseGoal(text) {
  const raw = (text || "").trim() || "Find a product and complete checkout";
  const lower = raw.toLowerCase();

  const priceMatch = lower.match(/(?:under|below|less than)\s*[\$₹]?\s*(\d+)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : null;
  const currency = raw.includes("₹") ? "₹" : "$";

  let category = raw.replace(/^(please\s+)?(find|search for|search|get|buy|look for|locate)\s+/i, "");
  category = category.split(/\s+(?:under|below|less than|and\s+complete|and\s+)/i)[0].trim();
  if (!category) category = raw;

  let terminal = "Task completed";
  if (/checkout|buy|purchase|order/i.test(raw)) terminal = "Order placed";
  else if (/sign\s?up|register|create an account/i.test(raw)) terminal = "Signup confirmed";
  else if (/book|reserve|appointment/i.test(raw)) terminal = "Booking confirmed";

  const colors = ["red", "blue", "green", "black", "white", "yellow", "orange", "purple", "pink", "grey", "gray", "silver", "gold"];
  const color = colors.find((c) => lower.includes(c)) || null;

  return { raw, category, maxPrice, currency, terminal, color };
}

function parseSite(url) {
  try {
    const u = new URL(url && url.startsWith("http") ? url : `https://${url || "demo-shop.example.com"}`);
    const host = u.hostname.replace(/^www\./, "");
    const name = host.split(".")[0];
    return { host, name: name.charAt(0).toUpperCase() + name.slice(1) };
  } catch {
    return { host: "target-site.com", name: "Target Site" };
  }
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function generateRun(goalText, targetUrl) {
  const g = parseGoal(goalText);
  const site = parseSite(targetUrl);
  const filterLabel = g.maxPrice ? `Under ${g.currency}${g.maxPrice}` : "Top Rated";
  const swatchLabel = g.color ? `Swatch '${cap(g.color)}'` : "In Stock Only";
  const categoryDisplay = cap(g.category);
  const priceClause = g.maxPrice ? `, price ≤ ${g.currency}${g.maxPrice}` : "";

  const goalSpec = {
    raw: g.raw,
    target_category: g.category,
    search_filters: { color: g.color, max_price: g.maxPrice },
    terminal_condition: g.terminal,
    forbidden_states: ["User login required", "Payment failure screen"],
    max_steps: 25,
    exploration_budget: 3,
  };

  const timeline = [
    {
      t: 0, path: "A", state: "OBSERVING",
      thought: `Session provisioned on ${site.host}. Capturing initial viewport and accessibility tree.`,
      action: null, cursor: { x: 640, y: 40 },
      log: { type: "SYS", text: `Clean context spawned → ${site.host}` },
    },
    {
      t: 1.2, path: "A", state: "DECIDING",
      thought: `Search bar looks like the fastest route to "${g.category}". Trying Path A first.`,
      action: null, cursor: { x: 320, y: 40 },
      log: { type: "ACT", text: "Element_Index built — 14 interactable targets indexed" },
    },
    {
      t: 2.4, path: "A", state: "EXECUTING",
      thought: `Typing "${g.category}" into search input [#3].`,
      action: { type: "TYPE", x: 320, y: 40, text: g.category },
      cursor: { x: 320, y: 40 },
      log: { type: "ACT", text: `TYPE(x:320, y:40, text:"${g.category}")` },
    },
    {
      t: 3.6, path: "A", state: "EVALUATING",
      thought: `Results loaded for "${g.category}". None filtered yet.`,
      action: null, cursor: { x: 320, y: 40 },
      log: { type: "VER", text: "SUCCESS — state transition confirmed (DOM + URL changed)" },
    },
    {
      t: 4.5, path: "A", state: "EXECUTING",
      thought: `Applying filter — clicking "${filterLabel}" [#15].`,
      action: { type: "CLICK", x: 45, y: 310 }, cursor: { x: 45, y: 310 },
      log: { type: "ACT", text: `CLICK(x:45, y:310) → target [#15: Filter '${filterLabel}']` },
    },
    {
      t: 5.3, path: "A", state: "EVALUATING",
      thought: "Dead click detected — no DOM mutation after 900ms. Filter appears non-functional.",
      action: null, cursor: { x: 45, y: 310 },
      log: { type: "VER", text: "NO_OP — zero visual/DOM change, flagged as dead click" },
      finding: {
        kind: "ux", severity: "high",
        title: `Dead click on '${filterLabel}' filter`,
        plain: `A shopper clicks "${filterLabel}" expecting results to narrow down for "${g.category}" — nothing happens. They'll likely assume the site is broken and leave.`,
        detail: `Clicking '${filterLabel}' produces no state change on ${site.host}.`,
        coords: "x:45, y:310", timestamp: "00:05.3",
      },
    },
    {
      t: 6.4, path: "A", state: "DECIDING",
      thought: "Filter unresponsive — branching. Pushing Path B (Category Nav) and Path C (Promo Tile) to the queue, backtracking.",
      action: null, cursor: { x: 45, y: 310 },
      log: { type: "SYS", text: "Path Priority Queue updated — 2 alternatives queued" },
      loopWarning: true,
    },
    {
      t: 7.2, path: "B", state: "OBSERVING",
      thought: `Backtracked to homepage. Trying category navigation toward "${g.category}".`,
      action: { type: "CLICK", x: 180, y: 96 }, cursor: { x: 180, y: 96 },
      log: { type: "ACT", text: "CLICK(x:180, y:96) → target [#7: Nav 'Categories']" },
    },
    {
      t: 8.3, path: "B", state: "EXECUTING",
      thought: `On category page. Selecting "${swatchLabel}".`,
      action: { type: "CLICK", x: 210, y: 420 }, cursor: { x: 210, y: 420 },
      log: { type: "ACT", text: `CLICK(x:210, y:420) → target [#22: ${swatchLabel}]` },
    },
    {
      t: 9.2, path: "B", state: "EVALUATING",
      thought: `Matching results shown for "${g.category}"${priceClause}. Selecting best match.`,
      action: { type: "CLICK", x: 512, y: 640 }, cursor: { x: 512, y: 640 },
      log: { type: "VER", text: `SUCCESS — matching products rendered${priceClause}` },
    },
    {
      t: 10.1, path: "B", state: "EXECUTING",
      thought: "Proceeding to checkout.",
      action: { type: "CLICK", x: 1180, y: 40 }, cursor: { x: 1180, y: 40 },
      log: { type: "ACT", text: "CLICK(x:1180, y:40) → target [#31: 'Checkout']" },
    },
    {
      t: 11.0, path: "B", state: "EVALUATING",
      thought: "Contrast scan on checkout page flags the guest-checkout button.",
      action: null, cursor: { x: 1180, y: 40 },
      log: { type: "A11Y", text: "WCAG 1.4.3 — contrast 2.8:1 on #guest-checkout-btn (needs 4.5:1)" },
      finding: {
        kind: "a11y", severity: "critical", wcag: "1.4.3 Contrast (Minimum)",
        title: "Insufficient contrast on 'Continue as Guest' button",
        plain: `Anyone with low vision, or just using their phone in bright sunlight, may not be able to read this button on ${site.host} — meaning they can't tell it's clickable.`,
        affects: "Low-vision users, older users, anyone in bright ambient light",
        detail: "Text color #9CA3AF on background #F3F4F6 measures 2.8:1, below the required 4.5:1 for normal text.",
        selector: "#guest-checkout-btn",
        fix: "Change text color to #4B5563 or darker, or darken the button background to reach a 4.5:1 ratio.",
        timestamp: "00:11.0",
      },
    },
    {
      t: 12.0, path: "B", state: "EXECUTING",
      thought: "Filling checkout form — name, email, address.",
      action: { type: "TYPE", x: 400, y: 220, text: "guest@demo.com" }, cursor: { x: 400, y: 220 },
      log: { type: "ACT", text: 'TYPE(x:400, y:220, text:"guest@demo.com")' },
    },
    {
      t: 12.8, path: "B", state: "EVALUATING",
      thought: "ZIP/postal code field has no accessible label — a11y tree exposes it only as 'textbox'.",
      action: null, cursor: { x: 400, y: 300 },
      log: { type: "A11Y", text: "WCAG 4.1.2 — missing accessible name on #zip-input" },
      finding: {
        kind: "a11y", severity: "high", wcag: "4.1.2 Name, Role, Value",
        title: "Postal code input missing accessible label",
        plain: `A screen reader announces this field only as "edit text" on ${site.host} — with no clue it wants a postal code. A blind user has to guess, or abandons checkout entirely.`,
        affects: "Screen reader users (blind or low-vision)",
        detail: "Input is exposed to the accessibility tree with role 'textbox' and no accessible name.",
        selector: "#zip-input",
        fix: 'Add a visible <label for="zip-input"> or an aria-label="Postal code" attribute.',
        timestamp: "00:12.8",
      },
    },
    {
      t: 13.6, path: "B", state: "EXECUTING",
      thought: "Submitting order.",
      action: { type: "CLICK", x: 640, y: 520 }, cursor: { x: 640, y: 520 },
      log: { type: "ACT", text: "CLICK(x:640, y:520) → target [#40: 'Place Order']" },
    },
    {
      t: 14.5, path: "B", state: "EVALUATING",
      thought: `Terminal condition reached: "${g.terminal}".`,
      action: null, cursor: { x: 640, y: 520 },
      log: { type: "VER", text: `SUCCESS — terminal condition matched: '${g.terminal}'` },
    },
    {
      t: 15.0, path: "B", state: "IDLE",
      thought: "Goal complete via Path B. Compiling audit report.",
      action: null, cursor: { x: 640, y: 520 },
      log: { type: "SYS", text: "Run complete — 2 paths explored, 1 blocked, report generated" },
    },
  ];

  const journeyGraph = {
    nodes: [
      { id: "n0", label: "Homepage", status: "success", path: null, t: 0 },
      { id: "n1", label: "Search Results", status: "success", path: "A", t: 3.6 },
      { id: "n2", label: `${filterLabel} (dead click)`, status: "blocker", path: "A", t: 5.3 },
      { id: "n3", label: "Category Page", status: "success", path: "B", t: 7.2 },
      { id: "n4", label: `Filtered: ${categoryDisplay}`, status: "success", path: "B", t: 9.2 },
      { id: "n5", label: "Checkout (contrast issue)", status: "friction", path: "B", t: 11.0 },
      { id: "n6", label: "Guest Form (label issue)", status: "friction", path: "B", t: 12.8 },
      { id: "n7", label: g.terminal, status: "success", path: "B", t: 14.5 },
      { id: "n8", label: "Promo Tile", status: "unexplored", path: "C", t: Infinity },
    ],
    edges: [
      { from: "n0", to: "n1", path: "A" }, { from: "n1", to: "n2", path: "A" },
      { from: "n0", to: "n3", path: "B" }, { from: "n3", to: "n4", path: "B" },
      { from: "n4", to: "n5", path: "B" }, { from: "n5", to: "n6", path: "B" },
      { from: "n6", to: "n7", path: "B" }, { from: "n0", to: "n8", path: "C" },
    ],
  };

  const screens = [
    { id: "home", from: 0, title: site.host, elements: [
      { id: "#3", label: "Search products", box: { x: 15, y: 6, w: 27, h: 6 } },
      { id: "#7", label: "Nav 'Categories'", box: { x: 9, y: 16, w: 12, h: 5 } },
      { id: "#50", label: "Promo banner", box: { x: 70, y: 12, w: 20, h: 17 } },
    ]},
    { id: "search", from: 3.6, title: `${site.host}/search?q=${encodeURIComponent(g.category)}`, elements: [
      { id: "#15", label: `Filter: ${filterLabel}`, box: { x: 2, y: 40, w: 16, h: 5 } },
      { id: "grid", label: "Results grid", box: { x: 20, y: 40, w: 76, h: 45 } },
    ]},
    { id: "category", from: 7.2, title: `${site.host}/category`, elements: [
      { id: "#22", label: swatchLabel, box: { x: 15, y: 55, w: 10, h: 6 } },
      { id: "#28", label: "Product card", box: { x: 38, y: 83, w: 12, h: 11 } },
      { id: "#31", label: "'Checkout'", box: { x: 87, y: 3, w: 10, h: 6 } },
    ]},
    { id: "checkout", from: 11.0, title: `${site.host}/checkout/guest`, elements: [
      { id: "#guest", label: "Continue as Guest", box: { x: 87, y: 3, w: 11, h: 6 } },
      { id: "#email", label: "Email input", box: { x: 26, y: 27, w: 17, h: 6 } },
      { id: "#zip", label: "Postal code (no label)", box: { x: 28, y: 39, w: 16, h: 6 }, flagged: true },
      { id: "#40", label: "Place Order", box: { x: 45, y: 68, w: 13, h: 6 } },
    ]},
  ];

  const uxFindings = timeline.filter((e) => e.finding?.kind === "ux").map((e) => e.finding);
  const a11yFindings = timeline.filter((e) => e.finding?.kind === "a11y").map((e) => e.finding);

  const pathComparison = [
    { path: "Path A — Search Bar", steps: 3, time: "6.4s", frictionScore: 8.5, verdict: "Blocked",
      detail: `'${filterLabel}' filter is a dead click — path abandoned after repeated no-op.` },
    { path: "Path B — Category Nav", steps: 9, time: "8.6s", frictionScore: 4.2, verdict: "Passed (High-Friction)",
      detail: `Completed successfully but hit ${a11yFindings.length} accessibility violation(s) en route.` },
    { path: "Path C — Promo Tile", steps: 0, time: "—", frictionScore: null, verdict: "Not explored",
      detail: "Exploration budget reached after Path B satisfied the terminal condition." },
  ];

  const summary = {
    verdict: "Passed (High-Friction)",
    pathsExplored: 2, pathsBlocked: 1, totalSteps: 12, totalTime: "15.0s",
    a11yViolations: a11yFindings.length, uxIssues: uxFindings.length,
  };

  return { goalSpec, timeline, journeyGraph, screens, pathComparison, uxFindings, a11yFindings, summary, site };
}