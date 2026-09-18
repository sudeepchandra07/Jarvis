// src/data/simulationData.js
// Scripted 15-second agent run. Every panel in the app plays through this
// timeline instead of doing live browser automation — deterministic and
// demo-safe.

export const goalSpec = {
  raw: "Find blue running shoes under $100 and complete guest checkout",
  target_category: "running shoes",
  search_filters: { color: "blue", max_price: 100 },
  terminal_condition: "Checkout confirmation / Order placed",
  forbidden_states: ["User login required", "Payment failure screen"],
  max_steps: 25,
  exploration_budget: 3,
};

// Each event drives the whole UI: which path is active, what the agent
// "sees", what it types into the thought stream, and any log/finding it
// throws off. `t` is seconds from the start of the run.
export const timeline = [
  {
    t: 0,
    path: "A",
    state: "OBSERVING",
    thought: "Session provisioned. Capturing initial viewport and a11y tree.",
    action: null,
    cursor: { x: 640, y: 40 },
    log: { type: "SYS", text: "Clean context spawned → demo-shop.example.com" },
  },
  {
    t: 1.2,
    path: "A",
    state: "DECIDING",
    thought: "Search bar is the fastest route to a filtered result. Trying Path A first.",
    action: null,
    cursor: { x: 320, y: 40 },
    log: { type: "ACT", text: "Element_Index built — 14 interactable targets indexed" },
  },
  {
    t: 2.4,
    path: "A",
    state: "EXECUTING",
    thought: 'Typing "blue running shoes" into search input [#3].',
    action: { type: "TYPE", x: 320, y: 40, text: "blue running shoes" },
    cursor: { x: 320, y: 40 },
    log: { type: "ACT", text: "TYPE(x:320, y:40, text:\"blue running shoes\")" },
  },
  {
    t: 3.6,
    path: "A",
    state: "EVALUATING",
    thought: "Results loaded. 12 products shown, none price-filtered yet.",
    action: null,
    cursor: { x: 320, y: 40 },
    log: { type: "VER", text: "SUCCESS — state transition confirmed (DOM + URL changed)" },
  },
  {
    t: 4.5,
    path: "A",
    state: "EXECUTING",
    thought: "Applying price filter — clicking Under $100 [#15].",
    action: { type: "CLICK", x: 45, y: 310 },
    cursor: { x: 45, y: 310 },
    log: { type: "ACT", text: "CLICK(x:45, y:310) → target [#15: Filter by price]" },
  },
  {
    t: 5.3,
    path: "A",
    state: "EVALUATING",
    thought: "Dead click detected — no DOM mutation after 900ms. Filter button appears non-functional.",
    action: null,
    cursor: { x: 45, y: 310 },
    log: { type: "VER", text: "NO_OP — zero visual/DOM change, flagged as dead click" },
    finding: {
      kind: "ux",
      severity: "high",
      title: "Dead click on price filter",
      plain: "A shopper clicks 'Under $100' expecting the results to narrow down — nothing happens. They'll likely assume the site is broken and leave, even though cheaper shoes exist further down the page.",
      detail: "Clicking 'Under $100' produces no state change. Users cannot narrow results by price from this control.",
      coords: "x:45, y:310",
      timestamp: "00:05.3",
    },
  },
  {
    t: 6.4,
    path: "A",
    state: "DECIDING",
    thought: "Filter unresponsive twice in a row — branching. Pushing Path B (Category Nav) and Path C (Promo Tile) to the queue, backtracking.",
    action: null,
    cursor: { x: 45, y: 310 },
    log: { type: "SYS", text: "Path Priority Queue updated — 2 alternatives queued" },
    loopWarning: true,
  },
  {
    t: 7.2,
    path: "B",
    state: "OBSERVING",
    thought: "Backtracked to homepage. Trying category navigation: Shoes → Running.",
    action: { type: "CLICK", x: 180, y: 96 },
    cursor: { x: 180, y: 96 },
    log: { type: "ACT", text: "CLICK(x:180, y:96) → target [#7: Nav 'Shoes']" },
  },
  {
    t: 8.3,
    path: "B",
    state: "EXECUTING",
    thought: "On category page. Selecting color swatch: Blue.",
    action: { type: "CLICK", x: 210, y: 420 },
    cursor: { x: 210, y: 420 },
    log: { type: "ACT", text: "CLICK(x:210, y:420) → target [#22: Swatch 'Blue']" },
  },
  {
    t: 9.2,
    path: "B",
    state: "EVALUATING",
    thought: "6 blue running shoes shown, 3 under $100. Selecting lowest-priced match and adding to cart.",
    action: { type: "CLICK", x: 512, y: 640 },
    cursor: { x: 512, y: 640 },
    log: { type: "VER", text: "SUCCESS — 3 matching products rendered, price ≤ $100" },
  },
  {
    t: 10.1,
    path: "B",
    state: "EXECUTING",
    thought: "Proceeding to guest checkout.",
    action: { type: "CLICK", x: 1180, y: 40 },
    cursor: { x: 1180, y: 40 },
    log: { type: "ACT", text: "CLICK(x:1180, y:40) → target [#31: 'Checkout']" },
  },
  {
    t: 11.0,
    path: "B",
    state: "EVALUATING",
    thought: "Contrast scan on checkout page flags the guest-checkout button.",
    action: null,
    cursor: { x: 1180, y: 40 },
    log: { type: "A11Y", text: "WCAG 1.4.3 — contrast 2.8:1 on #guest-checkout-btn (needs 4.5:1)" },
    finding: {
      kind: "a11y",
      severity: "critical",
      wcag: "1.4.3 Contrast (Minimum)",
      title: "Insufficient contrast on 'Continue as Guest' button",
      plain: "Anyone with low vision, or just using their phone in bright sunlight, may not be able to read this button's text against its background — meaning they can't tell it's clickable, let alone find it.",
      affects: "Low-vision users, older users, anyone in bright ambient light",
      detail: "Text color #9CA3AF on background #F3F4F6 measures 2.8:1, below the required 4.5:1 for normal text.",
      selector: "#guest-checkout-btn",
      fix: "Change text color to #4B5563 or darker, or darken the button background to reach a 4.5:1 ratio.",
      timestamp: "00:11.0",
    },
  },
  {
    t: 12.0,
    path: "B",
    state: "EXECUTING",
    thought: "Filling guest checkout form — name, email, address.",
    action: { type: "TYPE", x: 400, y: 220, text: "guest@demo.com" },
    cursor: { x: 400, y: 220 },
    log: { type: "ACT", text: "TYPE(x:400, y:220, text:\"guest@demo.com\")" },
  },
  {
    t: 12.8,
    path: "B",
    state: "EVALUATING",
    thought: "Zip code field has no accessible label — a11y tree exposes it only as 'textbox'.",
    action: null,
    cursor: { x: 400, y: 300 },
    log: { type: "A11Y", text: "WCAG 4.1.2 — missing accessible name on #zip-input" },
    finding: {
      kind: "a11y",
      severity: "high",
      wcag: "4.1.2 Name, Role, Value",
      title: "Zip code input missing accessible label",
      plain: "A screen reader announces this field only as 'edit text' — with no clue it wants a ZIP code. A blind user has to guess, or gives up and abandons checkout entirely.",
      affects: "Screen reader users (blind or low-vision)",
      detail: "Input is exposed to the accessibility tree with role 'textbox' and no accessible name. Screen reader users cannot identify the field's purpose.",
      selector: "#zip-input",
      fix: "Add a visible <label for=\"zip-input\"> or an aria-label=\"ZIP code\" attribute.",
      timestamp: "00:12.8",
    },
  },
  {
    t: 13.6,
    path: "B",
    state: "EXECUTING",
    thought: "Submitting order.",
    action: { type: "CLICK", x: 640, y: 520 },
    cursor: { x: 640, y: 520 },
    log: { type: "ACT", text: "CLICK(x:640, y:520) → target [#40: 'Place Order']" },
  },
  {
    t: 14.5,
    path: "B",
    state: "EVALUATING",
    thought: "Order confirmation screen reached. Terminal condition satisfied.",
    action: null,
    cursor: { x: 640, y: 520 },
    log: { type: "VER", text: "SUCCESS — terminal condition matched: 'Order placed'" },
  },
  {
    t: 15.0,
    path: "B",
    state: "IDLE",
    thought: "Goal complete via Path B. Compiling audit report.",
    action: null,
    cursor: { x: 640, y: 520 },
    log: { type: "SYS", text: "Run complete — 2 paths explored, 1 blocked, report generated" },
  },
];

