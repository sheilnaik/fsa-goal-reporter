const PLAYERS = [
  "Ben",
  "Everett",
  "Liam",
  "Bobby",
  "Henry",
  "Giovanni",
  "Mikey",
  "Miguel",
  "Diagoras",
  "Andy",
  "Peter",
  "Caden",
];

// Ensure dropdowns are alphabetical
const SORTED_PLAYERS = [...PLAYERS].sort((a, b) => a.localeCompare(b));

const zoneNice = {
  "top-left": "top left",
  "top-center": "top center",
  "top-right": "top right",
  "middle-left": "middle left",
  "middle-center": "middle center",
  "middle-right": "middle right",
  "bottom-left": "bottom left",
  "bottom-center": "bottom center",
  "bottom-right": "bottom right",
};

// Hype line is now fixed to "⚽ FSA GOAL! ⚽"

const scorerEl = document.getElementById("scorer");
const assistEl = document.getElementById("assist");
const minuteEl = document.getElementById("minute");
const minuteBtn = document.getElementById("minuteBtn");
const minuteModal = document.getElementById("minuteModal");
const minuteClose = document.getElementById("minuteClose");
const numpad = document.getElementById("numpad");
const numpadDisplay = document.getElementById("numpadDisplay");
const numpadError = document.getElementById("numpadError");
const outputEl = document.getElementById("output");
const generateBtn = document.getElementById("generate");
const resetBtn = document.getElementById("reset");
const zoneLabel = document.getElementById("zoneLabel");

let selectedZone = null;
const STORAGE_KEY = "fsa-goal-state-v1";

function populatePlayers() {
  // Scorer options
  SORTED_PLAYERS.forEach((p) => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    scorerEl.appendChild(o);
  });

  // Assist options (None first, then players)
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "None";
  assistEl.appendChild(none);

  SORTED_PLAYERS.forEach((p) => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    assistEl.appendChild(o);
  });
}

// Minute entry via numpad modal
let numpadBuffer = ""; // current typed value

function openMinuteModal() {
  // seed buffer from current minute value
  numpadBuffer = minuteEl.value || "";
  renderNumpad();
  minuteModal.hidden = false;
  // Focus first key for accessibility
  const firstKey = numpad.querySelector('button[data-key="1"]');
  if (firstKey) firstKey.focus();
}

function closeMinuteModal() {
  minuteModal.hidden = true;
  minuteBtn.focus();
}

function clampAndValidate(valStr) {
  // normalize leading zeros (e.g., "05" -> 5)
  const n = valStr === "" ? NaN : parseInt(valStr, 10);
  const valid = Number.isFinite(n) && n > 0 && n < 60;
  return { n, valid };
}

function renderNumpad() {
  const { n, valid } = clampAndValidate(numpadBuffer);
  numpadDisplay.textContent = numpadBuffer === "" ? "--" : String(n);
  if (numpadBuffer === "") {
    numpadError.textContent = "";
  } else if (!valid) {
    numpadError.textContent = "Enter a value 1–59";
  } else {
    numpadError.textContent = "";
  }
  // Enable/disable confirm button based on validity
  const confirmBtn = numpad.querySelector('button[data-action="confirm"]');
  if (confirmBtn) confirmBtn.disabled = !valid;
}

function handleNumpadClick(e) {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  const key = t.getAttribute("data-key");
  const action = t.getAttribute("data-action");
  if (key !== null) {
    // Append digit, limit raw length to 2
    if (numpadBuffer.length < 2) {
      numpadBuffer += key;
    } else {
      // Allow replacing buffer if first digit is 0, or ignore
      // Keep it simple: ignore when at 2 digits
    }
    renderNumpad();
  } else if (action === "backspace") {
    numpadBuffer = numpadBuffer.slice(0, -1);
    renderNumpad();
  } else if (action === "confirm") {
    const { n, valid } = clampAndValidate(numpadBuffer);
    if (valid) {
      minuteEl.value = String(n);
      minuteBtn.textContent = `Minute: ${n}′`;
      persistState();
      closeMinuteModal();
    } else {
      renderNumpad();
    }
  }
}

function setupGoalZones() {
  const goal = document.querySelector(".goal");
  const zones = Array.from(goal.querySelectorAll(".zone"));
  zones.forEach((btn) => {
    btn.addEventListener("click", () => {
      zones.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedZone = btn.getAttribute("data-zone");
      zoneLabel.textContent = `Selected: ${zoneNice[selectedZone]}`;
      persistState();
    });
  });
}