// Path Priority Queue / Journey Graph — nodes and edges for the right panel.
export const journeyGraph = {
  nodes: [
    { id: "n0", label: "Homepage", status: "success", path: null },
    { id: "n1", label: "Search Results", status: "success", path: "A" },
    { id: "n2", label: "Price Filter (dead click)", status: "blocker", path: "A" },
    { id: "n3", label: "Category: Running", status: "success", path: "B" },
    { id: "n4", label: "Filtered: Blue < $100", status: "success", path: "B" },
    { id: "n5", label: "Checkout (contrast issue)", status: "friction", path: "B" },
    { id: "n6", label: "Guest Form (label issue)", status: "friction", path: "B" },
    { id: "n7", label: "Order Confirmed", status: "success", path: "B" },
    { id: "n8", label: "Promo Tile", status: "unexplored", path: "C" },
  ],
  edges: [
    { from: "n0", to: "n1", path: "A" },
    { from: "n1", to: "n2", path: "A" },
    { from: "n0", to: "n3", path: "B" },
    { from: "n3", to: "n4", path: "B" },
    { from: "n4", to: "n5", path: "B" },
    { from: "n5", to: "n6", path: "B" },
    { from: "n6", to: "n7", path: "B" },
    { from: "n0", to: "n8", path: "C" },
  ],
};

// Tab 1 — Goal Verdict & Path Comparison
export const pathComparison = [
  {
    path: "Path A — Search Bar",
    steps: 3,
    time: "6.4s",
    frictionScore: 8.5,
    verdict: "Blocked",
    detail: "Price filter is a dead click — path abandoned after repeated no-op.",
  },
  {
    path: "Path B — Category Nav",
    steps: 9,
    time: "8.6s",
    frictionScore: 4.2,
    verdict: "Passed (High-Friction)",
    detail: "Completed successfully but hit 1 contrast violation and 1 missing-label violation en route.",
  },
  {
    path: "Path C — Promo Tile",
    steps: 0,
    time: "—",
    frictionScore: null,
    verdict: "Not explored",
    detail: "Exploration budget reached after Path B satisfied the terminal condition.",
  },
];

// Tab 2 — UX Friction Findings (derived from timeline `finding.kind === 'ux'`)
export const uxFindings = timeline
  .filter((e) => e.finding?.kind === "ux")
  .map((e) => e.finding);

// Tab 3 — Accessibility Audit (derived from timeline `finding.kind === 'a11y'`)
export const a11yFindings = timeline
  .filter((e) => e.finding?.kind === "a11y")
  .map((e) => e.finding);

export const summary = {
  verdict: "Passed (High-Friction)",
  pathsExplored: 2,
  pathsBlocked: 1,
  totalSteps: 12,
  totalTime: "15.0s",
  a11yViolations: a11yFindings.length,
  uxIssues: uxFindings.length,
};