function buildSnippet() {
  const scorer = scorerEl.value;
  const assist = assistEl.value;
  const minute = minuteEl.value;
  const minutePart = `${minute}'`;
  const assistPart = assist ? ` from ${assist}` : "";

  let placePart = "";
  if (selectedZone && zoneNice[selectedZone]) {
    const z = zoneNice[selectedZone];
    const corner = z.includes("left") || z.includes("right") ? " corner" : "";
    placePart = `${capitalize(z)}${corner}`;
  }

  // Attributes: use checkbox values for narrative (contain prepositions)
  const attrsValues = Array.from(
    document.querySelectorAll('#attributes input[type="checkbox"]:checked')
  ).map((c) => c.value);

  const attributesPart = listToEnglish(attrsValues);

  // Compose concise, lively snippet
  const lines = [];
  lines.push(`⚽ FSA GOAL! ⚽`);
  lines.push(""); // blank line
  lines.push(`⚽ Scorer: ${scorer}`);
  if (assist) lines.push(`🤝 Assist: ${assist}`);
  lines.push(`⏱️ Minute: ${minutePart}`);

  // Narrative combining zone + attributes
  const narrative = buildNarrative(selectedZone, attributesPart);
  if (narrative) {
    lines.push(`📝 Details:`);
    lines.push(narrative);
  }
  lines.push("");
  lines.push("Let's go FSA!");
  return lines.join("\n");
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function listToEnglish(list) {
  if (!list || list.length === 0) return "";
  if (list.length === 1) return list[0];
  return list.slice(0, -1).join(", ") + " and " + list.slice(-1);
}

function buildNarrative(zoneKey, attrsStr) {
  const verbs = ["buries it", "slots it", "smashes it", "fires it", "tucks it", "drills it"];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  let zonePhrase = "";
  switch (zoneKey) {
    case 'top-left': zonePhrase = 'into the top left corner'; break;
    case 'top-right': zonePhrase = 'into the top right corner'; break;
    case 'bottom-left': zonePhrase = 'into the bottom left corner'; break;
    case 'bottom-right': zonePhrase = 'into the bottom right corner'; break;
    case 'top-center': zonePhrase = 'into the top center'; break;
    case 'bottom-center': zonePhrase = 'into the bottom center'; break;
    case 'middle-left': zonePhrase = 'into the middle left side'; break;
    case 'middle-right': zonePhrase = 'into the middle right side'; break;
    case 'middle-center': zonePhrase = 'down the middle'; break;
    default: zonePhrase = '';
  }

  let sentence = '';
  if (zonePhrase && attrsStr) {
    sentence = `${capitalize(verb)} ${zonePhrase} ${attrsStr}. ✨🎯`;
  } else if (zonePhrase) {
    sentence = `${capitalize(verb)} ${zonePhrase}. 🎯`;
  } else if (attrsStr) {
    sentence = `${capitalize(verb)} ${attrsStr}. ✨`;
  }
  return sentence;
}

async function onGenerate() {
  // Ensure minute is valid before generating
  const m = parseInt(minuteEl.value, 10);
  if (!Number.isFinite(m) || m <= 0 || m >= 60) {
    openMinuteModal();
    return;
  }
  const snippet = buildSnippet();
  outputEl.value = snippet;
  persistState();
  try {
    await navigator.clipboard.writeText(snippet);
    const original = generateBtn.textContent;
    generateBtn.textContent = "Copied!";
    setTimeout(() => (generateBtn.textContent = original), 1200);
  } catch (_) {
    // Fallback: select text for manual copy
    outputEl.focus();
    outputEl.select();
  }
}

// copy action integrated into onGenerate()

function getState() {
  const attrs = Array.from(
    document.querySelectorAll('#attributes input[type="checkbox"]')
  ).map((c) => ({ v: c.value, checked: c.checked }));
  return {
    scorer: scorerEl.value,
    assist: assistEl.value,
    minute: minuteEl.value,
    zone: selectedZone,
    attrs,
    output: outputEl.value,
  };
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getState()));
  } catch {}
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s.scorer) scorerEl.value = s.scorer;
    if (typeof s.assist === 'string') assistEl.value = s.assist;
    if (typeof s.minute === 'string') minuteEl.value = s.minute;
    // Clamp minute to valid range or clear
    const m = parseInt(minuteEl.value, 10);
    if (!Number.isFinite(m) || m <= 0 || m >= 60) {
      minuteEl.value = '';
      minuteBtn.textContent = 'Set minute…';
    } else {
      minuteBtn.textContent = `Minute: ${m}′`;
    }
    if (s.zone) {
      selectedZone = s.zone;
      const btn = document.querySelector(`.goal .zone[data-zone="${selectedZone}"]`);
      if (btn) {
        document.querySelectorAll('.goal .zone').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        zoneLabel.textContent = `Selected: ${zoneNice[selectedZone]}`;
      }
    }
    if (Array.isArray(s.attrs)) {
      const map = new Map(s.attrs.map((a) => [a.v, a.checked]));
      document.querySelectorAll('#attributes input[type="checkbox"]').forEach((c) => {
        c.checked = !!map.get(c.value);
      });
    }
    if (s.output) {
      outputEl.value = s.output;
    }
  } catch {}
}

function onReset() {
  // Clear selections
  scorerEl.selectedIndex = 0;
  assistEl.selectedIndex = 0;
  minuteEl.value = '';
  minuteBtn.textContent = 'Set minute…';
  document.querySelectorAll('#attributes input[type="checkbox"]').forEach((c) => (c.checked = false));
  document.querySelectorAll('.goal .zone').forEach((b) => b.classList.remove('selected'));
  selectedZone = null;
  zoneLabel.textContent = 'No zone selected';
  outputEl.value = '';
  copyBtn.disabled = true;
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

// Init
populatePlayers();
setupGoalZones();
restoreState();
generateBtn.addEventListener("click", onGenerate);
resetBtn.addEventListener("click", onReset);

// Minute modal wiring
minuteBtn.addEventListener('click', openMinuteModal);
minuteClose.addEventListener('click', closeMinuteModal);
minuteModal.addEventListener('click', (e) => {
  if (e.target === minuteModal) closeMinuteModal();
});
numpad.addEventListener('click', handleNumpadClick);

// Persist on change
scorerEl.addEventListener('change', persistState);
assistEl.addEventListener('change', persistState);
document.getElementById('attributes').addEventListener('change', persistState);
